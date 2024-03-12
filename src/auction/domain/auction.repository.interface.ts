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
  save: (auction: Auction) => string | Promise<string>;
  findById: (auctionId: string) => Auction | null | Promise<Auction | null>;
  findAll: (
    filter: AuctionsListFilter,
  ) => AuctionsListResponse | Promise<AuctionsListResponse>;
}
