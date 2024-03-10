import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { LocalizedString } from '../../domain/localized-string';
import { ItemCategoryEntity } from './item-category.entity';

@Entity({ name: 'item' })
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb', name: 'name' })
  name!: LocalizedString;

  @Column({ type: 'double precision', name: 'price' })
  price!: number;

  @ManyToOne(() => CurrencyEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'currency_id', referencedColumnName: 'id' })
  currency!: CurrencyEntity;

  @ManyToOne(() => ItemCategoryEntity, { nullable: false })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category!: ItemCategoryEntity;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;
}
