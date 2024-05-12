import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Raw, Repository } from 'typeorm';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';
import { BidEntityMapper } from './bid.entity.mapper';
import { AutomatedBid } from './domain/automated-bid';
import { BidRepositoryInterface } from './domain/bid.repository.interface';
import { AutomatedBidEntity } from './entities/automated_bid.entity';
import { BidEntity } from './entities/bid.entity';

interface UpsertBidResponse {
  total_bids: number;
}

@Injectable()
export class BidRepository implements BidRepositoryInterface {
  constructor(
    @InjectRepository(BidEntity)
    private readonly bidRepository: Repository<BidEntity>,
    @InjectRepository(AutomatedBidEntity)
    private readonly automatedBidRepository: Repository<AutomatedBidEntity>,
    private readonly bidEntityMapper: BidEntityMapper,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  private getBidRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;

    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(BidEntity) ?? this.bidRepository
      : this.bidRepository;
  }

  private getAutomatedBidRepository(persistency?: PersistencyOptions) {
    const transactionName = persistency?.transactionName;
    return transactionName
      ? this.transactionManager
          .getManager(transactionName)
          ?.getRepository(AutomatedBidEntity) ?? this.automatedBidRepository
      : this.automatedBidRepository;
  }

  public async placeBid(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    const bidRepository = this.getBidRepository(persistencyOptions);

    const query = `
      INSERT INTO "bid"
      ("auction_id", "user_id")
      VALUES
      ($1, $2)
      ON CONFLICT ("user_id", "auction_id")
      DO UPDATE
      SET "total_bids" = "bid"."total_bids" + 1
      RETURNING "total_bids"
    `;
    const result: UpsertBidResponse[] = await bidRepository.query(query, [
      auctionId,
      userId,
    ]);

    return result[0]?.total_bids ?? 0;
  }

  public async shuffleAutomatedBids(auctionId: string): Promise<void> {
    return;
  }

  public async findNextAutomatedBid(
    auctionId: string,
    currentBidderId?: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<AutomatedBid | null> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    const entity = await automatedBidRepository.findOne({
      where: {
        auction: {
          id: auctionId,
        },
        user: {
          id: currentBidderId ? Not(currentBidderId) : Raw(() => '1 = 1'),
        },
        lastBidder: false,
        ticketCount: MoreThan(0),
      },
      relations: [
        'auction',
        'user',
        'auction.item',
        'auction.item.category',
        'auction.item.ticketConfiguration',
      ],
    });

    if (!entity) {
      return null;
    }

    return this.bidEntityMapper.mapAutomatedBidEntityToDomain(entity);
  }

  public async decreaseUserFreezedTicketCount(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    await automatedBidRepository.update(
      {
        auction: { id: auctionId },
        user: { id: userId },
        ticketCount: MoreThan(0),
      },
      {
        ticketCount: () => 'ticketCount - 1',
        lastBidder: true,
      },
    );
  }

  public async setLastBidderFlagFalse(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    await automatedBidRepository.update(
      {
        auction: { id: auctionId },
      },
      {
        lastBidder: false,
      },
    );
  }

  public async findAllAutomatedBids(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<AutomatedBid[]> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    const entities = await automatedBidRepository.find({
      where: {
        auction: { id: auctionId },
        ticketCount: MoreThan(0),
      },
      relations: {
        user: true,
        auction: {
          item: {
            category: true,
            ticketConfiguration: true,
          },
        },
      },
    });

    return entities.map((entity) =>
      this.bidEntityMapper.mapAutomatedBidEntityToDomain(entity),
    );
  }

  public async removeAutomatedBids(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    await automatedBidRepository.delete({
      auction: { id: auctionId },
    });
  }

  public async setUserLastBidderFlagTrue(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const automatedBidRepository =
      this.getAutomatedBidRepository(persistencyOptions);

    await automatedBidRepository.update(
      {
        auction: { id: auctionId },
        user: { id: userId },
      },
      { lastBidder: true },
    );
  }
}
