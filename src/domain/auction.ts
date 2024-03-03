import { AuctionRuleKey } from './enum/auction-rule-key.enum';
import { AuctionState } from './enum/auction-state.enum';
import { Item } from './item';
import { LocalizedString } from './localized-string';

type AuctionLimit = Record<AuctionRuleKey, unknown>;

interface AuctionProperties {
  id: string;
  name: LocalizedString;
  item: Item;
  startAt: Date;
  endedAt?: Date;
  state: AuctionState;
  limits?: AuctionLimit;
}

export class Auction implements AuctionProperties {
  public readonly id: string;
  public readonly name: LocalizedString;
  public readonly item: Item;
  public readonly startAt: Date;
  public readonly endedAt?: Date;
  public readonly state: AuctionState;
  public readonly limits?: AuctionLimit;

  constructor(input: AuctionProperties) {
    this.id = input.id;
    this.name = input.name;
    this.item = input.item;
    this.startAt = input.startAt;
    this.endedAt = input.endedAt;
    this.state = input.state;
    this.limits = input.limits;
  }
}
