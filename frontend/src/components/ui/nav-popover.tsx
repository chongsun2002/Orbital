"use client"

import { LuMenu } from "react-icons/lu";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { Separator } from "./separator"
import Link from "next/link";
import { Button } from "./button";
import { useState } from "react";

const NavPopover = () => {
    const [open, setOpen] = useState(false);

    const handleButtonClick = () => {
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <LuMenu />
            </PopoverTrigger>
            <PopoverContent className="w-screen bg-gradient-to-b from-blue-100 to-blue-200 mt-10 rounded-none">
                <button className="flex flex-col w-full" onClick={handleButtonClick}>
                    <Separator className=""/>
                    <Link href='/course_matching'>Course Matching</Link>
                    <Separator className=""/>
                    <Link href='/friends'>Find Friends</Link>
                    <Separator className=""/>
                    <Link href='/activities'>Join Activities</Link>
                    <Separator className=""/>
                </button>
            </PopoverContent>
        </Popover>
    )
}

export default NavPopover