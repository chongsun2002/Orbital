"use client"

import React from "react";
import { LuSearch } from "react-icons/lu";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
 
const ActivitiesSearch: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="flex items-center space-x-2 mx-[80px] my-[20px]">
            <Label htmlFor="search">
                <div className="flex flex-row">
                    Search
                    <LuSearch className="ml-1"/>
                </div>
            </Label>
            <Input type="search" placeholder="Search Activities"
                onChange={(e) => handleSearch(e.target.value)} id="search"
                defaultValue={searchParams.get('query')?.toString()}/>
        </div>
    )
}

export default ActivitiesSearch;