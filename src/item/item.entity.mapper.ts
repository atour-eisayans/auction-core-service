import { Injectable } from '@nestjs/common';
import { TicketConfigurationEntity } from '../ticket-configuration/entites/ticket-configuration.entity';
import { Item } from './domain/item';
import { ItemCategoryEntity } from './entities/item-category.entity';
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
      } as ItemCategoryEntity,
      ticketConfiguration: {
        id: domain.ticketConfiguration.id,
        currency: domain.ticketConfiguration.currency,
        raisingAmount: domain.ticketConfiguration.raisingAmount,
        unitPrice: domain.ticketConfiguration.unitPrice,
      } as TicketConfigurationEntity,
    };
  }
}
