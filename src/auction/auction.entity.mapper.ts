import { Injectable } from '@nestjs/common';
import { AuctionEntity } from './entities/auction.entity';
import { Auction } from './domain/auction';
import { ItemEntity } from '../item/entities/item.entity';
import { Item } from '../item/domain/item';
import { ItemCategory } from '../item/domain/item-category';
import { TicketConfiguration } from '../ticket-configuration/domain/ticket-configuration';

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
      currentPrice: domain.currentPrice,
    };
  }

  public mapAuctionDbEntityToDomain(entity: AuctionEntity): Auction {
    return new Auction({
      id: entity.id,
      item: new Item({
        id: entity.item.id,
        category: new ItemCategory({
          id: entity.item.category.id,
          name: entity.item.category.name,
        }),
        name: entity.item.name,
        price: entity.item.price,
        ticketConfiguration: new TicketConfiguration({
          id: entity.item.ticketConfiguration.id,
          currency: entity.item.ticketConfiguration.currency,
          raisingAmount: entity.item.ticketConfiguration.raisingAmount,
          unitPrice: entity.item.ticketConfiguration.unitPrice,
        }),
      }),
      name: entity.name,
      state: entity.state,
      endedAt: entity.endedAt,
      startAt: entity.startAt,
      limits: entity.limits,
      currentPrice: entity.currentPrice,
    });
  }
}
