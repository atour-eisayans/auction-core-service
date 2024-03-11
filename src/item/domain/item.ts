import { Currency } from '../../currency/domain/currency';
import { ItemCategory } from './item-category';
import { LocalizedString } from '../../shared/domain/localized-string';

interface ItemProperties {
  id: string;
  name: LocalizedString;
  price: number;
  currency: Currency;
  category: ItemCategory;
}

export class Item implements ItemProperties {
  public readonly id: string;
  public readonly name: LocalizedString;
  public readonly price: number;
  public readonly currency: Currency;
  public readonly category: ItemCategory;

  constructor(input: ItemProperties) {
    this.id = input.id;
    this.name = input.name;
    this.price = input.price;
    this.currency = input.currency;
    this.category = input.category;
  }
}
