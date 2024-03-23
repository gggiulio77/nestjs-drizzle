import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbProvider } from 'src/db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

import * as schema from './../db/schema';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DbProvider) private db: PostgresJsDatabase<typeof schema>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<never[]> {
        // TODO: implement hashing
        const result = await this.db.insert(users).values([createUserDto]);

        return result;
    }

    async findAll(): Promise<User[]> {
        const result = await this.db.select().from(users);

        return result;
    }

    async findOne(id: number): Promise<User | undefined>;
    async findOne(email: string): Promise<User | undefined>;
    async findOne(input: number | string): Promise<User | undefined> {
        const isId = (input: number | string): input is number => {
            return typeof input === 'number';
        };

        if (isId(input)) {
            return await this.db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, input),
            });
        } else {
            return await this.db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, input),
            });
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const result = (
            await this.db
                .update(users)
                .set({ ...updateUserDto })
                .where(eq(users.id, id))
                .returning()
        ).pop();

        return result;
    }

    async remove(id: number): Promise<void> {
        const result = await this.db.transaction(async (tx) => {
            await tx.delete(users).where(eq(users.id, id));
        });

        return result;
    }
}
