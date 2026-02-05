import TodoTable from "@/components/todo-table";
import { getTodos } from "@/lib/actions";

export default async function Home() {
  const todos = await getTodos();
  return (
    <main className="flex flex-col justify-center items-center h-screen text-3xl font-bold">
      <h1 className="text-4xl font-bold">Todo List</h1>
      <TodoTable className="w-5xl mt-10" todos={todos} />
    </main>
  );
}
