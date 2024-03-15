import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TicketConfigurationEntity } from '../../ticket-configuration/entites/ticket-configuration.entity';

@Entity({ name: 'user_ticket_balance' })
export class UserTicketBalanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserEntity;

  @Column({ type: 'double precision', name: 'balance' })
  balance!: number;

  @ManyToOne(() => TicketConfigurationEntity, { nullable: false })
  @JoinColumn({ name: 'ticket_type', referencedColumnName: 'id' })
  ticketType!: TicketConfigurationEntity;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
