import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'
import { cookies } from "next/headers"

export type NavbarProps = {
    userName: string;
}

const Navbar: React.FC<NavbarProps> = ({userName}) => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-between mx-[80px] mt-[56px]'> 
            <Logo />
            <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em]'>
                <Link href='/course_matching'>Course Matching</Link>
                <Link href='/friends'>Find Friends</Link>
                <Link href='/activities'>Join Activities</Link>
                {userName === "" 
                ? <Button asChild>
                      <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                  </Button> 
                    : "Welcome, " + userName}
                {userName === "" ? <div></div> 
                : <Button asChild>
                      <Link href="/logout" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Log Out</Link>
                  </Button> }
            </div>   
        </div>
    )
} 

export default Navbar