interface AuctionFinishedEventInterface {
  auctionId: string;
}

export class AuctionFinishedEvent implements AuctionFinishedEventInterface {
  public readonly auctionId: string;

  constructor(input: AuctionFinishedEventInterface) {
    this.auctionId = input.auctionId;
  }
}
