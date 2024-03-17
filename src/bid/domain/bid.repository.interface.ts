export interface BidRepositoryInterface {
  upsert: (auctionId: string, userId: string) => number | Promise<number>;
}
