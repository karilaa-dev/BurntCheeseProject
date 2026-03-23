// Jesse was responsible for this
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import request from 'supertest';

describe('PagesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET / should serve index.html', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('GET /about should serve about.html', () => {
    return request(app.getHttpServer())
      .get('/about')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('GET /results should serve results.html', () => {
    return request(app.getHttpServer())
      .get('/results')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('GET /unknown should 404', () => {
    return request(app.getHttpServer()).get('/unknown').expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
