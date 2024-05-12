import { PersistencyOptions } from '../../shared/domain/persistency-options.interface';
import { Auction } from './auction';

export interface AuctionsListFilter {
  page: number;
  limit: number;
}

export interface AuctionsListResponse {
  auctions: Auction[];
  totalCount: number;
}

export interface AuctionRepositoryInterface {
  save: (
    auction: Auction,
    persistencyOptions?: PersistencyOptions,
  ) => string | Promise<string>;
  findById: (
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ) => Auction | null | Promise<Auction | null>;
  findAll: (
    filter: AuctionsListFilter,
    persistencyOptions?: PersistencyOptions,
  ) => AuctionsListResponse | Promise<AuctionsListResponse>;
  updateAuctionWinner: (
    auctionId: string,
    winnerId: string,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
  updateAuctionResult: (
    auctionId: string,
    finishedAt: Date,
    persistencyOptions?: PersistencyOptions,
  ) => void | Promise<void>;
}
