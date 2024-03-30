import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AuctionState } from '../../shared/enum/auction-state.enum';
import { TaskType } from '../../shared/enum/task-type.enum';
import { TaskService } from '../../task/task.service';
import { AuctionService } from '../auction.service';
import { AuctionExpiredEvent } from '../events/auction-expired.event';
import { AuctionStartedEvent } from '../events/auction-started.event';

@Injectable()
export class AuctionStartedEmitter {
  constructor(
    private readonly auctionService: AuctionService,
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async scheduleExpireAuctionTask(auctionId: string): Promise<string> {
    const expireTimeout =
      this.configService.get<number>('AUCTION_EXPIRE_TIMEOUT_HOURS') ?? 1;

    return await this.taskService.scheduleTask(
      TaskType.AuctionExpire,
      auctionId,
      expireTimeout * 60 * 60,
      () => {
        this.eventEmitter.emit(
          'auction.expired',
          new AuctionExpiredEvent({ auctionId }),
        );
      },
    );
  }

  private async calculateInitialPrice(auctionId: string): Promise<number> {
    const auction = await this.auctionService.findById(auctionId);

    const {
      item: { price: itemOriginalPrice },
      limits,
    } = auction;

    const startingPricePercent =
      ((limits?.item_max_price_percent &&
        Number(limits?.item_max_price_percent)) ??
        this.configService.get<number>('ITEM_STARTING_PRICE_PERCENT') ??
        20) / 100;

    return itemOriginalPrice * startingPricePercent;
  }

  @OnEvent('auction.started')
  public async handleAuctionStartedEvent(payload: AuctionStartedEvent) {
    const { auctionId } = payload;

    await this.scheduleExpireAuctionTask(auctionId);

    const initialPrice = await this.calculateInitialPrice(auctionId);

    await this.auctionService.updateAuction(auctionId, {
      startAt: new Date(),
      state: AuctionState.Active,
      currentPrice: initialPrice,
    });

    await this.auctionService.processAuctionTick(auctionId);
  }
}
