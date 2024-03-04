import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryEntity } from '../item/item-category.entity';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { AuctionResultEntity } from '../auction/auction-result.entity';
import { BidEntity } from '../bid/bid.entity';
import { TicketConfigurationEntity } from '../ticket-configuration/ticket-configuration.entity';
import { UserTicketBalanceEntity } from '../user/user-ticket-balance.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')) || 5_432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        useUTC: true,
        entities: [`${__dirname}/../**/*.entity.{ts,js}`],
        migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ItemCategoryEntity,
      ItemEntity,
      AuctionEntity,
      AuctionResultEntity,
      BidEntity,
      TicketConfigurationEntity,
      UserTicketBalanceEntity,
    ]),
  ],
})
export class DatabaseModule {}
