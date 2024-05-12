import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, MoreThanOrEqual, Repository } from 'typeorm';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';
import { UserTicketBalance } from './domain/user-ticket-balance';
import { UserRepositoryInterface } from './domain/user.repository.interface';
import { UserTicketBalanceEntity } from './entities/user-ticket-balance.entity';
import { UserEntity } from './entities/user.entity';
import { UserEntityMapper } from './user.entity.mapper';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserTicketBalanceEntity)
    private readonly userBalanceRepository: Repository<UserTicketBalanceEntity>,
    private readonly userEntityMapper: UserEntityMapper,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  private getUserRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;
    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(UserEntity) ?? this.userRepository
      : this.userRepository;
  }

  private getUserBalanceRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;
    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(UserTicketBalanceEntity) ?? this.userBalanceRepository
      : this.userBalanceRepository;
  }

  public async getUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<UserTicketBalance | null> {
    try {
      const userBalanceRepository =
        this.getUserBalanceRepository(persistencyOptions);

      const entity = await userBalanceRepository.findOneOrFail({
        where: {
          user: {
            id: userId,
          },
          ticketType: {
            id: ticketTypeId,
          },
        },
        relations: ['user', 'ticketType', 'ticketType.currency'],
      });

      return this.userEntityMapper.mapUserTicketBalanceDbEntityToDomain(entity);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return null;
      }

      throw error;
    }
  }

  public async increaseUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number | null> {
    try {
      const userBalanceRepository =
        this.getUserBalanceRepository(persistencyOptions);

      const entity = await userBalanceRepository.findOne({
        where: {
          user: {
            id: userId,
          },
          ticketType: {
            id: ticketTypeId,
          },
        },
        relations: ['user', 'ticketType'],
      });

      if (!entity) {
        await userBalanceRepository.save({
          balance: quantity,
          ticketType: {
            id: ticketTypeId,
          },
          user: {
            id: userId,
          },
        });

        return quantity;
      }

      const newBalance = entity.balance + quantity;

      await userBalanceRepository.update(
        {
          id: entity.id,
        },
        {
          balance: newBalance,
        },
      );

      return newBalance;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return null;
      }

      throw error;
    }
  }

  public async decreaseUserTicketBalance(
    userId: string,
    ticketTypeId: string,
    quantity: number,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number | null> {
    try {
      const userBalanceRepository =
        this.getUserBalanceRepository(persistencyOptions);

      const entity = await userBalanceRepository.findOneOrFail({
        where: {
          user: {
            id: userId,
          },
          ticketType: {
            id: ticketTypeId,
          },
          balance: MoreThanOrEqual(quantity),
        },
        relations: ['user', 'ticketType'],
      });

      const newBalance = entity.balance - quantity;

      await userBalanceRepository.save({
        id: entity.id,
        balance: newBalance,
      });

      return newBalance;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return null;
      }

      throw error;
    }
  }
}
