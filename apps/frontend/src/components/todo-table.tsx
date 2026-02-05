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

export default async function TodoTable({ className }: { className?: string }) {
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
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Todo 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
