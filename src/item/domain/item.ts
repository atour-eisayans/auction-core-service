import { ItemCategory } from './item-category';
import { LocalizedString } from '../../shared/domain/localized-string';
import { TicketConfiguration } from '../../ticket-configuration/domain/ticket-configuration';

interface ItemProperties {
  id: string;
  name: LocalizedString;
  price: number;
  ticketConfiguration: TicketConfiguration;
  category: ItemCategory;
}

export class Item implements ItemProperties {
  public readonly id: string;
  public readonly name: LocalizedString;
  public readonly price: number;
  public readonly ticketConfiguration: TicketConfiguration;
  public readonly category: ItemCategory;

  constructor(input: ItemProperties) {
    this.id = input.id;
    this.name = input.name;
    this.price = input.price;
    this.ticketConfiguration = input.ticketConfiguration;
    this.category = input.category;
  }
}
