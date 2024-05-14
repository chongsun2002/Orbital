import { FC } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
    name: string
    image: string //assume link for now
}

const ProfileDisplay: FC<Props> = ({ name,  image='', ...props }) => {
    return (
        <div className='flex justify-left items-center w-full'>
            <Avatar>
                <AvatarImage src={ image } />
                <AvatarFallback>{ name[0] }</AvatarFallback> 
            </Avatar>

            <div className='ml-[10px] font-sans'>{ name }</div>
        </div>
    )
}

export default ProfileDisplay