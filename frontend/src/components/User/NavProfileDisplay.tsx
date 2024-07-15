import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Props {
    className? : string,
    name: string,
    image?: string
}

const NavProfileDisplay = ({ className, name, image=''}: Props) => {
    return (
        <div id='navProfileDisplay' className={cn('flex justify-left items-center max-w-14 sm:max-w-none w-full', className)}>
            <Avatar className="size-12">
                <AvatarImage src={ image } />
                <AvatarFallback>{ name[0] }</AvatarFallback> 
            </Avatar>
            <div className='ml-[10px] font-sans hidden sm:block'>{ name }</div>
        </div>
    )
}

export default NavProfileDisplay