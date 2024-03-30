import { Injectable } from '@nestjs/common';
import {
  AuctionRepositoryInterface,
  AuctionsListFilter,
  AuctionsListResponse,
} from './domain/auction.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionEntity } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { Auction } from './domain/auction';
import { AuctionEntityMapper } from './auction.entity.mapper';
import { AuctionResultEntity } from './entities/auction-result.entity';

@Injectable()
export class AuctionRepository implements AuctionRepositoryInterface {
  constructor(
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    @InjectRepository(AuctionResultEntity)
    private readonly auctionResultRepository: Repository<AuctionResultEntity>,
    private readonly auctionEntityMapper: AuctionEntityMapper,
  ) {}

  public async save(auction: Auction): Promise<string> {
    const entity = this.auctionEntityMapper.mapAuctionDomainToDbEntity(auction);
    const storedAuction = await this.auctionRepository.save(entity);

    return storedAuction.id;
  }

  public async findById(auctionId: string): Promise<Auction | null> {
    const entity = await this.auctionRepository.findOne({
      where: {
        id: auctionId,
      },
      relations: ['item', 'item.category', 'item.ticketConfiguration'],
    });

    if (!entity) {
      return null;
    }

    return this.auctionEntityMapper.mapAuctionDbEntityToDomain(entity);
  }

  public async findAll(
    filter: AuctionsListFilter,
  ): Promise<AuctionsListResponse> {
    const offset = (filter.page - 1) * filter.limit;

    const [entities, totalCount] = await this.auctionRepository.findAndCount({
      skip: offset,
      take: filter.limit,
      relations: ['item', 'item.category', 'item.ticketConfiguration'],
    });

    return {
      auctions: entities.map((entity) =>
        this.auctionEntityMapper.mapAuctionDbEntityToDomain(entity),
      ),
      totalCount,
    };
  }

  public async updateAuctionWinner(
    auctionId: string,
    winnerId: string,
  ): Promise<void> {
    await this.auctionResultRepository.upsert(
      {
        auction: { id: auctionId },
        winner: { id: winnerId },
      },
      { conflictPaths: { auction: true } },
    );
  }

  public async updateAuctionResult(
    auctionId: string,
    finishedAt: Date,
  ): Promise<void> {
    await this.auctionResultRepository.upsert(
      {
        auction: { id: auctionId },
        finishedAt,
      },
      {
        conflictPaths: {
          auction: true,
        },
      },
    );
  }
}
