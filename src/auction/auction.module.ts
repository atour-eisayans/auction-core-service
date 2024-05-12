import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidModule } from '../bid/bid.module';
import { DatabaseModule } from '../database/database.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { AuctionController } from './auction.controller';
import { AuctionEntityMapper } from './auction.entity.mapper';
import { AuctionRepository } from './auction.repository';
import { AuctionService } from './auction.service';
import { AuctionResultEntity } from './entities/auction-result.entity';
import { AuctionEntity } from './entities/auction.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([AuctionEntity, AuctionResultEntity]),
    TaskModule,
    forwardRef(() => BidModule),
    UserModule,
  ],
  controllers: [AuctionController],
  providers: [
    AuctionService,
    AuctionEntityMapper,
    {
      provide: 'AuctionRepositoryInterface',
      useClass: AuctionRepository,
    },
  ],
  exports: ['AuctionRepositoryInterface', AuctionService, AuctionEntityMapper],
})
export class AuctionModule {}
