import { TicketConfiguration } from './ticket-configuration';
import { User } from './user';

interface UserTicketBalanceProperties {
  id: string;
  user: User;
  ticketType: TicketConfiguration;
  balance: number;
}

export class UserTicketBalance implements UserTicketBalanceProperties {
  public readonly id: string;
  public readonly user: User;
  public readonly ticketType: TicketConfiguration;
  public readonly balance: number;

  constructor(input: UserTicketBalanceProperties) {
    this.id = input.id;
    this.user = input.user;
    this.ticketType = input.ticketType;
    this.balance = input.balance;
  }
}
