import { LocalizedString } from './localized-string';

interface ItemCategoryProperties {
  id: string;
  name: LocalizedString;
}

export class ItemCategory implements ItemCategoryProperties {
  public readonly id: string;
  public readonly name: LocalizedString;

  constructor(input: ItemCategoryProperties) {
    this.id = input.id;
    this.name = input.name;
  }
}
