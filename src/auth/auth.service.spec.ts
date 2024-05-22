import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@users/users.service';
import { DrizzleService } from '@db/db.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@users/entities/user.entity';
import * as argon2 from 'argon2';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentVariables } from '@config/env.validation';
import { AuthModule } from './auth.module';

jest.mock('@users/users.service');

describe('AuthService', () => {
    const secret: string =
        'TesTingTesTingTesTingTesTingTesTingTesTingTesTingTesTingTesTing';
    let authService: AuthService;
    let jwtService: JwtService;
    const password: string = 'testing';
    const mockUsersService: UsersService = jest.mocked<UsersService>(
        new UsersService({} as DrizzleService)
    );
    let mockedUser: User;
    let moduleRef: TestingModule;

    beforeAll(async () => {
        mockedUser = {
            createdAt: new Date(),
            updatedAt: new Date(),
            email: 'test@test.com',
            hashPassword: await argon2.hash(password),
            id: 1,
            name: 'testing',
            role: 'admin',
        };

        const testConfig = ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal: true,
            load: [
                (): Pick<EnvironmentVariables, 'JWT_SECRET'> => ({
                    JWT_SECRET: secret,
                }),
            ],
        });

        moduleRef = await Test.createTestingModule({
            providers: [AuthService, UsersService, JwtService],
            imports: [AuthModule, ConfigModule],
        })
            .overrideProvider(UsersService)
            .useValue(mockUsersService)
            .overrideModule(ConfigModule)
            .useModule(testConfig)
            .compile();

        authService = moduleRef.get<AuthService>(AuthService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });

    it('validateUser when users not exists in db', async () => {
        (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce(
            undefined
        );

        const result = await authService.validateUser(
            mockedUser.email,
            password
        );

        expect(result).toStrictEqual(null);
    });

    it('validateUser when users exists in db', async () => {
        const { hashPassword, ...restUser } = mockedUser;

        (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce({
            hashPassword,
            ...restUser,
        });

        const result = await authService.validateUser(restUser.email, password);

        expect(result).toStrictEqual(restUser);
    });

    it('login', async () => {
        const result = await authService.login(mockedUser);

        const token = jwtService.sign({
            email: mockedUser.email,
            sub: mockedUser.id,
        });

        expect(result).toStrictEqual({ access_token: token });
    });

    afterAll(async () => {
        await moduleRef.close();
    });
});
