import { UserEntity } from '../../user/entities/user.entity';
import { AuctionEntity } from '../../auction/entities/auction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bid' })
@Index(['auction', 'user'], { unique: true })
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
