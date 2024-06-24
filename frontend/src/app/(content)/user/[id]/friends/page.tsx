import FriendReqList from "@/components/User/FriendReqList";
import ProfileListLarge from "@/components/User/ProfileListLarge";
import { Friend, getFriends, getIncomingFriendRequests } from "@/lib/friendsActions";
import Link from "next/link";

const Page = async ({params}: { params: { id: string }}) => {
    
    try {
        var friends: Friend[] = await getFriends(); 
        var pending = await getIncomingFriendRequests();
    } catch (error) {
        return <div>{(error as Error).message}</div>
    }

    return (
        <div className="grid grid-cols-3">
            <div className="flex flex-col w-full col-start-1 col-span-2">
                <div className='font-sans text-4xl font-semibold mx-[80px] my-[20px]'>Your Friends</div>
                {
                    friends.length === 0
                        ?   <div className='flex w-full font-sans justify-center items-center text-xl'>
                                Looks like you haven't added any friends yet.
                                Click <Link href='/friends' className='text-blue-500 mx-[5px] underline underline-offset-2 hover:text-blue-400'>here</Link> to get started.
                            </div>
                        :   <ProfileListLarge friends={friends} />        
                }
            </div>
            <div className="flex flex-col w-full col-start-3 col-span-1">
                <div className='font-sans text-2xl self-start font-semibold my-[20px]'>Incoming friend requests</div>
                {
                    pending.length === 0
                        ?   <div className='font-sans text-xl self-start'>
                                No incoming friend requests
                            </div>
                        :   <FriendReqList friends={pending} />        
                }
            </div>
        </div>
    )
}

export default Page;