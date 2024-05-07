import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuctionRepositoryInterface } from '../auction/domain/auction.repository.interface';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';
import { User } from '../user/domain/user';
import { UserRepositoryInterface } from '../user/domain/user.repository.interface';
import { AutomatedBid } from './domain/automated-bid';
import { BidRepositoryInterface } from './domain/bid.repository.interface';
import { BidPlacedEvent } from './events/bid-placed.event';

@Injectable()
export class BidService {
  constructor(
    @Inject('BidRepositoryInterface')
    private readonly bidRepository: BidRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('AuctionRepositoryInterface')
    private readonly auctionRepository: AuctionRepositoryInterface,
    private readonly eventEmitter: EventEmitter2,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  public async placeBid(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    const auction = await this.auctionRepository.findById(
      auctionId,
      persistencyOptions,
    );

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const userNewBalance = await this.userRepository.decreaseUserTicketBalance(
      userId,
      auction.item.ticketConfiguration.id,
      1,
      persistencyOptions,
    );

    if (userNewBalance === null) {
      throw new NotFoundException('User not found');
    }

    const totalBids = await this.bidRepository.placeBid(
      auctionId,
      userId,
      persistencyOptions,
    );

    this.eventEmitter.emit(
      'bid.placed',
      new BidPlacedEvent({ auctionId, userId }),
    );

    return totalBids;
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

        if (nextAutomatedBid) {
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

          return lastBidder;
        }

        return null;
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
