import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { Edit3, ArrowUpDown, ChevronDown, MoreHorizontal, Trash2, X } from 'lucide-react';
import * as React from "react"
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
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { Checkbox } from "@/components/ui/checkbox"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission Listings',
        href: '/permissions',
    },
];

type Permission = {
    id: number;
    name: string;
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    next_page_url: string | null;
    prev_page_url: string | null;
};


export default function PermissionsPage() {

    const { permissions, can } = usePage<{
        permissions: Pagination<Permission>, can: Record<string, boolean>
    }>().props;

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [deletionMode, setDeletionMode] = React.useState<'single' | 'bulk' | null>(null);
    const [recordToDelete, setRecordToDelete] = React.useState<number | null>(null);
    const [bulkDeleteIds, setBulkDeleteIds] = React.useState<number[]>([]);

    const openDeleteSheet = (mode: 'single' | 'bulk', ids: number[] = []) => {
        setDeletionMode(mode);
        if (mode === 'single') setRecordToDelete(ids[0]);
        else setBulkDeleteIds(ids);
        setIsSheetOpen(true);
    };

    const confirmDeletion = () => {
        if (deletionMode === 'single' && recordToDelete !== null) {
            router.delete(`/permissions/${recordToDelete}`, {
                onSuccess: () => {
                    toast.success('Record deleted successfully');
                    setIsSheetOpen(false);
                    router.reload();
                },
                onError: () => toast.error('Failed to delete record'),
            });
        } else if (deletionMode === 'bulk' && bulkDeleteIds.length > 0) {
            router.post('/permissions/bulk-delete', { ids: bulkDeleteIds }, {
                onSuccess: () => {
                    toast.success(`${bulkDeleteIds.length} Records deleted successfully`);
                    setRowSelection({});
                    setIsSheetOpen(false);
                    router.reload();
                },
                onError: () => toast.error('Failed to delete selected Records'),
            });
        }
    };


    const handleDelete = (recordId: number) => openDeleteSheet('single', [recordId]);

    const handleBulkDelete = () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
        if (selectedIds.length === 0) return toast.warning('No Records selected');
        openDeleteSheet('bulk', selectedIds);
    };

    const columns: ColumnDef<Permission>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "#",
            cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const record = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {can.updatePermission && (
                                <DropdownMenuItem
                                    onClick={() => router.visit(`/permissions/${record.id}/edit`)}
                                >
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {can.deletePermission && (
                                <DropdownMenuItem
                                    onClick={() => handleDelete(record.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: permissions.data,
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
            globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const name = row.original.name.toLowerCase();
            return name.includes(filterValue.toLowerCase());
        },
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex flex-col space-y-4 p-4 md:p-6">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        {can.deletePermission && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-8"
                                        disabled={table.getSelectedRowModel().rows.length === 0}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Bulk Actions
                                        {table.getSelectedRowModel().rows.length > 0 && (
                                            <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                                                {table.getSelectedRowModel().rows.length}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuLabel>
                                        {table.getSelectedRowModel().rows.length} selected
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleBulkDelete}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        disabled={table.getSelectedRowModel().rows.length === 0}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Selected
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        {can.createPermission && (
                            <Link
                                href="permissions/create"
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Add Permission
                            </Link>
                        )}

                        <div className="flex space-x-2">
                            <div className="flex space-x-2">
                                <div className="relative">
                                    <Input
                                        placeholder="Search records..."
                                        value={globalFilter ?? ""}
                                        onChange={(event) => setGlobalFilter(event.target.value)}
                                        className="max-w-xs"
                                    />
                                    {globalFilter && (
                                        <button
                                            onClick={() => setGlobalFilter("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="h-4 w-4 cursor-pointer" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        <span className="sr-only sm:not-sr-only">Columns</span>
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => (
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
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-6">
                    {/* Table Container */}
                    <div className="w-full max-w-6xl rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </TableHead>
                                        ))}
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
                                            No results found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="w-full max-w-6xl flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected
                        </div>


                        <Pagination className="justify-end">
                            <PaginationContent>
                                {/* Previous */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={permissions.prev_page_url || "#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (permissions.prev_page_url) {
                                                router.visit(permissions.prev_page_url);
                                            }
                                        }}
                                        className={!permissions.prev_page_url ? "pointer-events-none opacity-50 bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-400"}
                                    />
                                </PaginationItem>

                                {(() => {
                                    const pageLinks = [];
                                    const totalPages = permissions.last_page;
                                    const currentPage = permissions.current_page;

                                    for (let page = 1; page <= totalPages; page++) {
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            pageLinks.push(
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href={`?page=${page}`}
                                                        isActive={page === currentPage}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(`?page=${page}`);
                                                        }}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            pageLinks.push(
                                                <PaginationItem key={`ellipsis-${page}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                    }

                                    return pageLinks;
                                })()}

                                {/* Next */}
                                <PaginationItem>
                                    <PaginationNext
                                        href={permissions.next_page_url || "#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (permissions.next_page_url) {
                                                router.visit(permissions.next_page_url);
                                            }
                                        }}
                                        className={!permissions.next_page_url ? "pointer-events-none opacity-50 bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-400"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                    <div className="text-sm text-muted-foreground text-center">
                        {permissions.from && permissions.to && (
                            <>Showing <strong>{permissions.from}</strong> to <strong>{permissions.to}</strong> of <strong>{permissions.total}</strong> results</>
                        )}
                    </div>
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Are you sure?</SheetTitle>
                        <SheetDescription>
                            {deletionMode === 'bulk'
                                ? `This will permanently delete ${bulkDeleteIds.length} selected records.`
                                : `This action will permanently delete this record.`}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => {
                                setIsSheetOpen(false);
                                window.location.reload();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            onClick={confirmDeletion}
                        >
                            Delete
                        </button>
                    </div>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
