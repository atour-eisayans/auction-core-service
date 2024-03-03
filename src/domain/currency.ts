interface CurrencyProperties {
  id: string;
  symbol: string;
}

export class Currency implements CurrencyProperties {
  public readonly id: string;
  public readonly symbol: string;

  constructor(input: CurrencyProperties) {
    this.id = input.id;
    this.symbol = input.symbol;
  }
}
