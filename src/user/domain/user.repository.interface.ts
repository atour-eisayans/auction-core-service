import { UserTicketBalance } from './user-ticket-balance';

export interface UserRepositoryInterface {
  getUserTicketBalance: (
    userId: string,
    ticketTypeId: string,
  ) => UserTicketBalance | null | Promise<UserTicketBalance | null>;
  increaseUserTicketBalance: (
    userId: string,
    ticketTypeId: string,
    quantity: number,
  ) => number | null | Promise<number | null>;
}
