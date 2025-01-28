import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as https from 'https';
import * as cheerio from 'cheerio';
import { CurrencyConversion, DailyRate } from './entities';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);
  private readonly NODE_ENV = process.env.NODE_ENV || 'development';

  constructor(
    @InjectRepository(DailyRate)
    private readonly dailyRateRepository: Repository<DailyRate>,
    @InjectRepository(CurrencyConversion)
    private readonly currencyConversionRepository: Repository<CurrencyConversion>,

    private readonly httpService: HttpService,
  ) {}

  async saveDolarValue(
    value: string,
    currencyConversionId: number,
  ): Promise<string> {
    const currencyConversion = await this.currencyConversionRepository.findOne({
      where: { id: currencyConversionId },
    });
    if (!currencyConversion) {
      this.logger.error('CurrencyConversion not found.');
      return value;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    try {
      // Check if a DailyRate record exists for today and the given CurrencyConversion
      let dailyRate = await this.dailyRateRepository.findOne({
        where: {
          date: todayDate,
          currency_conversion: { id: currencyConversion.id },
        },
      });

      if (dailyRate) {
        // Update existing record
        dailyRate.amount = value;
      } else {
        // Create new record
        dailyRate = new DailyRate();
        dailyRate.amount = value;
        dailyRate.date = todayDate;
        dailyRate.currency_conversion = currencyConversion;
      }

      await this.dailyRateRepository.save(dailyRate);
      this.logger.log('Dollar value saved successfully.');
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation for PostgreSQL
        this.logger.error(
          'A record with the same date and CurrencyConversion already exists.',
        );
      } else {
        this.logger.error('Failed to save dollar value.', error.stack);
      }
    }

    return value;
  }

  async fetchDolarValue(): Promise<string> {
    const url = 'https://www.bcv.org.ve/';

    const agent = new https.Agent({
      rejectUnauthorized: this.NODE_ENV !== 'development', // Disable SSL verification in development
    });

 

    try {

      const observable = this.httpService.get(url, {
        httpsAgent: agent,
      });

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
