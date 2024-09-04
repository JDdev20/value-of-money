import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  private readonly BCV_URL = process.env.BCV_URL;

  constructor(private readonly httpService: HttpService) {}

  async fetchDolarValue(): Promise<any> {
    try {
      const observable = this.httpService.get(this.BCV_URL);
      const response = await lastValueFrom(observable);
      const html = response.data;
      const $ = cheerio.load(html);

      const dolarValue = $('#dolar strong').text().trim();
      const euroValue = $('#euro strong').text().trim();

      return {
        status: 'success',
        data: {
          dolar: {
            date: new Date().toISOString(),
            value: dolarValue,
            source: this.BCV_URL,
          },
          euro: {
            date: new Date().toISOString(),
            value: euroValue,
            source: this.BCV_URL,
          },
        },
      };
    } catch (error) {
      this.logger.error('Failed to fetch dollar value.', error.stack);

      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to fetch dollar value',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
