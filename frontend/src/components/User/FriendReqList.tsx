import Link from "next/link"
import ProfileDisplay from "./ProfileDisplay"
import AcceptFriendButton from "../ui/AcceptFriendButton"

interface Friend {
    user1: {
        id: string,
        name: string,
        image?: string
    }
}

const FriendReqList = ({friends}: { friends: Friend[] }) => {
    return (
        <div className="flex flex-col gap-x-10 gap-y-5">
            {friends.map((friend) => {
                return (
                    <div className='flex flex-row gap-x-10 items-center' key={friend.user1.id}>
                        <Link href={'/user/'+friend.user1.id}>
                            <ProfileDisplay name={friend.user1.name} image={friend.user1.image}/>
                        </Link>
                        <AcceptFriendButton id={friend.user1.id}/>
                    </div>
                );
            })} 
        </div>
    )
}

export default FriendReqList;