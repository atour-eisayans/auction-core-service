import { Currency } from './currency';

interface TicketConfigurationProperties {
  id: string;
  unitPrice: number;
  currency: Currency;
  raisingAmount: number;
}

export class TicketConfiguration implements TicketConfigurationProperties {
  public readonly id: string;
  public readonly unitPrice: number;
  public readonly currency: Currency;
  public readonly raisingAmount: number;

  constructor(input: TicketConfigurationProperties) {
    this.id = input.id;
    this.unitPrice = input.unitPrice;
    this.currency = input.currency;
    this.raisingAmount = input.raisingAmount;
  }
}
