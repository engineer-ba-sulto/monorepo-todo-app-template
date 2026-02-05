import TodoTable from "@/components/todo-table";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-3xl font-bold">
      <h1 className="text-4xl font-bold">Todo List</h1>
      <TodoTable className="w-5xl mt-10" />
    </main>
  );
}
