import { Inject, Injectable } from '@nestjs/common';
import { BidRepositoryInterface } from './domain/bid.repository.interface';

@Injectable()
export class BidService {
  constructor(
    @Inject('BidRepositoryInterface')
    private readonly bidRepository: BidRepositoryInterface,
  ) {}

  public async place(auctionId: string, userId: string): Promise<number> {
    return await this.bidRepository.upsert(auctionId, userId);
  }
}
