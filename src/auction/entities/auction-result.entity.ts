import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuctionEntity } from './auction.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'auction_result' })
@Index(['auction'], { unique: true })
export class AuctionResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => AuctionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction_id', referencedColumnName: 'id' })
  auction!: AuctionEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  winner!: UserEntity;

  @Column({
    type: 'timestamp with time zone',
    name: 'finishedAt',
    nullable: true,
  })
  finishedAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
