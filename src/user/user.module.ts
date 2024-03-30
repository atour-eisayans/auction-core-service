import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTicketBalanceEntity } from './entities/user-ticket-balance.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserEntityMapper } from './user.entity.mapper';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserTicketBalanceEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserEntityMapper,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  exports: [UserService, 'UserRepositoryInterface', UserEntityMapper],
})
export class UserModule {}
