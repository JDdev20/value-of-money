import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class FinanceService {
  constructor(private readonly httpService: HttpService) {}

  async fetchDolarValue(): Promise<string> {
    const url = 'https://www.bcv.org.ve/';
    const observable = this.httpService.get(url); // Obtén el observable
    const response = await lastValueFrom(observable); // Convierte el observable en una promesa
    const html = response.data; // Accede a response.data
    const $ = cheerio.load(html);

    // Extraer el valor del dólar
    const dolarValue = $('#dolar strong').text().trim();

    return dolarValue;
  }
}
