import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuctionModule } from './auction/auction.module';
import { UserModule } from './user/user.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuctionModule,
    UserModule,
    BidModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
