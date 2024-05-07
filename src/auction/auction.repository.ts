import { Inject, Injectable } from '@nestjs/common';
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
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';

@Injectable()
export class AuctionRepository implements AuctionRepositoryInterface {
  constructor(
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    @InjectRepository(AuctionResultEntity)
    private readonly auctionResultRepository: Repository<AuctionResultEntity>,
    private readonly auctionEntityMapper: AuctionEntityMapper,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  private getAuctionRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;
    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(AuctionEntity) ?? this.auctionRepository
      : this.auctionRepository;
  }

  private getAuctionResultRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;
    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(AuctionResultEntity) ?? this.auctionResultRepository
      : this.auctionResultRepository;
  }

  public async save(
    auction: Auction,
    persistencyOptions?: PersistencyOptions,
  ): Promise<string> {
    const auctionRepository = this.getAuctionRepository(persistencyOptions);

    const entity = this.auctionEntityMapper.mapAuctionDomainToDbEntity(auction);
    const storedAuction = await auctionRepository.save(entity);

    return storedAuction.id;
  }

  public async findById(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<Auction | null> {
    const auctionRepository = this.getAuctionRepository(persistencyOptions);

    const entity = await auctionRepository.findOne({
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
    persistencyOptions?: PersistencyOptions,
  ): Promise<AuctionsListResponse> {
    const auctionRepository = this.getAuctionRepository(persistencyOptions);

    const offset = (filter.page - 1) * filter.limit;

    const [entities, totalCount] = await auctionRepository.findAndCount({
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
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const auctionResultRepository =
      this.getAuctionResultRepository(persistencyOptions);

    await auctionResultRepository.upsert(
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
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const auctionResultRepository =
      this.getAuctionResultRepository(persistencyOptions);

    await auctionResultRepository.upsert(
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
