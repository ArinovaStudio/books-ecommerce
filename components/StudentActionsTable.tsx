import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function StudentActionsTable({
  students,
  deleteStudent,
}: {
  students?: any;
  deleteStudent?: any;
}) {
  return (
    <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[80px] text-center">Sr No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length > 0 ? (
            students.map((student: any, index: number) => (
              <TableRow
                key={student.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>

                <TableCell className="font-semibold">{student.name}</TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="hover:bg-blue-500/10 hover:text-blue-600 transition"
                    >
                      <Edit className="h-4 w-4" />
                    </Button> */}

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-500/10 hover:text-red-600 transition"
                      onClick={() => deleteStudent(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-medium">No students found</span>
                  <span className="text-xs">
                    Add a student to see them listed here
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
