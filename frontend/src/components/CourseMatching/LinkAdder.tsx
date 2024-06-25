"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/data-table";
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dummyLinks: NUSModsLink[] = [{name: "Me", link: "https://nusmods.com/timetable/sem-2/share?CS2030S=LAB:14B,REC:24,LEC:2&CS2040S=REC:04,TUT:52,LEC:2&IS1108=TUT:06,LEC:2&MA1522=TUT:9,LEC:2&ST1131=LEC:1,TUT:5&ST2334=TUT:9,LEC:2&UTW1001O=SEC:1"}]

export type NUSModsLink = {
    name: string;
    link: string;
}

export const columns: ColumnDef<NUSModsLink>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "link",
        header: "NUSMods Link",
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const linkEntry = row.original
     
          return (
            <div >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(linkEntry.link)}
                        >
                        Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          )
        },
      },
]

const LinkAdder = () => {
    return (
        <div className="mx-[80px]">
            <DataTable columns={columns} data={dummyLinks}></DataTable>
        </div>
    )
}

export default LinkAdder