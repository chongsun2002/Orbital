import ProfileDisplayLarge from "./ProfileDisplayLarge"
import Link from "next/link"

interface Friend {
    id: string,
    name: string,
    image?: string
}

const ProfileListLarge = ({friends}: { friends: Friend[] }) => {
    return (
        <div className="flex flex-row gap-x-10 gap-y-5 mx-[80px]">
            {friends.map((friend) => {
                return (
                    <Link key={friend.id} className='w-[40%]' href={'/user/'+friend.id}>
                        <ProfileDisplayLarge name={friend.name} image={friend.image}/>
                    </Link>
                );
            })} 
        </div>
    )
}

export default ProfileListLarge;