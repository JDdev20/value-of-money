import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FinanceService } from './finance/finance.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly financeService: FinanceService) {}

  @Cron('0 0 * * *') // This will run every day at midnight
  async handleCron() {
    this.logger.log('Running daily cron job to save dollar value.');
    try {
      const dolarValue = await this.financeService.fetchDolarValue();
      await this.financeService.saveDolarValue(dolarValue);
      this.logger.log(`Dollar value ${dolarValue} saved successfully.`);
    } catch (error) {
      this.logger.error('Error executing cron job:', error.stack);
    }
  }
}
