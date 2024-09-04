import { Controller, Get } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('get_dolar_in_page')
  async findDolarValueInPage(): Promise<string | null> {
    return this.financeService.fetchDolarValue();
  }
}
