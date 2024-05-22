import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as dotenv from 'dotenv';
import { CreateUserDto } from '@users/dto/create-user.dto';
import * as argon2 from 'argon2';
import { users } from '@db/schema';

async function run() {
    dotenv.config();

    const sql = postgres(process.env.DB_URL, { max: 1 });
    const db = drizzle(sql);

    const { password, ...rest }: CreateUserDto = {
        name: 'testing',
        email: 'testing@testing.com',
        password: 'testing',
        role: 'admin',
    };

    const hashPassword = await argon2.hash(password);

    await db.insert(users).values([{ ...rest, hashPassword }]);

    await sql.end();
}

run();
