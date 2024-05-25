import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LuPlus } from "react-icons/lu"
import ActivitiesSearch from "@/components/Activities/ActivitiesSearch"
import ActivitiesList from "@/components/Activities/ActivitiesList"
import ActivitiesPagination from "@/components/Activities/ActivitiesPagination"
import { ActivitiesListProps } from "@/components/Activities/ActivitiesList"
import { getActivities } from "@/lib/activityActions"
import ActivitiesFilter from "@/components/Activities/ActivitiesFilter"

const activities = async ({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) => {
    const query: string = searchParams?.query || '';
    const currentPage: number = Number(searchParams?.page) || 1;
    let activitiesData: ActivitiesListProps | undefined;

    try {
        activitiesData = await getActivities(query, currentPage);
    } catch (error) {
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

                <p>Error loading activities. Please try again later.</p>
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