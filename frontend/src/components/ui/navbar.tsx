import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'

const Navbar = () => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-around mx-[80px] my-[56px] gap-[522px]'> 
            <div><Logo /></div>
            <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em]'>
                <Link href='/course_matching'>Course Matching</Link>
                <Link href='/find_friends'>Find Friends</Link>
                <Link href='/activities'>Join Activities</Link>
                <Button asChild>
                    <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign in</Link>
                </Button>
            </div>   
        </div>
    )
} 

export default Navbar