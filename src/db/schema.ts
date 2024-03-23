import { serial, text, timestamp, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { Roles, User } from 'src/users/entities/user.entity';

export const rolesEnum = pgEnum('roles', Roles);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    role: rolesEnum('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});

const SelectUser = users.$inferSelect satisfies User;

const InsertUser = users.$inferInsert satisfies Partial<User>;

export type InsertUserType = typeof InsertUser;

export type SelectUserType = typeof SelectUser;
