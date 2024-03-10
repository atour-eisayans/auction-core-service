import { CurrencyEntity } from '../../currency/entities/currency.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ticket_configuration' })
export class TicketConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'double precision', name: 'unit_price' })
  unitPrice!: number;

  @ManyToOne(() => CurrencyEntity, { nullable: false })
  @JoinColumn({ name: 'currency_id', referencedColumnName: 'id' })
  currency!: CurrencyEntity;

  @Column({ type: 'double precision', name: 'raising_amount' })
  raisingAmount!: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
