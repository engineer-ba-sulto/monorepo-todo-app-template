import type { Todo } from "@workspace/validators";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default async function TodoTable({
  className,
  todos,
}: {
  className?: string;
  todos: Todo[];
}) {
  return (
    <div className={`${cn("w-full", className)}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Todo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo: Todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.id}</TableCell>
              <TableCell>{todo.todo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
