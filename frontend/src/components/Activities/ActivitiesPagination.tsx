"use client"
import { usePathname, useSearchParams } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import React from "react"

type ActivitiesPaginationProps = {
    totalPages: number;
}

const ActivitiesPagination: React.FC<ActivitiesPaginationProps> = ({ totalPages }: ActivitiesPaginationProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }

    return (
        <Pagination>
            <PaginationContent>
                {currentPage <= 1 ? null : 
                <PaginationItem>
                    <PaginationPrevious href={createPageURL(currentPage - 1)} />
                </PaginationItem>}

                {currentPage - 1 <= 0 ? null : 
                <PaginationItem>
                    <PaginationLink href={createPageURL(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                </PaginationItem>}

                <PaginationItem>
                    <PaginationLink href={createPageURL(currentPage)}>{currentPage}</PaginationLink>
                </PaginationItem>

                {currentPage + 1 > totalPages ? null :
                <PaginationItem>
                    <PaginationLink href={createPageURL(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                </PaginationItem>}

                {currentPage + 2 > totalPages ? null :
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>}

                {currentPage === totalPages ? null :
                <PaginationItem>
                    <PaginationNext href={createPageURL(currentPage + 1)} />
                </PaginationItem>}
            </PaginationContent>
        </Pagination>
    )
}

export default ActivitiesPagination;