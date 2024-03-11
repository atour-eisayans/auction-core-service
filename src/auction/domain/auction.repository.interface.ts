import { Auction } from './auction';

export interface AuctionRepositoryInterface {
  save: (auction: Auction) => string | Promise<string>;
  findById: (auctionId: string) => Auction | null | Promise<Auction | null>;
}
