import { ReactHTMLElement } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Props {
    className? : ReactHTMLElement<HTMLDivElement>,
    name: string,
    image?: string
}

const ProfileDisplay = ({ className, name, image=''}: Props) => {
    return (
        <div className={cn('flex justify-left items-center w-full', className)}>
            <Avatar>
                <AvatarImage src={ image } />
                <AvatarFallback>{ name[0] }</AvatarFallback> 
            </Avatar>
            <div className='ml-[10px] font-sans'>{ name }</div>
        </div>
    )
}

export default ProfileDisplay