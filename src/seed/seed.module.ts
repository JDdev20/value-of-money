import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConversion, Currency, DailyRate } from 'src/finance/entities';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([CurrencyConversion, Currency, DailyRate]),
  ],
})
export class SeedModule {}
