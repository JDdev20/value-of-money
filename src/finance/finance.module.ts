import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { CronService } from '../cron.service';
import { CurrencyConversion, Currency, DailyRate } from './entities';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CurrencyConversion, Currency, DailyRate]),
  ],
  providers: [FinanceService, CronService],
  controllers: [FinanceController],
})
export class FinanceModule {}
