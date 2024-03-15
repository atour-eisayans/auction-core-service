import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
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
  ) {}

  public async getUserTicketBalance(
    userId: string,
    ticketTypeId: string,
  ): Promise<UserTicketBalance | null> {
    try {
      const entity = await this.userBalanceRepository.findOneOrFail({
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
}
