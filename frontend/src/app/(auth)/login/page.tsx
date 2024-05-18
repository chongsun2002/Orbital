import React from 'react'
import LoginForm from "@/components/Auth/LoginForm"
import { cookies } from "next/headers"
import { redirectHome } from '@/lib/generalActions'

const LoginPage = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage