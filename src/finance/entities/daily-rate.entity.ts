import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { CurrencyConversion } from './currency-conversion.entity';

@Entity('daily_rate')
@Unique(['date', 'currency_conversion'])
export class DailyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CurrencyConversion, { eager: true })
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
