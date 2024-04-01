import { AutomatedBid } from './automated-bid';

export interface BidRepositoryInterface {
  placeBid: (auctionId: string, userId: string) => number | Promise<number>;
  shuffleAutomatedBids: (auctionId: string) => void | Promise<void>;
  findNextAutomatedBid: (
    auctionId: string,
    currentBidderId?: string,
  ) => AutomatedBid | null | Promise<AutomatedBid | null>;
  findAllAutomatedBids: (
    auctionId: string,
  ) => AutomatedBid[] | Promise<AutomatedBid[]>;
  decreaseUserFreezedTicketCount: (
    auctionId: string,
    userId: string,
  ) => void | Promise<void>;
  setLastBidderFlagFalse: (auctionId: string) => void | Promise<void>;
  removeAutomatedBids: (auctionId: string) => void | Promise<void>;
}
