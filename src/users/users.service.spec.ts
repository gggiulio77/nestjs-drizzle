import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DbModule } from '@db/db.module';
import { ConfigModule } from '@nestjs/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Except } from '@utility/index';

describe('UsersService', () => {
    let service: UsersService;
    let client: postgres.Sql;
    let db: PostgresJsDatabase<typeof schema>;
    let moduleRef: TestingModule;
    let postgresContainer: StartedPostgreSqlContainer;

    beforeAll(async () => {
        postgresContainer = await new PostgreSqlContainer()
            .withDatabase('testing')
            .withPassword('testing')
            .withUsername('testing')
            .start();

        const url = postgresContainer.getConnectionUri();

        const testConfig = ConfigModule.forRoot({
            ignoreEnvFile: true,
            load: [() => ({ DB_URL: url })],
        });

        moduleRef = await Test.createTestingModule({
            providers: [UsersService],
            imports: [DbModule],
        })
            .overrideModule(ConfigModule)
            .useModule(testConfig)
            .compile();

        client = postgres(url, { max: 1 });
        db = drizzle(client, { schema });

        await migrate(db, { migrationsFolder: 'migrations' });

        service = moduleRef.get<UsersService>(UsersService);
    });

    it('findAll', async () => {
        const result = await service.findAll();

        expect(result).toStrictEqual([]);
    });

    it('should be defined', async () => {
        const { password, ...restUser }: CreateUserDto = {
            email: 'test@test.com',
            name: 'test',
            role: 'admin',
            password: 'test',
        };

        await service.create({ password, ...restUser });

        const { hashPassword: _, ...rest }: User = (
            await db.select().from(schema.users)
        ).pop();

        expect({ id: 1, ...restUser }).toStrictEqual<
            Except<User, 'createdAt' | 'updatedAt' | 'hashPassword'>
        >({
            name: rest.name,
            role: rest.role,
            email: rest.email,
            id: rest.id,
        });
    });

    afterAll(async () => {
        await Promise.all([client.end(), moduleRef.close()]);
    });
});
