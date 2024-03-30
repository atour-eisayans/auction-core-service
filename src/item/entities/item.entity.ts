import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LocalizedString } from '../../shared/domain/localized-string';
import { TicketConfigurationEntity } from '../../ticket-configuration/entites/ticket-configuration.entity';
import { ItemCategoryEntity } from './item-category.entity';

@Entity({ name: 'item' })
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb', name: 'name' })
  name!: LocalizedString;

  @Column({ type: 'double precision', name: 'price' })
  price!: number;

  @ManyToOne(() => TicketConfigurationEntity, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'ticket_configuration_id', referencedColumnName: 'id' })
  ticketConfiguration!: TicketConfigurationEntity;

  @ManyToOne(() => ItemCategoryEntity, { nullable: false })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category!: ItemCategoryEntity;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
