import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionManagerInterface } from '../../shared/domain/transaction-manager.interface';
import { AuctionState } from '../../shared/enum/auction-state.enum';
import { TaskType } from '../../shared/enum/task-type.enum';
import taskNameGenerator from '../../shared/helper/task-name-generator';
import { TaskService } from '../../task/task.service';
import { AuctionService } from '../auction.service';
import { AuctionExpiredEvent } from '../events/auction-expired.event';

@Injectable()
export class AuctionExpiredEmitter {
  constructor(
    private readonly taskService: TaskService,
    private readonly auctionService: AuctionService,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  private async deleteTask(
    auctionId: string,
    taskType: TaskType,
  ): Promise<void> {
    const taskName = taskNameGenerator(taskType, auctionId);
    await this.taskService.deleteTask(taskName);
  }

  @OnEvent('auction.expired')
  public async handleAuctionExpiredEvent(payload: AuctionExpiredEvent) {
    const { auctionId } = payload;
    const transactionName = `auction_expired_${auctionId}_${Date.now()}`;

    await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        await this.deleteTask(auctionId, TaskType.AuctionExpire);
        await this.deleteTask(auctionId, TaskType.CheckAutomatedBid);

        await this.auctionService.updateAuction(
          auctionId,
          {
            state: AuctionState.Expired,
          },
          { transactionName },
        );

        await this.auctionService.updateAuctionResult(auctionId, new Date(), {
          transactionName,
        });
      },
    );
  }
}
