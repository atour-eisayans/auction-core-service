import { PersistencyOptions } from '../../shared/domain/persistency-options.interface';
import { UserTicketBalance } from './user-ticket-balance';

export interface UserRepositoryInterface {
  getUserTicketBalance: (
    userId: string,
    ticketTypeId: string,
    persistencyOptions?: PersistencyOptions,
  ) => UserTicketBalance | null | Promise<UserTicketBalance | null>;
  increaseUserTicketBalance: (
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ) => number | null | Promise<number | null>;
  decreaseUserTicketBalance: (
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ) => number | null | Promise<number | null>;
}
