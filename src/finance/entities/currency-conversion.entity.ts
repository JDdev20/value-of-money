import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from './currency.entity';

@Entity('currency_conversion')
export class CurrencyConversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25 })
  conversion_name: string;

  @ManyToOne(() => Currency)
  destination_currency: Currency;

  @ManyToOne(() => Currency)
  source_currency: Currency;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
