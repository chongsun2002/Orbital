import ProfileDisplay from "@/components/User/ProfileDisplay";
import { Friend, getFriends } from "@/lib/friendsActions";

const Page = async () => {
    let friends: Friend[] | undefined; 
    try {
        friends = await getFriends();
        console.log(friends);
    } catch (error) {
        friends = undefined;
    }
    return (
        <div className='columns-3 mt-[56px] mx-[50px]'>
            <div className='flex w-full justify-center'>
                <div className='font-sans text-xl'>Your Friends</div>
                { friends === undefined
                    ? <div>Could not get friends</div>
                    : <div>{friends.map((friend, index) => <ProfileDisplay key={index} name={friend.name} image={friend.image}/>)}</div>
                }
            </div>
            <div className='flex w-full justify-center'>Space for organised activities</div>
            <div className='flex w-full justify-center'>Space for courses</div>
        </div>
    );
}

export default Page;