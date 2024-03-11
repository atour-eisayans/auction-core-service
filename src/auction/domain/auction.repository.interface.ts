import { Auction } from './auction';

export interface AuctionRepositoryInterface {
  save: (auction: Auction) => string | Promise<string>;
}
