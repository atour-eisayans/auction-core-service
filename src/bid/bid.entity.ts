import { UserEntity } from '../user/user.entity';
import { AuctionEntity } from '../auction/auction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bid' })
export class BidEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AuctionEntity, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'auction_id', referencedColumnName: 'id' })
  auction!: AuctionEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserEntity;

  @Column({ type: 'int', name: 'total_bids', default: 1 })
  totalBids!: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  lastUpdatedAt!: Date;
}
