import { Auction } from './auction';
import { User } from './user';

interface BidProperties {
  id: string;
  auction: Auction;
  user: User;
  lastUpdatedAt: Date;
  totalBids: number;
}

export class Bid implements BidProperties {
  public readonly id: string;
  public readonly auction: Auction;
  public readonly user: User;
  public readonly lastUpdatedAt: Date;
  public readonly totalBids: number;

  constructor(input: BidProperties) {
    this.id = input.id;
    this.auction = input.auction;
    this.user = input.user;
    this.lastUpdatedAt = input.lastUpdatedAt;
    this.totalBids = input.totalBids;
  }
}
