import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserDetails, getUserDetails } from "@/lib/generalActions";
import EditProfileForm from "./EditProfileForm"

const OwnProfile = async ({user}: {user: UserDetails}) => {
        
    const s3Url = 'https://adventus-orbital.s3.ap-southeast-1.amazonaws.com/user-images/';
    return (
        <div className='grid grid-cols-[1fr_3fr] justify-center mt-[56px]'>
            <div className='col-start-1 col-span-1 row-auto justify-self-center'>
                <Avatar className='size-32'>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback> 
                </Avatar>
            </div>
            <div className='col-start-2 col-span-1 row-auto w-2/3 justify-self-center'>
                <EditProfileForm name={user.name} bio={user.bio} birthday={user.birthday} /> 
            </div>      
        </div>
    )
}

export default OwnProfile; 