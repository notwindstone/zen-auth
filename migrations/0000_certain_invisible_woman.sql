CREATE TABLE "users_table" (
	"uuid" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_table_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
