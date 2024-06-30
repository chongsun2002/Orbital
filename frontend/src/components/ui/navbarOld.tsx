/**
 * This file is deprecated, currently using navbarNew.tsx
 */

import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'
import LogoutButton from "../Auth/LogoutButton"
import { LuUserCircle2 } from "react-icons/lu";
import NavbarUser from "./navbarNew"

export type NavbarProps = {
    id: string,
    userName: string,
    image: string
}

const Navbar: React.FC<NavbarProps> = ({id, userName, image}) => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-between px-[80px] py-8 shadow-lg bg-gradient-to-t from-blue-100' > 
            <Logo />
            <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold'>
                <Link href='/course_matching'>Course Matching</Link>
                <Link href='/friends'>Find Friends</Link>
                <Link href='/activities'>Join Activities</Link>
                {userName === "" 
                ? <Button className="rounded-3xl" asChild>
                      <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                  </Button> 
                    : <NavbarUser user={{id: id, name: userName, image: image}}/>
                    /*: <Link href='/user' className="flex flex-row items-center text-blue-700">
                        <LuUserCircle2 className="mr-1 stroke-blue-700"/>
                        { userName }
                    </Link> */}
                {userName === "" ? <div></div> 
                : <LogoutButton/> }
            </div>   
        </div>
    )
} 

export default Navbar