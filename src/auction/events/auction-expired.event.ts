interface AuctionExpiredEventInterface {
  auctionId: string;
}

export class AuctionExpiredEvent implements AuctionExpiredEventInterface {
  public readonly auctionId: string;

  constructor(input: AuctionExpiredEventInterface) {
    this.auctionId = input.auctionId;
  }
}
