interface SeedCurrency {
  name: string;
  symbol: string;
}

interface SeedCurrencyConversion {
  conversion_name: string;
  source_currency: number;
  destination_currency: number;
}

interface SeedData {
  currencies: SeedCurrency[];
  currencyConversions: SeedCurrencyConversion[];
}

export const initialData: SeedData = {
  currencies: [
    { name: 'bolivares', symbol: 'BS' },
    { name: 'dolares', symbol: 'EUR' },
  ],
  currencyConversions: [
    {
      conversion_name: 'BS/USD',
      source_currency: 1,
      destination_currency: 2,
    },
  ],
};
