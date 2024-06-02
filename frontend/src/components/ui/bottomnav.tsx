import { Separator } from "./separator"

export const BottomNavBar = () => {
    return (
        <div className="pt-10">
            <Separator />
            <div className='flex flex-row flex-nowrap items-center justify-between px-[80px] py-6'> 
                Built by Chong Sun and Xan for Orbital 2024
            </div>
        </div>
    )
}