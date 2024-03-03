import { Auction } from './auction';
import { User } from './user';

interface AuctionResultProperties {
  id: string;
  auction: Auction;
  winner: User;
  finishedAt?: Date;
}

export class AuctionResult implements AuctionResultProperties {
  public readonly id: string;
  public readonly auction: Auction;
  public readonly winner: User;
  public readonly finishedAt?: Date;

  constructor(input: AuctionResultProperties) {
    this.id = input.id;
    this.auction = input.auction;
    this.winner = input.winner;
    this.finishedAt = input.finishedAt;
  }
}
