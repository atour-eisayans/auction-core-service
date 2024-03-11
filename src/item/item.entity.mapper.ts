import { Injectable } from '@nestjs/common';
import { Item } from './domain/item';
import { ItemEntity } from './entities/item.entity';

@Injectable()
export class ItemEntityMapper {
  public mapItemDomainToDbEntity(domain: Item): ItemEntity {
    return <ItemEntity>{
      id: domain.id,
      name: domain.name,
      price: domain.price,
      category: {
        id: domain.category.id,
        name: domain.category.name,
      },
      currency: domain.currency,
    };
  }
}
