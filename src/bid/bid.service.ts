import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AuctionService } from '../auction/auction.service';
import { AuctionRepositoryInterface } from '../auction/domain/auction.repository.interface';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';
import { TaskType } from '../shared/enum/task-type.enum';
import taskNameGenerator from '../shared/helper/task-name-generator';
import { TaskService } from '../task/task.service';
import { User } from '../user/domain/user';
import { UserRepositoryInterface } from '../user/domain/user.repository.interface';
import { AutomatedBid } from './domain/automated-bid';
import { BidRepositoryInterface } from './domain/bid.repository.interface';

@Injectable()
export class BidService {
  constructor(
    @Inject('BidRepositoryInterface')
    private readonly bidRepository: BidRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('AuctionRepositoryInterface')
    private readonly auctionRepository: AuctionRepositoryInterface,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
    @Inject(forwardRef(() => AuctionService))
    private readonly auctionService: AuctionService,
    private readonly taskService: TaskService,
  ) {}

  // manual bid
  public async placeBid(auctionId: string, userId: string): Promise<number> {
    const transactionName = `place_bid_${auctionId}_${userId}_${Date.now()}`;

    return await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        const auction = await this.auctionRepository.findById(auctionId, {
          transactionName,
        });

        if (!auction) {
          throw new NotFoundException('Auction not found');
        }

        const userNewBalance =
          await this.userRepository.decreaseUserTicketBalance(
            userId,
            auction.item.ticketConfiguration.id,
            1,
            { transactionName },
          );

        if (userNewBalance === null) {
          throw new NotFoundException('User not found');
        }

        const totalBids = await this.bidRepository.placeBid(auctionId, userId, {
          transactionName,
        });

        await this.bidRepository.setLastBidderFlagFalse(auctionId, {
          transactionName,
        });

        await this.bidRepository.setUserLastBidderFlagTrue(auctionId, userId, {
          transactionName,
        });

        await this.auctionService.handleBidPlaced(auctionId, userId, {
          transactionName,
        });

        await this.processAuctionTick(auctionId);

        return totalBids;
      },
    );
  }

  public async processAuctionTick(auctionId: string): Promise<void> {
    const timeout = 20;

    await this.taskService.scheduleTask(
      TaskType.CheckAutomatedBid,
      auctionId,
      timeout,
      () => {
        this.iterateOverAutomatedBids(auctionId);
      },
    );
  }

  public async iterateOverAutomatedBids(
    auctionId: string,
    currentBidderId?: string,
  ): Promise<User | null> {
    const transactionName = `iterate_over_auction_${auctionId}`;

    return await this.transactionManager.runInTransaction<User | null>(
      transactionName,
      'REPEATABLE READ',
      async () => {
        const nextAutomatedBid = await this.bidRepository.findNextAutomatedBid(
          auctionId,
          currentBidderId,
          { transactionName },
        );

        if (!nextAutomatedBid) return null;

        const lastBidder = nextAutomatedBid.user;

        await this.bidRepository.setLastBidderFlagFalse(auctionId, {
          transactionName,
        });

        await this.bidRepository.decreaseUserFreezedTicketCount(
          auctionId,
          lastBidder.id,
          { transactionName },
        );

        await this.bidRepository.placeBid(auctionId, lastBidder.id, {
          transactionName,
        });

        await this.auctionService.handleBidPlaced(auctionId, lastBidder.id, {
          transactionName,
        });

        await this.processAuctionTick(auctionId);

        return lastBidder;
      },
    );
  }

  public async readAllAutomatedBids(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<AutomatedBid[]> {
    return await this.bidRepository.findAllAutomatedBids(
      auctionId,
      persistencyOptions,
    );
  }

  public async removeAllDeprecatedBids(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    await this.bidRepository.removeAutomatedBids(auctionId, persistencyOptions);
  }
}
