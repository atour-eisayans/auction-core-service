import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { BidService } from '../bid/bid.service';
import type { Item } from '../item/domain/item';
import { LocalizedString } from '../shared/domain/localized-string';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';
import { TransactionManagerInterface } from '../shared/domain/transaction-manager.interface';
import { AuctionState } from '../shared/enum/auction-state.enum';
import { TaskType } from '../shared/enum/task-type.enum';
import taskNameGenerator from '../shared/helper/task-name-generator';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import { Auction, AuctionLimit } from './domain/auction';
import { AuctionRepositoryInterface } from './domain/auction.repository.interface';

export interface CreateAuctionRequest {
  name: LocalizedString;
  startAt?: Date;
  state: AuctionState;
  limits?: AuctionLimit;
  itemId: string;
}

export interface FindAllAuctionsFilter {
  page: number;
  limit: number;
}

interface FindAllAuctionsResponse {
  auctions: Auction[];
  totalCount: number;
}

export type UpdateAuctionRequest = Partial<CreateAuctionRequest> & {
  endedAt?: Date;
  currentPrice?: number;
};

@Injectable()
export class AuctionService {
  constructor(
    @Inject('AuctionRepositoryInterface')
    private readonly auctionRepository: AuctionRepositoryInterface,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => BidService))
    private readonly bidService: BidService,
    private readonly configService: ConfigService,
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  public async createAuction(
    request: CreateAuctionRequest,
    persistencyOptions?: PersistencyOptions,
  ): Promise<string> {
    const auction = this.mapCreateAuctionRequestToDomain(request);

    const storedAuctionId = await this.auctionRepository.save(
      auction,
      persistencyOptions,
    );

    return storedAuctionId;
  }

  public async updateAuction(
    id: string,
    body: UpdateAuctionRequest,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const auction = await this.findById(id, persistencyOptions);

    if (!auction) {
      return null;
    }

    await this.auctionRepository.save(
      { ...auction, ...body },
      persistencyOptions,
    );
  }

  private mapCreateAuctionRequestToDomain(
    payload: CreateAuctionRequest,
  ): Auction {
    const item = <Item>{ id: payload.itemId };
    return new Auction({
      id: randomUUID(),
      item,
      name: payload.name,
      startAt: payload.startAt,
      state: payload.state,
      limits: payload.limits,
    });
  }

  public async findById(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<Auction | null> {
    return await this.auctionRepository.findById(auctionId, persistencyOptions);
  }

  public async findAll(
    filter: FindAllAuctionsFilter,
    persistencyOptions?: PersistencyOptions,
  ): Promise<FindAllAuctionsResponse> {
    const { auctions, totalCount } = await this.auctionRepository.findAll(
      filter,
      persistencyOptions,
    );

    return {
      auctions,
      totalCount,
    };
  }

  public async updateAuctionPriceBasedOnBid(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    const auction = await this.auctionRepository.findById(
      auctionId,
      persistencyOptions,
    );

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const {
      limits,
      item: {
        price: itemOriginalPrice,
        ticketConfiguration: { raisingAmount },
      },
      currentPrice: auctionCurrentPrice,
    } = auction;

    const maxPricePercent =
      ((limits.item_max_price_percent &&
        Number(limits.item_max_price_percent)) ??
        this.configService.get<number>('ITEM_MAX_PRICE_PERCENT') ??
        50) / 100;

    const maxPriceThreshold = itemOriginalPrice * maxPricePercent;

    const auctionNewPrice = Math.min(
      auctionCurrentPrice + raisingAmount,
      maxPriceThreshold,
    );

    await this.auctionRepository.save(
      {
        ...auction,
        currentPrice: auctionNewPrice,
      },
      persistencyOptions,
    );

    return auctionNewPrice;
  }

  public async updateAuctionWinner(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    await this.auctionRepository.updateAuctionWinner(
      auctionId,
      userId,
      persistencyOptions,
    );
  }

  private async scheduleExpireAuctionTask(auctionId: string): Promise<string> {
    const expireTimeout =
      this.configService.get<number>('AUCTION_EXPIRE_TIMEOUT_HOURS') ?? 1;

    return await this.taskService.scheduleTask(
      TaskType.AuctionExpire,
      auctionId,
      expireTimeout * 60 * 60,
      async () => {
        await this.expireAuction(auctionId);
      },
    );
  }

  private async calculateInitialPrice(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<number> {
    const auction = await this.findById(auctionId, persistencyOptions);

    const {
      item: { price: itemOriginalPrice },
      limits,
    } = auction;

    const startingPricePercent =
      ((limits?.item_max_price_percent &&
        Number(limits?.item_max_price_percent)) ??
        this.configService.get<number>('ITEM_STARTING_PRICE_PERCENT') ??
        20) / 100;

    return itemOriginalPrice * startingPricePercent;
  }

  public async startAuction(auctionId: string): Promise<void> {
    const transactionName = `auction_started_${auctionId}_${Date.now()}`;

    await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        await this.scheduleExpireAuctionTask(auctionId);

        const initialPrice = await this.calculateInitialPrice(auctionId, {
          transactionName,
        });

        await this.updateAuction(
          auctionId,
          {
            startAt: new Date(),
            state: AuctionState.Active,
            currentPrice: initialPrice,
          },
          { transactionName },
        );

        await this.bidService.processAuctionTick(auctionId);
      },
    );
  }

  private async deleteTask(
    auctionId: string,
    taskType: TaskType,
  ): Promise<void> {
    const taskName = taskNameGenerator(taskType, auctionId);
    await this.taskService.deleteTask(taskName);
  }

  public async expireAuction(auctionId: string) {
    const transactionName = `auction_expired_${auctionId}_${Date.now()}`;

    await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        await this.deleteTask(auctionId, TaskType.AuctionExpire);
        await this.deleteTask(auctionId, TaskType.CheckAutomatedBid);

        await this.updateAuction(
          auctionId,
          {
            state: AuctionState.Expired,
          },
          { transactionName },
        );

        await this.updateAuctionResult(auctionId, new Date(), {
          transactionName,
        });
      },
    );
  }

  public async finishAuction(auctionId: string) {
    const transactionName = `auction_finished_${auctionId}_${Date.now()}`;

    await this.transactionManager.runInTransaction(
      transactionName,
      'REPEATABLE READ',
      async () => {
        await this.deleteTask(auctionId, TaskType.AuctionFinish);
        await this.deleteTask(auctionId, TaskType.CheckAutomatedBid);

        await this.updateAuction(
          auctionId,
          {
            state: AuctionState.Finished,
            endedAt: new Date(),
          },
          { transactionName },
        );

        await this.updateAuctionResult(auctionId, new Date(), {
          transactionName,
        });

        const automatedBids = await this.bidService.readAllAutomatedBids(
          auctionId,
          { transactionName },
        );

        const refundPromises = automatedBids.map((bid) =>
          this.userService.increaseUserTicketBalance(
            bid.user.id,
            bid.auction.item.ticketConfiguration.id,
            bid.ticketCount,
            { transactionName },
          ),
        );

        await Promise.all(refundPromises);

        await this.bidService.removeAllDeprecatedBids(auctionId, {
          transactionName,
        });
      },
    );
  }

  private async scheduleFinishAuctionTask(auctionId: string): Promise<string> {
    const finishTimeout =
      this.configService.get<number>('AUCTION_FINISH_TIMEOUT_SECONDS') ?? 25;

    return await this.taskService.scheduleTask(
      TaskType.AuctionFinish,
      auctionId,
      finishTimeout,
      async () => {
        await this.finishAuction(auctionId);
      },
    );
  }

  public async handleBidPlaced(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ) {
    await this.updateAuctionPriceBasedOnBid(auctionId, persistencyOptions);
    await this.updateAuctionWinner(auctionId, userId, persistencyOptions);
    await this.scheduleFinishAuctionTask(auctionId);
    await this.deleteTask(auctionId, TaskType.AuctionExpire);
  }

  public async updateAuctionResult(
    auctionId: string,
    finishedAt: Date,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    await this.auctionRepository.updateAuctionResult(
      auctionId,
      finishedAt,
      persistencyOptions,
    );
  }
}
