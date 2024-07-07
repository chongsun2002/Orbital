"use client"

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserDetails, getUserDetails } from "@/lib/generalActions";
import { sendFriendRequest } from "@/lib/friendsActions";
import SendFriendRequestButton from "../ui/SendFriendReqButton";

const PublicProfile = async ({isFriends, id, user}: {isFriends: Boolean, id: string, user: UserDetails}) => {
    return (
        <div className='grid grid-cols-[1fr_3fr] justify-center mt-[56px]'>
            <div className='col-start-1 col-span-1 row-auto justify-self-center'>
                <Avatar className='size-32'>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback> 
                </Avatar>
            </div>
            <div className='col-start-2 col-span-1 row-auto w-2/3 justify-self-center flex flex-col gap-[12px]'>
                <div className='font-sans text-[40px]'>{user.name}</div>
                <div className='font-sans text-xl'>{user.bio}</div>
                {
                    user.birthday 
                        ? <div className='font-sans text-xl'>
                            Birthday: {new Date(user.birthday).toDateString().split(' ').slice(1).join(' ')}
                          </div>
                        : null
                }
                {    
                    isFriends
                        ? <div>Not friends</div>
                        : (<div className="flex flex-row gap-5">
                            <SendFriendRequestButton className="font-sans text-xl" id={id} isSecret={false}/>
                            <SendFriendRequestButton className="font-sans text-xl" id={id} isSecret={true}/>
                          </div>)
                }
            </div>      
        </div>
    )
}

export default PublicProfile; 