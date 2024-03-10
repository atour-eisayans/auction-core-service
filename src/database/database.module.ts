import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategoryEntity } from '../item/entities/item-category.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ItemEntity } from '../item/entities/item.entity';
import { AuctionEntity } from '../auction/entities/auction.entity';
import { AuctionResultEntity } from '../auction/entities/auction-result.entity';
import { BidEntity } from '../bid/entities/bid.entity';
import { TicketConfigurationEntity } from '../ticket-configuration/entites/ticket-configuration.entity';
import { UserTicketBalanceEntity } from '../user/entities/user-ticket-balance.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';

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
        entities: [`${__dirname}/../**/entites/*.entity.{ts,js}`],
        migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      BidEntity,
      UserEntity,
      ItemEntity,
      AuctionEntity,
      CurrencyEntity,
      ItemCategoryEntity,
      AuctionResultEntity,
      UserTicketBalanceEntity,
      TicketConfigurationEntity,
    ]),
  ],
})
export class DatabaseModule {}
