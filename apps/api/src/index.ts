import { Hono } from "hono";
import { getDb } from "@workspace/db";
import * as schema from "@workspace/db/schema";

const app = new Hono<{ Bindings: CloudflareBindings }>().basePath("/api");

app.get("/todos", async (c) => {
  const db = getDb(c.env);
  const todos = await db.select().from(schema.todoTable);
  return c.json(todos);
});

export default app;
