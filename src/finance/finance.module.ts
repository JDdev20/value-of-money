import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';

@Module({
  imports: [HttpModule],
  providers: [FinanceService],
  controllers: [FinanceController],
})
export class FinanceModule {}
