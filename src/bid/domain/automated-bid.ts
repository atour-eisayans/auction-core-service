import { Auction } from '../../auction/domain/auction';
import { User } from '../../user/domain/user';

interface AutomatedBidProperties {
  id: string;
  user: User;
  auction: Auction;
  ticketCount: number;
  lastBidder: boolean;
}

export class AutomatedBid implements AutomatedBidProperties {
  public readonly id: string;
  public readonly user: User;
  public readonly auction: Auction;
  public readonly ticketCount: number;
  public readonly lastBidder: boolean;

  constructor(input: AutomatedBidProperties) {
    this.id = input.id;
    this.user = input.user;
    this.auction = input.auction;
    this.ticketCount = input.ticketCount;
    this.lastBidder = input.lastBidder;
  }
}
