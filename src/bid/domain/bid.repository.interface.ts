import { AutomatedBid } from './automated-bid';

export interface BidRepositoryInterface {
  placeBid: (auctionId: string, userId: string) => number | Promise<number>;
  shuffleAutomatedBids: (auctionId: string) => void | Promise<void>;
  findNextAutomatedBid: (
    auctionId: string,
    currentBidderId?: string,
  ) => AutomatedBid | null | Promise<AutomatedBid | null>;
  decreaseUserFreezedTicketCount: (
    auctionId: string,
    userId: string,
  ) => void | Promise<void>;
  setLastBidderFlagFalse: (auctionId: string) => void | Promise<void>;
}
