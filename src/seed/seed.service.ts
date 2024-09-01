import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency, CurrencyConversion, DailyRate } from 'src/finance/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(CurrencyConversion)
    private readonly currencyConversionRepository: Repository<CurrencyConversion>,
    @InjectRepository(DailyRate)
    private readonly dailyRateRepository: Repository<DailyRate>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    await this.resetSequences();
    await this.insertCurrencies();
    await this.insertCurrencyConversions();
    return 'Seed executed!';
  }

  private async deleteTables() {
    // Delete all data from the tables
    await this.dailyRateRepository.delete({});
    await this.currencyConversionRepository.delete({});
    await this.currencyRepository.delete({});
  }

  private async resetSequences() {
    await this.currencyRepository.query(
      'ALTER SEQUENCE currency_id_seq RESTART WITH 1',
    );
    await this.currencyConversionRepository.query(
      'ALTER SEQUENCE currency_conversion_id_seq RESTART WITH 1',
    );
    await this.dailyRateRepository.query(
      'ALTER SEQUENCE daily_rate_id_seq RESTART WITH 1',
    );
  }

  private async insertCurrencies() {
    const seedCurrencies = initialData.currencies;
    const currencies: Currency[] = [];

    seedCurrencies.forEach((currency) => {
      currencies.push(this.currencyRepository.create(currency));
    });

    await this.currencyRepository.save(currencies);
  }

  private async insertCurrencyConversions() {
    const seedCurrencyConversions = initialData.currencyConversions;
    const currencyConversions: CurrencyConversion[] = [];

    // Cargar todas las monedas necesarias desde la base de datos
    const currencies = await this.currencyRepository.find();

    // Crear un mapa de monedas por ID para facilitar el acceso
    const currencyMap = new Map<number, Currency>();
    currencies.forEach((currency) => {
      currencyMap.set(currency.id, currency);
    });

    seedCurrencyConversions.forEach((currencyConversion) => {
      const sourceCurrency = currencyMap.get(
        currencyConversion.source_currency,
      );
      const destinationCurrency = currencyMap.get(
        currencyConversion.destination_currency,
      );

      currencyConversions.push(
        this.currencyConversionRepository.create({
          conversion_name: currencyConversion.conversion_name,
          source_currency: sourceCurrency,
          destination_currency: destinationCurrency,
        }),
      );
    });

    await this.currencyConversionRepository.save(currencyConversions);
  }
}
