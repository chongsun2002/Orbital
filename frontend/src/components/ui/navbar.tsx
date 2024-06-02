import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'
import LogoutButton from "../Auth/LogoutButton"

export type NavbarProps = {
    userName: string;
}

const Navbar: React.FC<NavbarProps> = ({userName}) => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-between px-[80px] py-8 shadow-lg'> 
            <Logo />
            <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold'>
                <Link href='/course_matching'>Course Matching</Link>
                <Link href='/friends'>Find Friends</Link>
                <Link href='/activities'>Join Activities</Link>
                {userName === "" 
                ? <Button className="rounded-3xl" asChild>
                      <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                  </Button> 
                    : <Link href='/user'>{ "Welcome, " + userName }</Link> }
                {userName === "" ? <div></div> 
                : <LogoutButton/> }
            </div>   
        </div>
    )
} 

export default Navbar