import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  // Find the dollar value for today
  @Get('get_dolar')
  async findDolarValueToday(): Promise<string | null> {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    return this.financeService.findDolarValue(today);
  }

  // Find the dollar value for a specific date
  @Get('get_dolar/:date')
  async findDolarValue(@Param('date') date: string): Promise<string | null> {
    if (!this.isValidDate(date)) {
      throw new BadRequestException(
        'Invalid date format. Please use YYYY-MM-DD.',
      );
    }
    return this.financeService.findDolarValue(date);
  }

  // Method to validate time format
  private isValidDate(date: string): boolean {
    // Regex validation for date format YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(regex)) {
      return false;
    }
    // Check if the date is valid
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
