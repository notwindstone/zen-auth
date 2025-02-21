import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user_table", {
    id: serial("id").primaryKey(),
});

export const sessionTable = pgTable("session_table", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertSession = typeof sessionTable.$inferInsert;
export type SelectSession = typeof sessionTable.$inferSelect;