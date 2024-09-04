import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, FinanceModule],
})
export class AppModule {}
