import type { getDb } from "./index";
import { todoTable } from "./schema";

type Db = ReturnType<typeof getDb>;

const SEED_TODOS = [
  { todo: "サンプルタスク1" },
  { todo: "サンプルタスク2" },
  { todo: "サンプルタスク3" },
] as const;

/**
 * テーブルに初期データを投入する。
 * id / createdAt / updatedAt はスキーマの $defaultFn で自動設定される。
 */
export async function runSeed(db: Db): Promise<void> {
  await db.insert(todoTable).values(SEED_TODOS.map((row) => ({ todo: row.todo })));
}
