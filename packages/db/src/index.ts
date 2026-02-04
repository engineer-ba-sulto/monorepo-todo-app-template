import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema"; // まとめてインポート

export * from "./schema"; // すべてのテーブル定義を再エクスポート

export const getDb = (env: Env) => {
  // 第二引数に schema を渡すと、Relational Queries が使えるようになります
  return drizzle(env.DB, { schema });
};
