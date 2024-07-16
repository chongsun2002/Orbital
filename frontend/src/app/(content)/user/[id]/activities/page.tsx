import { Activity, SearchedActivity } from "@/lib/types/activityTypes";
import { API_URL } from "@/lib/utils";
import ActivitiesList from "@/components/Activities/ActivitiesList";
import Link from "next/link";

const Page = async ({ params }: {params: {id: string}}) => {
    //get organised activities
    const query = new URLSearchParams({
        id: params.id
    });
    const url = new URL('api/v1/activities/getorganised', API_URL);
    url.search = query.toString();
    const res: Response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache'
    });
    if(!res) {
        return <div>Unexpected error</div>
    }
    if (res.status === 400) {
        return <div>400 User ID invalid</div>
    } 
    if (res.status === 404) {
        return <div>404 User not found</div>
    }
    const resBody = await res.json();
    if (res.status !== 200) {
        return <div>{resBody.error}</div>
    }
    const organisedActivities: Activity[] = resBody.organisedActivities; 
    const sActivities: SearchedActivity[] = organisedActivities.map((act) => {
        return {  
            id: act.id,
            title: act.title,
            description: act.description,
            startTime: act.startTime,
            endTime: act.endTime,
            organiserId: act.organiserId,
            numOfParticipants: act.numOfParticipants,
            category: act.category,
            location: act.location,
            organiser: { name: "You" }
        }
    });

    //get joined activities
    const urln = new URL('api/v1/activities/getjoined', API_URL);
    urln.search = query.toString();
    const resn: Response = await fetch(urln.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache'
    });
    if(!resn) {
        return <div>Unexpected error</div>
    }
    if (resn.status === 400) {
        return <div>400 User ID invalid</div>
    } 
    if (resn.status === 404) {
        return <div>404 User not found</div>
    }
    const resBodyn = await resn.json();
    if (resn.status !== 200) {
        return <div>{resBodyn.error}</div>
    }
    const joinedActivities: SearchedActivity[] = resBody.joinedActivities; 

    const activities: SearchedActivity[] = sActivities.concat(joinedActivities);
    return (
        <div className='flex flex-col w-full'>
            <div className='font-sans text-4xl font-semibold mx-[80px] my-[20px]'>Your Activities</div>
            {
                activities.length === 0
                    ?   <div className='flex w-full font-sans justify-center items-center text-xl'>
                            Looks like you're not in any activities yet.
                            Click <Link href='/activities' className='text-blue-500 mx-[5px] underline underline-offset-2 hover:text-blue-400'>here</Link> to get started.
                        </div>
                    :   <ActivitiesList activities={sActivities}/>
            }
        </div>
    )
}

export default Page;