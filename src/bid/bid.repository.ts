import { Injectable } from '@nestjs/common';
import { BidRepositoryInterface } from './domain/bid.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BidEntity } from './entities/bid.entity';
import { Repository } from 'typeorm';

interface UpsertBidResponse {
  total_bids: number;
}

@Injectable()
export class BidRepository implements BidRepositoryInterface {
  constructor(
    @InjectRepository(BidEntity)
    private readonly bidRepository: Repository<BidEntity>,
  ) {}

  public async upsert(auctionId: string, userId: string): Promise<number> {
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
    const result: UpsertBidResponse[] = await this.bidRepository.query(query, [
      auctionId,
      userId,
    ]);

    return result[0]?.total_bids ?? 0;
  }
}
