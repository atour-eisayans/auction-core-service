import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    TaskModule,
    AuctionModule,
    UserModule,
    BidModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
