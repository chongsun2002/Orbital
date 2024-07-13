"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "../ui/label";
import { LuSearch } from "react-icons/lu";
import { Input } from "../ui/input";

const FriendsSearch: React.FC = () => {
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
        <div className="flex items-center space-x-2 my-[20px]">
            <Label htmlFor="search">
                <div className="flex flex-row">
                    Search
                    <LuSearch className="ml-1"/>
                </div>
            </Label>
            <Input type="search" placeholder="Search For User"
                onChange={(e) => handleSearch(e.target.value)} id="search"
                defaultValue={searchParams.get('query')?.toString()}/>
        </div>
    )
}

export default FriendsSearch