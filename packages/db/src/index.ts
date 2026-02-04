import { drizzle } from "drizzle-orm/d1";

export const getDb = async (env: Env) => {
  return drizzle(env.DB);
};
