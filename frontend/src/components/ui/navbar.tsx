import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'
import LogoutButton from "../Auth/LogoutButton"
import { LuUserCircle2 } from "react-icons/lu";
import NavPopover from "./nav-popover"
  

export type NavbarProps = {
    userName: string;
}

const Navbar: React.FC<NavbarProps> = ({userName}) => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-between py-8 shadow-lg bg-gradient-to-t from-blue-100 px-[20px] sm:px-[80px]' > 
            <div className="flex gap-3 items-center">
                <div className="flex items-center sm:hidden">
                    <NavPopover/>
                </div>
                <Logo />
            </div>
            <div className='flex justify-end items-center text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold'>
                <div className="hidden sm:flex gap-[48px] pr-[48px]">
                    <Link href='/course_matching'>Course Matching</Link>
                    <Link href='/friends'>Find Friends</Link>
                    <Link href='/activities'>Join Activities</Link>
                </div>
                {userName === "" 
                ? <Button className="rounded-3xl" asChild>
                      <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                  </Button> 
                    : <Link href='/user' className="flex flex-row items-center text-blue-700">
                        <LuUserCircle2 className="mr-4 sm:mr-1 stroke-blue-700"/>
                        <div className="flex items-center hidden mr-4 sm:flex items-center">
                            { userName }
                        </div>
                    </Link> }
                {userName !== "" && <LogoutButton/> }
            </div>   
        </div>
    )
} 

export default Navbar