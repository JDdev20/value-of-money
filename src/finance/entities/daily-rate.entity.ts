import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurrencyConversion } from './currency-conversion.entity';

@Entity('daily_rate')
export class DailyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CurrencyConversion)
  currency_conversion: CurrencyConversion;

  @Column({ type: 'varchar', length: 25 })
  amount: string;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
