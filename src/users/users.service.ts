import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbProvider } from 'src/db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users } from 'src/db/schema';
import { eq } from 'drizzle-orm';

import * as schema from './../db/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DbProvider) private db: PostgresJsDatabase<typeof schema>) { }

  async create(createUserDto: CreateUserDto) {

    const result = await this.db.insert(users).values([
      createUserDto
    ]);

    return result;
  }

  async findAll() {
    const result = await this.db.select().from(users);

    return result;
  }

  async findOne(id: number) {
    // const result: User = await this.db.select().from(users).where(eq(users.id, id));
    const result = await this.db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, id) });

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = (await this.db.update(users).set({ ...updateUserDto }).where(eq(users.id, id)).returning()).pop();

    return result;
  }

  async remove(id: number) {
    const result = await this.db.transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, id));
    });

    return result;
  }
}
