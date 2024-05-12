import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    DatabaseModule,
    UserModule,
    TaskModule,
    BidModule,
    AuctionModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
