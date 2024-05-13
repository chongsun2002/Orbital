import React from 'react'
import SignupForm from "@/components/Auth/SignupForm"
import { Button } from '@/components/ui/button'
import { FcGoogle } from "react-icons/fc"

const SignupPage = () => {
    const style = 'text-[#828282] text-center font-sans text-[16px]/[24px] font-[400]'

    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                <SignupForm />
            </div>
        </div>
    )
}

export default SignupPage