import type { Todo } from "@workspace/validators";

export const getTodos = async (): Promise<Todo[]> => {
  const todos = await fetch("http://localhost:8787/api/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return todos.json();
};
