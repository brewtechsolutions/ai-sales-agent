import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('healthy');
      });
  });

  it('/api/ai-agent/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/ai-agent/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('healthy');
      });
  });

  it('/api/calendar/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/calendar/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('healthy');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
