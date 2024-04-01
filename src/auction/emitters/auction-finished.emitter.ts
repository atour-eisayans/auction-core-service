import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BidService } from '../../bid/bid.service';
import { AuctionState } from '../../shared/enum/auction-state.enum';
import { TaskType } from '../../shared/enum/task-type.enum';
import taskNameGenerator from '../../shared/helper/task-name-generator';
import { TaskService } from '../../task/task.service';
import { UserService } from '../../user/user.service';
import { AuctionService } from '../auction.service';
import { AuctionFinishedEvent } from '../events/auction-finished.event';

@Injectable()
export class AuctionFinishedEmitter {
  constructor(
    private readonly bidService: BidService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly auctionService: AuctionService,
  ) {}

  private async deleteTask(
    auctionId: string,
    taskType: TaskType,
  ): Promise<void> {
    const taskName = taskNameGenerator(taskType, auctionId);
    await this.taskService.deleteTask(taskName);
  }

  @OnEvent('auction.finished')
  public async handleAuctionFinishedEvent(payload: AuctionFinishedEvent) {
    const { auctionId } = payload;

    await this.deleteTask(auctionId, TaskType.AuctionFinish);
    await this.deleteTask(auctionId, TaskType.CheckAutomatedBid);

    await this.auctionService.updateAuction(auctionId, {
      state: AuctionState.Finished,
      endedAt: new Date(),
    });

    await this.auctionService.updateAuctionResult(auctionId, new Date());

    const automatedBids = await this.bidService.readAllAutomatedBids(auctionId);

    const refundPromises = automatedBids.map((bid) =>
      this.userService.increaseUserTicketBalance(
        bid.user.id,
        bid.auction.item.ticketConfiguration.id,
        bid.ticketCount,
      ),
    );

    await Promise.all(refundPromises);

    await this.bidService.removeAllDeprecatedBids(auctionId);
  }
}
