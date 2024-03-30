import { Injectable } from '@nestjs/common';
import { AuctionEntityMapper } from '../auction/auction.entity.mapper';
import { UserEntityMapper } from '../user/user.entity.mapper';
import { AutomatedBid } from './domain/automated-bid';
import { AutomatedBidEntity } from './entities/automated_bid.entity';

@Injectable()
export class BidEntityMapper {
  constructor(
    private readonly auctionEntityMapper: AuctionEntityMapper,
    private readonly userEntityMapper: UserEntityMapper,
  ) {}

  public mapAutomatedBidEntityToDomain(
    entity: AutomatedBidEntity,
  ): AutomatedBid {
    return new AutomatedBid({
      id: entity.id,
      auction: this.auctionEntityMapper.mapAuctionDbEntityToDomain(
        entity.auction,
      ),
      user: this.userEntityMapper.mapUserDbEntityToDomain(entity.user),
      lastBidder: entity.lastBidder,
      ticketCount: entity.ticketCount,
    });
  }
}
