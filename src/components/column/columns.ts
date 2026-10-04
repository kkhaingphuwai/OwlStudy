import type { ColumnDef } from "@tanstack/react-table";

type Student = {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "session",
    header: "Session",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "assigned",
    header: "Assigned",
  },
  {
    accessorKey: "registrationDate",
    header: "Registered Date",
    cell: ({ row }) =>
      new Date(row.original.registrationDate).toLocaleDateString(),
  },
];