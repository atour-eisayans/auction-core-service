import { AuctionEntity } from '../../auction/entities/auction.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'automated_bid' })
export class AutomatedBidEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => AuctionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction_id', referencedColumnName: 'id' })
  auction!: AuctionEntity;

  @Column({ name: 'ticket_count', type: 'integer', default: 0 })
  ticketCount!: number;

  @Column({ name: 'last_bidder', type: 'boolean', default: false })
  lastBidder!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  lastUpdatedAt!: Date;
}
