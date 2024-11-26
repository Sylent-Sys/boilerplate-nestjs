import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/me (GET)', async () => {
    const token = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          key: 'admin@admin.com',
          password: 'admin',
        })
        .expect(201)
    ).body.data.token;
    expect(token).toEqual(expect.any(String));
    return await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res: any) => {
        expect(res.body.data.id).toEqual(expect.any(String));
      });
  });
});
