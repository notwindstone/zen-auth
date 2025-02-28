import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user_table", {
    id: text("id").primaryKey(),
    username: text('username').notNull().unique(),
    displayName: text('display_name').notNull(),
    avatarUrl: text('avatar_url').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
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
    email: text("email").notNull().unique(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const resetCodesTable = pgTable("reset_codes_table", {
    id: text("id").primaryKey(),
    resetToken: text("reset_token").notNull(),
    email: text("email").notNull().unique(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export type TableUserType = typeof userTable.$inferSelect;
export type TableSessionType = typeof sessionTable.$inferSelect;
export type TableVerificationCodeType = typeof verificationCodesTable.$inferSelect;
export type TableResetCodeType = typeof resetCodesTable.$inferSelect;