import { Injectable } from '@nestjs/common';
import { AuctionRepositoryInterface } from './domain/auction.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { Auction } from './domain/auction';
import { AuctionEntityMapper } from './auction.entity.mapper';

@Injectable()
export class AuctionRepository implements AuctionRepositoryInterface {
  constructor(
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    private readonly auctionEntityMapper: AuctionEntityMapper,
  ) {}

  public async save(auction: Auction): Promise<string> {
    const entity = this.auctionEntityMapper.mapAuctionDomainToDbEntity(auction);
    const storedAuction = await this.auctionRepository.save(entity);

    return storedAuction.id;
  }
}
