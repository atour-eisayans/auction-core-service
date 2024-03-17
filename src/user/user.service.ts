import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './domain/user.repository.interface';
import { UserTicketBalance } from './domain/user-ticket-balance';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async getUserTicketBalance(
    userId: string,
    ticketTypeId: string,
  ): Promise<UserTicketBalance> {
    return await this.userRepository.getUserTicketBalance(userId, ticketTypeId);
  }

  public async increaseUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    quantity: number,
  ): Promise<number> {
    return await this.userRepository.increaseUserTicketBalance(
      userId,
      ticketTypeId,
      quantity,
    );
  }
}
