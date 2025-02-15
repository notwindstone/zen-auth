import { pgTable, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    uuid: text('uuid').primaryKey().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    sessionId: text('sessionId').notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;