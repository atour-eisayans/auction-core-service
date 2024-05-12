interface AuctionStartedEventInterface {
  auctionId: string;
}

export class AuctionStartedEvent implements AuctionStartedEventInterface {
  public readonly auctionId: string;

  constructor(input: AuctionStartedEventInterface) {
    this.auctionId = input.auctionId;
  }
}
