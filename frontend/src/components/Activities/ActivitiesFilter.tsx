"use client"
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SelectFilter from "./SelectFilter";
import { categoryFilters, dateFilters, locationFilters } from "@/lib/constants/activityConstants";
import { Button } from "../ui/button";

const ActivitiesFilter: React.FC = () => {
    // const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // const onCategoryChange = (category: string) => {
    //     const params = new URLSearchParams(searchParams);
    //     if (category) {
    //         params.set('category', category);
    //     } else {
    //         params.delete('category');
    //     }
    //     replace(`${pathname}?${params.toString()}`);
    // }

    // const onDateChange = (date: string) => {
    //     const params = new URLSearchParams(searchParams);
    //     if (date) {
    //         params.set('date', date);
    //     } else {
    //         params.delete('date');
    //     }
    //     replace(`${pathname}?${params.toString()}`);
    // }

    // const onLocationChange = (location: string) => {
    //     const params = new URLSearchParams(searchParams);
    //     if (location) {
    //         params.set('location', location);
    //     } else {
    //         params.delete('location');
    //     }
    //     replace(`${pathname}?${params.toString()}`);
    // }

    const onClearFilters = () => {
        replace(`${pathname}`);
    }

    return (
        <div className="sm:mx-[80px]">
            <div className="flex flex-col gap-2 sm:flex-row items-center gap-5">
                <div className="content-center">Filter By:</div>
                <SelectFilter urlParamName="category" filterName="Category" filterOptions={categoryFilters} className="w-[180px]"></SelectFilter>
                <SelectFilter urlParamName="date" filterName="Date" filterOptions={dateFilters} className="w-[180px]"></SelectFilter>
                <SelectFilter urlParamName="location" filterName="Location" filterOptions={locationFilters} className="w-[180px]"></SelectFilter>
                <Button variant="secondary" onClick={onClearFilters}>
                    <div>Clear Filters</div>
                </Button>
            </div>
        </div>
    )
}

export default ActivitiesFilter;