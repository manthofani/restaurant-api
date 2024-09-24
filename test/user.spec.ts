import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
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

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tegar',
          password: 'developer',
          name: 'Tegar Manthofani',
          email: '',
          roles: 'user',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tegar',
          password: 'developer',
          name: 'Tegar Manthofani',
          email: 'tegar@customer.com',
          roles: 'user',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tegar');
      expect(response.body.data.name).toBe('Tegar Manthofani');
      expect(response.body.data.email).toBe('tegar@customer.com');
    });

    it('should be able to login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'tegar',
          password: 'developer',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tegar');
      expect(response.body.data.name).toBe('Tegar Manthofani');
      expect(response.body.data.email).toBe('tegar@customer.com');
    });

    it('should be able to retrieve information', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .get('/api/users/account')
        .set('Authorization', '12345');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tegar');
      expect(response.body.data.name).toBe('Tegar Manthofani');
      expect(response.body.data.email).toBe('tegar@customer.com');
    });

    it('should be rejected if token is invalid', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .delete('/api/users/account')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout user', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .delete('/api/users/account')
        .set('Authorization', '12345');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });

  describe('Update By Admin - PATCH /api/users/account/:username', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('should be able to update', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .patch('/api/users/account/tegar')
        .set('Authorization', '12345')
        .send({
          username: 'tegar',
          password: 'developer',
          name: 'Tegar Manthofani',
          email: 'vice.owner@restaurant.com',
          roles: 'admin',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tegar');
      expect(response.body.data.name).toBe('Tegar Manthofani');
      expect(response.body.data.email).toBe('vice.owner@restaurant.com');
    });
  });
});
