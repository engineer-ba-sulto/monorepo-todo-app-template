import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  todo: z.string().min(1),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Todo = z.infer<typeof todoSchema>;

export const createTodoSchema = todoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateTodo = z.infer<typeof createTodoSchema>;

export const updateTodoSchema = todoSchema.omit({
  createdAt: true,
  updatedAt: true,
});
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
