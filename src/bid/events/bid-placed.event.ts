interface BidPlacedEventInterface {
  auctionId: string;
  userId: string;
}

export class BidPlacedEvent implements BidPlacedEventInterface {
  public readonly auctionId: string;
  public readonly userId: string;

  constructor(input: BidPlacedEventInterface) {
    this.auctionId = input.auctionId;
    this.userId = input.userId;
  }
}
