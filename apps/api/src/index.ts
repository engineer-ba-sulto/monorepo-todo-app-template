import { zValidator } from "@hono/zod-validator";
import { eq, getDb } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { createTodoSchema, updateTodoSchema } from "@workspace/validators";
import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>().basePath("/api");

app
  // 1件データ取得
  .get("/todos/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const db = getDb(c.env);
      const results = await db
        .select()
        .from(schema.todoTable)
        .where(eq(schema.todoTable.id, id));
      return c.json(results[0]);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  // 全件データ取得
  .get("/todos", async (c) => {
    try {
      const db = getDb(c.env);
      const todos = await db.select().from(schema.todoTable);
      return c.json(todos);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  // 新規登録
  .post("/todos", zValidator("json", createTodoSchema), async (c) => {
    const todo = c.req.valid("json");
    try {
      const db = getDb(c.env);
      await db.insert(schema.todoTable).values(todo);
      return c.json({ message: "Success" }, 201);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  // 更新
  .put("/todos/:id", zValidator("json", updateTodoSchema), async (c) => {
    const id = c.req.param("id");
    const todo = c.req.valid("json");
    try {
      const db = getDb(c.env);
      await db
        .update(schema.todoTable)
        .set(todo)
        .where(eq(schema.todoTable.id, id));
      return c.json({ message: "Success" }, 200);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  // 削除
  .delete("/todos/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const db = getDb(c.env);
      await db.delete(schema.todoTable).where(eq(schema.todoTable.id, id));
      return c.json({ message: "Success" }, 200);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  });

export default app;
