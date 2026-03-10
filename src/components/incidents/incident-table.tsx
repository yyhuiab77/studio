"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Incident, Asset, User } from "@/lib/types";
import { format } from "date-fns";
import { IncidentForm } from "./incident-form";

const statusVariantMap: Record<Incident["status"], "default" | "secondary" | "destructive" | "outline"> = {
  "Pending": "default",
  "In Progress": "outline",
  "Resolved": "secondary",
  "Unresolved": "destructive"
};

const priorityVariantMap: Record<Incident["priority"], "default" | "secondary" | "destructive"> = {
  "Low": "secondary",
  "Medium": "default",
  "High": "destructive",
  "Critical": "destructive",
};

type IncidentData = Incident & {
    assetName: string;
    reportedByName: string;
}

export function IncidentTable({
  incidents,
  assets,
  users,
}: {
  incidents: Incident[];
  assets: Asset[];
  users: User[];
}) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedIncident, setSelectedIncident] = React.useState<Incident | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedIncident(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsFormOpen(true);
  };

  const data = React.useMemo(() => incidents.map(incident => ({
    ...incident,
    assetName: assets.find(a => a.id === incident.assetId)?.name || incident.assetId,
    reportedByName: users.find(u => u.id === incident.reportedBy)?.name || incident.reportedBy,
  })), [incidents, assets, users]);

  const columns: ColumnDef<IncidentData>[] = [
    {
      accessorKey: "title",
      header: "Incident",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "assetName",
      header: "Asset",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: Incident["status"] = row.getValue("status");
        return (
          <Badge variant={statusVariantMap[status]}>{status}</Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority: Incident["priority"] = row.getValue("priority");
        return (
          <Badge variant={priorityVariantMap[priority]}>{priority}</Badge>
        );
      },
    },
    {
      accessorKey: "reportedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reported
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{format(new Date(row.getValue("reportedAt")), 'PPp')}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const incident = row.original;
   
          return (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/incidents/${incident.id}`)}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(incident)}>
                            Edit Incident
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          );
        },
        enableHiding: false,
      },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Filter incidents..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Log Incident
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of{" "}
            {table.getCoreRowModel().rows.length} incident(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        <IncidentForm
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            incident={selectedIncident}
            assets={assets}
            users={users}
        />
      </CardContent>
    </Card>
  );
}
