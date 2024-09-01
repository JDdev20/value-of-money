import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { DailyRate } from './entities/daily-rate.entity';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    @InjectRepository(DailyRate)
    private readonly dailyRateRepository: Repository<DailyRate>,

    private readonly httpService: HttpService,
  ) {}

  async saveDolarValue(value: string): Promise<string> {
    if (!this.dailyRateRepository) {
      this.logger.error('Repository not available.');
      return value;
    }

    const dailyRate = new DailyRate();
    dailyRate.amount = value;
    dailyRate.date = new Date().toISOString().split('T')[0];

    try {
      await this.dailyRateRepository.save(dailyRate);
      this.logger.log('Dollar value saved successfully.');
    } catch (error) {
      this.logger.error('Failed to save dollar value.', error.stack);
    }

    return value;
  }

  async fetchDolarValue(): Promise<string> {
    const url = 'https://www.bcv.org.ve/';
    try {
      const observable = this.httpService.get(url);
      const response = await lastValueFrom(observable);
      const html = response.data;
      const $ = cheerio.load(html);

      const dolarValue = $('#dolar strong').text().trim();
      return dolarValue;
    } catch (error) {
      this.logger.error('Failed to fetch dollar value.', error.stack);
      return 'Error fetching value';
    }
  }

  async findDolarValue(date: string): Promise<string | null> {
    if (!this.dailyRateRepository) {
      this.logger.error('Repository not available.');
      return null;
    }

    try {
      const dailyRate = await this.dailyRateRepository.findOne({
        where: { date },
      });
      return dailyRate ? dailyRate.amount : null;
    } catch (error) {
      this.logger.error('Failed to find dollar value.', error.stack);
      return null;
    }
  }
}
