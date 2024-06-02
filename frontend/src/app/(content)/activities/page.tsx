import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"
import ActivitiesSearch from "@/components/Activities/ActivitiesSearch"
import ActivitiesList from "@/components/Activities/ActivitiesList"
import ActivitiesPagination from "@/components/Activities/ActivitiesPagination"
import { ActivitiesListProps } from "@/components/Activities/ActivitiesList"
import { countActivities, getActivities } from "@/lib/activityActions"
import ActivitiesFilter from "@/components/Activities/ActivitiesFilter"
import { Logo } from "@/components/ui/logo"

const activities = async ({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
        date?: string;
        location?: string;
        category?: string;
    }
}) => {
    const query: string = searchParams?.query || '';
    const currentPage: number = Number(searchParams?.page) || 1;
    const date: string = searchParams?.date || '';
    const location: string = searchParams?.location || '';
    const category: string = searchParams?.category || '';

    let activitiesData: ActivitiesListProps | undefined;
    let totalPages: number | undefined;

    const [activitiesResult, pagesResult] = await Promise.allSettled([
        getActivities(query, currentPage, category, date, location),
        countActivities()
    ])

    if (activitiesResult.status === 'fulfilled') {
        activitiesData = activitiesResult.value;
    } else {
        console.error(`There was an error getting the activities: ${activitiesResult.reason}`);
        activitiesData = undefined;
    }
    
    if (pagesResult.status === 'fulfilled') {
        totalPages = Math.ceil(pagesResult.value.activityCount / 9);
    } else {
        console.error(`There was an error getting the total pages: ${pagesResult.reason}`);
        totalPages = 1;
    }

    if (!activitiesData) {
        return (
            <div>
                <div className='flex flex-row justify-between mx-[80px] my-14'>
                    <h1 className="text-4xl font-bold">Explore Activities</h1>
                    <Button className="px-0 py-0">
                    <Link href="/activities/create">
                        <div className='flex flex-row content-center mx-4 my-2'>
                            <h2>Create Activity</h2>
                            <LuPlus className="mx-1 my-0.5"/>
                        </div>
                    </Link>
                </Button>
                </div>

                <div className='flex flex-col w-full items-center gap-[12px] mt-[60vh]'>
                    <Logo/>
                    <h2>Could not load activities. Try again later.</h2>
                    <Button>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='flex flex-row justify-between mx-[80px] my-5'>
                <h1 className="text-4xl font-bold">Explore Activities</h1>
                <Button className="px-0 py-0">
                    <Link href="/activities/create">
                        <div className='flex flex-row content-center mx-4 my-2'>
                            <h2>Create Activity</h2>
                            <LuPlus className="mx-1 my-0.5"/>
                        </div>
                    </Link>
                </Button>
            </div>

            <ActivitiesFilter/>
            
            <ActivitiesSearch/>

            <ActivitiesList activities={activitiesData.activities}></ActivitiesList>

            <ActivitiesPagination totalPages={totalPages}></ActivitiesPagination>
        </div>
    )
}

export default activities