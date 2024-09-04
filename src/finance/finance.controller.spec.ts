import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

describe('FinanceController', () => {
  let controller: FinanceController;
  let service: FinanceService;

  beforeEach(async () => {
    const mockFinanceService = {
      fetchDolarValue: jest.fn().mockResolvedValue({
        status: 'success',
        data: {
          dolar: {
            date: new Date().toISOString(),
            value: '28.35',
            source: process.env.BCV_URL,
          },
          euro: {
            date: new Date().toISOString(),
            value: '30.25',
            source: process.env.BCV_URL,
          },
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [{ provide: FinanceService, useValue: mockFinanceService }],
    }).compile();

    controller = module.get<FinanceController>(FinanceController);
    service = module.get<FinanceService>(FinanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return dollar and euro values', async () => {
    const result = await controller.findDolarValueInPage();

    expect(service.fetchDolarValue).toHaveBeenCalled();
    expect(result).toEqual({
      status: 'success',
      data: {
        dolar: {
          date: expect.any(String),
          value: '28.35',
          source: process.env.BCV_URL,
        },
        euro: {
          date: expect.any(String),
          value: '30.25',
          source: process.env.BCV_URL,
        },
      },
    });
  });
});
