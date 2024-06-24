import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
    className? : string,
    name: string,
    image?: string
}

const ProfileDisplayLarge = ({ className, name, image=''}: Props) => {
    return (
        <div className={cn('flex items-center w-full px-[10px] py-[10px] rounded-lg border-2 border-sky-400', className)}>
            <Avatar className="size-20">
                <AvatarImage src={ image } />
                <AvatarFallback>{ name[0] }</AvatarFallback> 
            </Avatar>
            <div className='ml-[20px] text-2xl font-sans '>{ name }</div>
        </div>
 
    ) 
}

export default ProfileDisplayLarge;