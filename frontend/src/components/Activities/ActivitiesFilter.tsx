"use client"
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SelectFilter from "./SelectFilter";
import { categoryFilters, dateFilters, locationFilters } from "@/lib/constants/activityConstants";
import { Button } from "../ui/button";

const ActivitiesFilter: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const onCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const onDateChange = (date: string) => {
        const params = new URLSearchParams(searchParams);
        if (date) {
            params.set('date', date);
        } else {
            params.delete('date');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const onLocationChange = (location: string) => {
        const params = new URLSearchParams(searchParams);
        if (location) {
            params.set('location', location);
        } else {
            params.delete('location');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const onClearFilters = () => {
        replace(`${pathname}`);
    }

    return (
        <div className="mx-[80px]">
            <div className="flex flex-row items-center">
                <div className="content-center">Filter By:</div>
                <SelectFilter onValueChange={onCategoryChange} filterName="Category" filterOptions={categoryFilters} className="w-[180px] mx-5"></SelectFilter>
                <SelectFilter onValueChange={onDateChange} filterName="Date" filterOptions={dateFilters} className="w-[180px] mx-5"></SelectFilter>
                <SelectFilter onValueChange={onLocationChange} filterName="Location" filterOptions={locationFilters} className="w-[180px] mx-5"></SelectFilter>
                <Button className="bg-blue-300 hover:bg-blue-500" onClick={onClearFilters}>
                    <div className="text-black">Clear Filters</div>
                </Button>
            </div>
        </div>
    )
}

export default ActivitiesFilter;