import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { FinanceService } from './finance.service';
import { of } from 'rxjs';

describe('FinanceService', () => {
  let service: FinanceService;
  let httpService: HttpService;

  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn().mockReturnValue(
        of({
          data: '<div id="dolar"><strong>28.35</strong></div><div id="euro"><strong>30.25</strong></div>',
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch dollar and euro values successfully', async () => {
    const result = await service.fetchDolarValue();

    expect(httpService.get).toHaveBeenCalledWith(process.env.BCV_URL);
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

  it('should handle errors', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    await expect(service.fetchDolarValue()).rejects.toThrowError(
      'Failed to fetch dollar value',
    );
  });
});
