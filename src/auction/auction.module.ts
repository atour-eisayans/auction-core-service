import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AuctionEntityMapper } from './auction.entity.mapper';
import { AuctionRepository } from './auction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { AuctionResultEntity } from './entities/auction-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionEntity, AuctionResultEntity])],
  controllers: [AuctionController],
  providers: [
    AuctionService,
    AuctionEntityMapper,
    {
      provide: 'AuctionRepositoryInterface',
      useClass: AuctionRepository,
    },
  ],
  exports: [AuctionService, 'AuctionRepositoryInterface'],
})
export class AuctionModule {}
