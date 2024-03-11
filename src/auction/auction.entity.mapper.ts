import { Injectable } from '@nestjs/common';
import { AuctionEntity } from './entities/auction.entity';
import { Auction } from './domain/auction';
import { ItemEntity } from '../item/entities/item.entity';

@Injectable()
export class AuctionEntityMapper {
  public mapAuctionDomainToDbEntity(domain: Auction): AuctionEntity {
    return <AuctionEntity>{
      id: domain.id,
      item: {
        id: domain.item.id,
      } as ItemEntity,
      name: domain.name,
      state: domain.state,
      startAt: domain.startAt,
      endedAt: domain.endedAt,
      limits: domain.limits,
    };
  }
}
