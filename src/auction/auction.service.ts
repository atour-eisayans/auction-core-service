import { Inject, Injectable } from '@nestjs/common';
import { LocalizedString } from '../shared/domain/localized-string';
import { AuctionState } from '../shared/enum/auction-state.enum';
import { Auction, AuctionLimit } from './domain/auction';
import { randomUUID } from 'crypto';
import type { Item } from '../item/domain/item';
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

@Injectable()
export class AuctionService {
  constructor(
    @Inject('AuctionRepositoryInterface')
    private readonly auctionRepository: AuctionRepositoryInterface,
  ) {}

  public async create(request: CreateAuctionRequest): Promise<string> {
    const auction = this.mapCreateAuctionRequestToDomain(request);

    const storedAuctionId = await this.auctionRepository.save(auction);

    return storedAuctionId;
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

  public async findById(auctionId: string): Promise<Auction | null> {
    return await this.auctionRepository.findById(auctionId);
  }

  public async findAll(
    filter: FindAllAuctionsFilter,
  ): Promise<FindAllAuctionsResponse> {
    const { auctions, totalCount } = await this.auctionRepository.findAll(
      filter,
    );

    return {
      auctions,
      totalCount,
    };
  }
}
