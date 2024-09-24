import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Table Controller', () => {
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

  describe('POST /api/tables', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tables')
        .send({
          name: 'Table 1',
          status: 1,
          open_hr: '',
          closed_hr: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be success when all information stored', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tables')
        .send({
          name: 'Table 1',
          status: 1,
          open_hr: '10:00',
          closed_hr: '23:00',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Table 1');
    });

    it('should be success when all information stored', async () => {
      await testService.createTable();
      const response = await request(app.getHttpServer())
        .get('/api/tables')
        .set('Authorization', '12345')
        .query({ status: 1 });

      logger.info(response.body);

      expect(response.status).toBe(200);
    });

    it('should be able update table', async () => {
      await testService.createTable();
      const table = await testService.getTable();
      const response = await request(app.getHttpServer())
        .patch(`/api/tables/${table.id}`)
        .set('Authorization', '12345')
        .send({
          open_hr: '13:00',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.open_hr).toBe('13:00');
    });

    it('should be able delete table', async () => {
      await testService.createTable();
      const table = await testService.getTable();
      const response = await request(app.getHttpServer())
        .delete(`/api/tables/${table.id}`)
        .set('Authorization', '12345');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
