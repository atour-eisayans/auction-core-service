import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionModule } from '../auction/auction.module';
import { DatabaseModule } from '../database/database.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { BidController } from './bid.controller';
import { BidEntityMapper } from './bid.entity.mapper';
import { BidRepository } from './bid.repository';
import { BidService } from './bid.service';
import { AutomatedBidEntity } from './entities/automated_bid.entity';
import { BidEntity } from './entities/bid.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([BidEntity, AutomatedBidEntity]),
    forwardRef(() => AuctionModule),
    UserModule,
    TaskModule,
  ],
  controllers: [BidController],
  providers: [
    BidService,
    BidEntityMapper,
    {
      provide: 'BidRepositoryInterface',
      useClass: BidRepository,
    },
  ],
  exports: ['BidRepositoryInterface', BidService, BidEntityMapper],
})
export class BidModule {}
