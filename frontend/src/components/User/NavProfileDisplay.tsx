import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Props {
    className? : string,
    name: string,
    image?: string
}

const NavProfileDisplay = ({ className, name, image=''}: Props) => {
    return (
        <div id='navProfileDisplay' className={cn('flex flex-initial justify-left items-center max-w-48 sm:max-w-none', className)}>
            <Avatar className="size-12">
                <AvatarImage src={ image } />
                <AvatarFallback>{ name[0] }</AvatarFallback> 
            </Avatar>
            <div className='ml-[10px] max-w-36 flex-initial font-sans hidden sm:block truncate'>{ name }</div>
        </div>
    )
}

export default NavProfileDisplay