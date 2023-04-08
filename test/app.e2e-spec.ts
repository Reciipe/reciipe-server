import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toEqual('John');
        expect(body.email).toEqual('john@example.com');
      });
  });

  it('should get a user by id', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(1);
        expect(body.name).toEqual('John');
        expect(body.email).toEqual('john@example.com');
      });
  });

  it('should update a user', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(1);
        expect(body.name).toEqual('John Doe');
        expect(body.email).toEqual('johndoe@example.com');
      });
  });

  it('should delete a user', () => {
    return request(app.getHttpServer()).delete('/users/1').expect(200);
  });
});
