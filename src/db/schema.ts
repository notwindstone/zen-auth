import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const userTable = pgTable("user_table", {
    id: text("id").primaryKey(),
    username: text('username').notNull().unique(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    lastSignedIn: timestamp('last_signed_in', {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const sessionTable = pgTable("session_table", {
    id: text("id").primaryKey(),
    ipAddress: text("ip_address").notNull(),
    lastSignedIn: timestamp("last_signed_in", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    browser: text("browser").notNull(),
    architecture: text("architecture").notNull(),
    os: text("os").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const verificationCodesTable = pgTable("verification_codes_table", {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    email: text("email").notNull(),
    used: boolean("used").notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertSession = typeof sessionTable.$inferInsert;
export type SelectSession = typeof sessionTable.$inferSelect;

export type InsertVerificationCode = typeof verificationCodesTable.$inferInsert;
export type SelectVerificationCode = typeof verificationCodesTable.$inferSelect;