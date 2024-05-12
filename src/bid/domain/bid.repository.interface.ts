import { PersistencyOptions } from '../../shared/domain/persistency-options.interface';
import { AutomatedBid } from './automated-bid';

export interface BidRepositoryInterface {
  placeBid: (
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ) => number | Promise<number>;
  shuffleAutomatedBids: (
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
  findNextAutomatedBid: (
    auctionId: string,
    currentBidderId?: string,
    persistencyOptions?: PersistencyOptions,
  ) => AutomatedBid | null | Promise<AutomatedBid | null>;
  findAllAutomatedBids: (
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ) => AutomatedBid[] | Promise<AutomatedBid[]>;
  decreaseUserFreezedTicketCount: (
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
  setLastBidderFlagFalse: (
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
  removeAutomatedBids: (
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
  setUserLastBidderFlagTrue: (
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
}
