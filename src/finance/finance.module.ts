import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyConversion } from './entities/currency-conversion.entity';
import { Currency } from './entities/currency.entity';
import { DailyRate } from './entities/daily-rate.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CurrencyConversion, Currency, DailyRate]),
    HttpModule,
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
})
export class FinanceModule {}
