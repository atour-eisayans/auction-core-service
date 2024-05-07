import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PersistencyOptions } from '../../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../../shared/domain/transaction-manager.interface';
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
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
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

  private async calculateInitialPrice(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    const auction = await this.auctionService.findById(
      auctionId,
      persistencyOptions,
    );

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
    const transactionName = `auction_started_${auctionId}_${Date.now()}`;

    await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        await this.scheduleExpireAuctionTask(auctionId);

        const initialPrice = await this.calculateInitialPrice(auctionId, {
          transactionName,
        });

        await this.auctionService.updateAuction(
          auctionId,
          {
            startAt: new Date(),
            state: AuctionState.Active,
            currentPrice: initialPrice,
          },
          { transactionName },
        );

        await this.auctionService.processAuctionTick(auctionId, {
          transactionName,
        });
      },
    );
  }
}
