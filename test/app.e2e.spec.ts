import { Test } from '@nestjs/testing';
import {
    HttpStatus,
    INestApplication,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DrizzleService } from '@db/db.service';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as argon2 from 'argon2';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { users } from '@db/schema';
import { LoginDto } from '@auth/dto/login.dto';
import { Except } from '@utility/index';
import { JwtService } from '@nestjs/jwt';
import { AuthService, JwtPayload } from '@auth/auth.service';
import { User } from '@users/entities/user.entity';
import { ResponseUserDto } from '@users/dto/response-user.dto';

// TODO: think about modularize this e2e test, it will scale badly
describe('AppModule(e2e)', () => {
    let app: INestApplication;
    const password = 'testing';
    let hashPassword: string;
    const masterUser: Except<CreateUserDto, 'password'> = {
        email: 'testing@testing.com',
        name: 'testing',
        role: 'admin',
    };

    beforeAll(async () => {
        const postgresContainer = await new PostgreSqlContainer()
            .withDatabase('testing')
            .withPassword('testing')
            .withUsername('testing')
            .start();

        // Set env vars, we cannot override ConfigModule because we are using AppModule
        process.env.PORT = '3000';
        process.env.DB_URL = postgresContainer.getConnectionUri();
        process.env.JWT_SECRET =
            'RXcY8Ow9Gd3sQb2YvuCzr5WPu39EyZqN6wK0KzWE28O18HMYzkDVUp3gKjFEqvU';

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        const dbService = moduleFixture.get<DrizzleService>(DrizzleService);

        // Migrate
        await migrate(dbService.db, { migrationsFolder: 'migrations' });

        hashPassword = await argon2.hash(password);

        // Seed with user
        await dbService.db
            .insert(users)
            .values([{ ...masterUser, hashPassword }]);

        //Configure global pipes/etc
        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.enableVersioning({ type: VersioningType.URI });

        await app.init();
    });

    describe('HealthController', () => {
        it('/ (GET)', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect(HttpStatus.OK)
                .expect({ status: 'ok', info: {}, error: {}, details: {} });
        });

        it('/db (GET)', () => {
            return request(app.getHttpServer())
                .get('/health/db')
                .expect(HttpStatus.OK)
                .expect({
                    status: 'ok',
                    info: { db: { status: 'up' } },
                    error: {},
                    details: { db: { status: 'up' } },
                });
        });
    });

    describe('AuthController', () => {
        it('/login (POST)', () => {
            const login: LoginDto = {
                email: masterUser.email,
                password,
            };

            return request(app.getHttpServer())
                .post('/v1/auth/login/')
                .send(login)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).toHaveProperty('access_token');
                    const result: Partial<JwtPayload> = app
                        .get<JwtService>(JwtService)
                        .verify(response.body.access_token);

                    expect(result.email).toEqual(masterUser.email);
                });
        });
    });

    describe('UserController', () => {
        const userResponseKeys: Set<
            keyof Except<ResponseUserDto, 'hashPassword'>
        > = new Set(['id', 'role', 'email', 'name', 'createdAt', 'updatedAt']);
        let token: string;

        beforeAll(async () => {
            // Get token
            const authService = app.get<AuthService>(AuthService);
            token = (await authService.login(masterUser as User)).access_token;
        });
        // TODO: maybe we can make a describe per endpoint
        it('create - / (POST)', () => {
            const userDto: CreateUserDto = {
                email: 'test@test.test',
                name: 'test',
                password: 'test',
                role: 'admin',
            };

            return request(app.getHttpServer())
                .post('/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .send(userDto)
                .expect(201);
        });

        it('findOne - /{id} (GET)', () => {
            return request(app.getHttpServer())
                .get('/v1/users/1')
                .auth(token, { type: 'bearer' })
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(new Set(Object.keys(response.body))).toEqual(
                        userResponseKeys
                    );
                });
        });

        it('findOne (not found) - /{id} (GET)', () => {
            return request(app.getHttpServer())
                .get('/v1/users/4')
                .auth(token, { type: 'bearer' })
                .expect(HttpStatus.NO_CONTENT)
                .expect({});
        });

        it('findOne (invalid id) - /{id} (GET)', () => {
            // TODO: think a way to expect an error, maybe when we have customs errors
            return request(app.getHttpServer())
                .get('/v1/users/test')
                .auth(token, { type: 'bearer' })
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('findAll - / (GET)', () => {
            return request(app.getHttpServer())
                .get('/v1/users')
                .auth(token, { type: 'bearer' })
                .expect(HttpStatus.OK)
                .then((response) => {
                    response.body.forEach((user) => {
                        expect(new Set(Object.keys(user))).toEqual(
                            userResponseKeys
                        );
                    });
                });
        });

        it('update - /{id} (PATCH)', () => {
            return request(app.getHttpServer())
                .patch('/v1/users/1')
                .auth(token, { type: 'bearer' })
                .send({ name: 'test2' })
                .expect(HttpStatus.OK)
                .then((response) => {
                    // TODO: for now we are comparing the expected keys, think about adding values
                    expect(new Set(Object.keys(response.body))).toEqual(
                        userResponseKeys
                    );
                });
        });

        it('remove - /{id} (DELETE)', () => {
            return request(app.getHttpServer())
                .delete('/v1/users/1')
                .auth(token, { type: 'bearer' })
                .expect(HttpStatus.NO_CONTENT);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
