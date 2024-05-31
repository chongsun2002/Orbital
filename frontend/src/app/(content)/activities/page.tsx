import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"
import ActivitiesSearch from "@/components/Activities/ActivitiesSearch"
import ActivitiesList from "@/components/Activities/ActivitiesList"
import ActivitiesPagination from "@/components/Activities/ActivitiesPagination"
import { ActivitiesListProps } from "@/components/Activities/ActivitiesList"
import { getActivities } from "@/lib/activityActions"
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

    try {
        activitiesData = await getActivities(query, currentPage, category, date, location);
    } catch (error) {
        console.error(error)
        activitiesData = undefined;
    }

    if (!activitiesData) {
        return (
            <div>
                <div className='flex flex-row justify-between mx-[80px] my-14'>
                    <h1 className="text-4xl font-bold">Explore Activities</h1>
                    <Button>
                        <Link href="/activities/create">
                            <div className='flex flex-row content-center'>
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
            <div className='flex flex-row justify-between mx-[80px] my-14'>
                <h1 className="text-4xl font-bold">Explore Activities</h1>
                <Button>
                    <Link href="/activities/create">
                        <div className='flex flex-row content-center'>
                            <h2>Create Activity</h2>
                            <LuPlus className="mx-1 my-0.5"/>
                        </div>
                    </Link>
                </Button>
            </div>

            <ActivitiesFilter/>
            
            <ActivitiesSearch/>

            <ActivitiesList activities={activitiesData.activities}></ActivitiesList>

            <ActivitiesPagination totalPages={3}></ActivitiesPagination>
        </div>
    )
}

export default activities