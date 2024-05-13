import React from 'react'
import LoginForm from "@/components/Auth/LoginForm"
import { Button } from '@/components/ui/button'
import { FcGoogle } from "react-icons/fc"

const LoginPage = () => {
    const style = 'text-[#828282] text-center font-sans text-[16px]/[24px] font-[400]'

    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage