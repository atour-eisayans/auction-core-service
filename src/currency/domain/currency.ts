interface CurrencyProperties {
  id: string;
  symbol: string;
  code: string;
}

export class Currency implements CurrencyProperties {
  public readonly id: string;
  public readonly symbol: string;
  public readonly code: string;

  constructor(input: CurrencyProperties) {
    this.id = input.id;
    this.symbol = input.symbol;
    this.code = input.code;
  }
}
