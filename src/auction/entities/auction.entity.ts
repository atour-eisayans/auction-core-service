import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemEntity } from '../../item/entities/item.entity';
import { LocalizedString } from '../../shared/domain/localized-string';
import { AuctionState } from '../../shared/enum/auction-state.enum';
import { AuctionLimit } from '../domain/auction';

@Entity({ name: 'auction' })
export class AuctionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb', name: 'name' })
  name!: LocalizedString;

  @Column({ type: 'double precision', name: 'current_price', nullable: true })
  currentPrice?: number;

  @Column({
    type: 'timestamp with time zone',
    name: 'start_at',
    nullable: true,
  })
  startAt?: Date;

  @Column({
    type: 'timestamp with time zone',
    name: 'ended_at',
    nullable: true,
  })
  endedAt?: Date;

  @Column({ type: 'varchar', name: 'state' })
  state!: AuctionState;

  @Column({ type: 'jsonb', name: 'limits', default: '{}' })
  limits?: AuctionLimit;

  @ManyToOne(() => ItemEntity, { onDelete: 'SET NULL', nullable: false })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item!: ItemEntity;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
