"use client"

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserDetails, getUserDetails } from "@/lib/generalActions";
import RemoveFriendButton from "../Friends/RemoveFriendButton";
import UnsendFriendRequestButton from "../Friends/UnsendFriendRequestButton";
import SendFriendRequestButtonGroup from "../Friends/SendFriendRequestButtonGroup";

const PrivateProfile = ({id, user, isFriends, hasRequested }: {isFriends: boolean, hasRequested: boolean, id: string, user: UserDetails}) => {
    const s3Url = 'https://adventus-orbital.s3.ap-southeast-1.amazonaws.com/user-images/';
    return (
        <div className='grid grid-cols-[1fr_3fr] justify-center mt-[56px]'>
            <div className='col-start-1 col-span-1 row-auto justify-self-center'>
                <Avatar className='size-32'>
                    <AvatarFallback>{user.name[0]}</AvatarFallback> 
                </Avatar>
            </div>
            <div className='col-start-2 col-span-1 row-auto w-2/3 justify-self-center flex flex-col gap-[12px]'>
                <div className='font-sans text-[40px]'>{user.name}</div>
                {    
                    isFriends
                        ? <RemoveFriendButton friendId={id} friendName={user.name}/>
                        : hasRequested
                        ? <UnsendFriendRequestButton recipientId={id}/>
                        : <SendFriendRequestButtonGroup id={id}/>
                }
            </div>      
        </div>
    )
}

export default PrivateProfile; 