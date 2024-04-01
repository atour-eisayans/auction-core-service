import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuctionRepositoryInterface } from '../auction/domain/auction.repository.interface';
import { User } from '../user/domain/user';
import { UserRepositoryInterface } from '../user/domain/user.repository.interface';
import { BidRepositoryInterface } from './domain/bid.repository.interface';
import { AutomatedBid } from './domain/automated-bid';
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
  ) {}

  public async placeBid(auctionId: string, userId: string): Promise<number> {
    const auction = await this.auctionRepository.findById(auctionId);

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const userNewBalance = await this.userRepository.decreaseUserTicketBalance(
      userId,
      auction.item.ticketConfiguration.id,
      1,
    );

    if (userNewBalance === null) {
      throw new NotFoundException('User not found');
    }

    const totalBids = await this.bidRepository.placeBid(auctionId, userId);

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
    const nextAutomatedBid = await this.bidRepository.findNextAutomatedBid(
      auctionId,
      currentBidderId,
    );

    if (nextAutomatedBid) {
      const lastBidder = nextAutomatedBid.user;

      await this.bidRepository.setLastBidderFlagFalse(auctionId);

      await this.bidRepository.decreaseUserFreezedTicketCount(
        auctionId,
        lastBidder.id,
      );

      await this.bidRepository.placeBid(auctionId, lastBidder.id);

      return lastBidder;
    }

    return null;
  }

  public async readAllAutomatedBids(
    auctionId: string,
  ): Promise<AutomatedBid[]> {
    return await this.bidRepository.findAllAutomatedBids(auctionId);
  }

  public async removeAllDeprecatedBids(auctionId: string): Promise<void> {
    await this.bidRepository.removeAutomatedBids(auctionId);
  }
}
