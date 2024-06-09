import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { UserDetails, getUserDetails } from "@/lib/generalActions";

const PublicProfile = async ({user}: {user: UserDetails}) => {
        
    const s3Url = 'https://adventus-orbital.s3.ap-southeast-1.amazonaws.com/user-images/';
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
            </div>      
        </div>
    )
}

export default PublicProfile; 