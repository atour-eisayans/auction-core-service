import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuctionModule } from './auction/auction.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuctionModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
