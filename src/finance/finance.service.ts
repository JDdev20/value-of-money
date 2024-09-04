import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(private readonly httpService: HttpService) {}

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
}
