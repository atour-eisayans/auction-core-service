import { Injectable } from '@nestjs/common';
import { AuctionEntity } from './entities/auction.entity';
import { Auction } from './domain/auction';
import { ItemEntity } from '../item/entities/item.entity';
import { Item } from '../item/domain/item';
import { ItemCategory } from '../item/domain/item-category';
import { Currency } from '../currency/domain/currency';

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
        currency: new Currency({
          id: entity.item.currency.id,
          code: entity.item.currency.code,
          symbol: entity.item.currency.symbol,
        }),
      }),
      name: entity.name,
      state: entity.state,
      endedAt: entity.endedAt,
      startAt: entity.startAt,
      limits: entity.limits,
    });
  }
}
