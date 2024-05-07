import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { AuctionStartedEvent } from './events/auction-started.event';
import { BidPlacedEvent } from '../bid/events/bid-placed.event';
import { UserService } from '../user/user.service';
import { BidService } from '../bid/bid.service';
import type { Item } from '../item/domain/item';
import { LocalizedString } from '../shared/domain/localized-string';
import { AuctionState } from '../shared/enum/auction-state.enum';
import { TaskType } from '../shared/enum/task-type.enum';
import { TaskService } from '../task/task.service';
import { Auction, AuctionLimit } from './domain/auction';
import { AuctionRepositoryInterface } from './domain/auction.repository.interface';
import { PersistencyOptions } from '../shared/domain/persistency-options.interface';

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
    private readonly bidService: BidService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
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
    persistencyOptions?: PersistencyOptions,
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

  public async startAuction(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    this.eventEmitter.emit(
      'auction.started',
      new AuctionStartedEvent({ auctionId }),
    );
  }

  public async processAuctionTick(
    auctionId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const timeout = 20;

    await this.taskService.scheduleTask(
      TaskType.CheckAutomatedBid,
      auctionId,
      timeout,
      async () => {
        const bidder = await this.bidService.iterateOverAutomatedBids(
          auctionId,
        );

        if (bidder) {
          this.eventEmitter.emit(
            'bid.placed',
            new BidPlacedEvent({
              auctionId,
              userId: bidder.id,
            }),
          );
        }
      },
    );
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

  public async processPlacedBid(
    auctionId: string,
    userId: string,
    persistencyOptions?: PersistencyOptions,
  ): Promise<void> {
    const auction = await this.auctionRepository.findById(
      auctionId,
      persistencyOptions,
    );

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const {
      item: { ticketConfiguration },
    } = auction;

    const userBalance = await this.userService.decreaseUserTicketBalance(
      userId,
      ticketConfiguration.id,
      1,
      persistencyOptions,
    );

    if (userBalance === null) {
      throw new UnprocessableEntityException('User balance is not enough');
    }

    this.eventEmitter.emit(
      'bid.placed',
      new BidPlacedEvent({ auctionId, userId }),
    );
  }
}
