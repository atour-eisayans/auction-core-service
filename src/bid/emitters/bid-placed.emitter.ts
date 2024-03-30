import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AuctionService } from '../../auction/auction.service';
import { TaskType } from '../../shared/enum/task-type.enum';
import taskNameGenerator from '../../shared/helper/task-name-generator';
import { TaskService } from '../../task/task.service';
import { AuctionFinishedEvent } from '../../auction/events/auction-finished.event';
import { BidPlacedEvent } from '../events/bid-placed.event';

@Injectable()
export class BidPlacedEmitter {
  constructor(
    private readonly auctionService: AuctionService,
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async deleteTask(
    auctionId: string,
    taskType: TaskType,
  ): Promise<void> {
    const taskName = taskNameGenerator(taskType, auctionId);
    await this.taskService.deleteTask(taskName);
  }

  private async scheduleFinishAuctionTask(auctionId: string): Promise<string> {
    const finishTimeout =
      this.configService.get<number>('AUCTION_FINISH_TIMEOUT_SECONDS') ?? 25;

    return await this.taskService.scheduleTask(
      TaskType.AuctionFinish,
      auctionId,
      finishTimeout,
      async () => {
        this.eventEmitter.emit(
          'auction.finished',
          new AuctionFinishedEvent({ auctionId }),
        );
      },
    );
  }

  @OnEvent('bid.placed')
  public async handleBidPlacedLocalEvent(payload: BidPlacedEvent) {
    const { auctionId, userId } = payload;

    await this.auctionService.updateAuctionPriceBasedOnBid(auctionId);
    await this.auctionService.updateAuctionWinner(auctionId, userId);
    await this.scheduleFinishAuctionTask(auctionId);
    await this.deleteTask(auctionId, TaskType.AuctionExpire);
    await this.auctionService.processAuctionTick(auctionId);
  }
}
