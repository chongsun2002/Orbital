import Link from "next/link"
import * as React from "react"
import { Logo } from "./logo"
import { Button } from './button'
import { cookies } from "next/headers"

const Navbar = () => {
    return(
        <div className='flex flex-row flex-nowrap items-center justify-around mx-[80px] my-[56px] gap-[522px]'> 
            <div><Logo /></div>
            <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em]'>
                <Link href='/course_matching'>Course Matching</Link>
                <Link href='/find_friends'>Find Friends</Link>
                <Link href='/activities'>Join Activities</Link>
                {cookies().get('Token') 
                    ? <Button asChild>
                            <Link href="/logout" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Log Out</Link>
                        </Button> 
                    : <Button asChild>
                            <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                        </Button>}
            </div>   
        </div>
    )
} 

export default Navbar