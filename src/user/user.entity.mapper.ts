import { Injectable } from '@nestjs/common';
import { User } from './domain/user';
import { UserEntity } from './entities/user.entity';
import { UserTicketBalance } from './domain/user-ticket-balance';
import { UserTicketBalanceEntity } from './entities/user-ticket-balance.entity';

@Injectable()
export class UserEntityMapper {
  public mapUserDomainToDBEntity(domain: User): UserEntity {
    return <UserEntity>{
      id: domain.id,
      firstName: domain.firstName,
      lastName: domain.lastName,
      avatar: domain.avatar,
      username: domain.username,
      email: domain.email,
      phone: domain.phone,
    };
  }

  public mapUserDbEntityToDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      username: entity.username,
      avatar: entity.avatar,
      email: entity.email,
      phone: entity.phone,
    });
  }

  public mapUserTicketBalanceDbEntityToDomain(
    entity: UserTicketBalanceEntity,
  ): UserTicketBalance {
    return new UserTicketBalance({
      id: entity.id,
      balance: entity.balance,
      ticketType: {
        id: entity.ticketType.id,
        currency: entity.ticketType.currency,
        unitPrice: entity.ticketType.unitPrice,
        raisingAmount: entity.ticketType.raisingAmount,
      },
      user: this.mapUserDbEntityToDomain(entity.user),
    });
  }

  public mapUserTicketBalanceDomainToDbEntity(
    domain: UserTicketBalance,
  ): UserTicketBalanceEntity {
    return <UserTicketBalanceEntity>{
      id: domain.id,
      balance: domain.balance,
      user: this.mapUserDomainToDBEntity(domain.user),
      ticketType: {
        id: domain.ticketType.id,
        currency: domain.ticketType.currency,
        raisingAmount: domain.ticketType.raisingAmount,
        unitPrice: domain.ticketType.unitPrice,
      },
    };
  }
}
