import {boolean, pgTable, text, timestamp} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
    uuid: text('uuid').primaryKey().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    sessionId: text('sessionId').notNull(),
    verified: boolean('verified').notNull(),
});

export const verificationCodesTable = pgTable('verification_codes_table', {
    uuid: text('uuid').primaryKey().unique(),
    email: text('email').notNull(),
    isUsed: boolean('used').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    code: text('code').notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertVerificationCode = typeof verificationCodesTable.$inferInsert;
export type SelectVerificationCode = typeof verificationCodesTable.$inferSelect;