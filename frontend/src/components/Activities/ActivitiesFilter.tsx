"use client"
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SelectFilter from "./SelectFilter";
import { categoryFilters, dateFilters, locationFilters } from "@/lib/constants/activityConstants";

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

    return (
        <div className="flex flex-row mx-[80px]">
            <h1 className="content-center">Filter By:</h1>
            <SelectFilter onValueChange={onCategoryChange} filterName="Category" filterOptions={categoryFilters} className="w-[180px] mx-5"></SelectFilter>
            <SelectFilter onValueChange={onDateChange} filterName="Date" filterOptions={dateFilters} className="w-[180px] mx-5"></SelectFilter>
            <SelectFilter onValueChange={onLocationChange} filterName="Location" filterOptions={locationFilters} className="w-[180px] mx-5"></SelectFilter>
        </div>
    )
}

export default ActivitiesFilter;