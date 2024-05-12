import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './domain/user.repository.interface';
import { UserTicketBalance } from './domain/user-ticket-balance';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async getUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<UserTicketBalance> {
    return await this.userRepository.getUserTicketBalance(
      userId,
      ticketTypeId,
      persistencyOptions,
    );
  }

  public async increaseUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    return await this.userRepository.increaseUserTicketBalance(
      userId,
      ticketTypeId,
      quantity,
      persistencyOptions,
    );
  }

  public async decreaseUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    return await this.userRepository.decreaseUserTicketBalance(
      userId,
      ticketTypeId,
      quantity,
      persistencyOptions,
    );
  }
}
