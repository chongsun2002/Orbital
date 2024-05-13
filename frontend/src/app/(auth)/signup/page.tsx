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
                <div className={style}>or continue with</div>
                <Button type="button" className="bg-[#E6E6E6] text-black w-full">
                    <FcGoogle className="mr-2 h-4 w-4" />Google
                </Button>
                <div className={style}>By clicking continue, you agree to our 
                    <a href='' className='text-black'> Terms of Service</a> and 
                    <a href='' className='text-black'> Privacy Policy</a>
                </div>
            </div>
        </div>
    )
}

export default SignupPage