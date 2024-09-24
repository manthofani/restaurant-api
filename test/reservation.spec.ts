import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Reservation Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/reservation', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createTable();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/reservation')
        .set('Authorization', '12345')
        .send({
          username: '',
          id_table: 10,
          status: 1,
          reserved_time: '21:00',
          email: 'tegar@customer.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be success when all information stored', async () => {
      const table = await testService.getTable();
      const response = await request(app.getHttpServer())
        .post('/api/reservation')
        .set('Authorization', '12345')
        .send({
          reserved_time: '21:00',
          id_table: table.id,
          status: 1,
          username: 'tegar',
          email: 'tegar@customer.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tegar');
    });
  });
});
