import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidEntity } from './entities/bid.entity';
import { BidService } from './bid.service';
import { BidRepository } from './bid.repository';
import { BidController } from './bid.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BidEntity])],
  controllers: [BidController],
  providers: [
    BidService,
    {
      provide: 'BidRepositoryInterface',
      useClass: BidRepository,
    },
  ],
  exports: [BidService, 'BidRepositoryInterface'],
})
export class BidModule {}
