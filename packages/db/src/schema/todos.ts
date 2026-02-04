import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const todoTable = sqliteTable("todo_table", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(10)),
  todo: text("todo").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdate(() => new Date().toISOString()),
});
