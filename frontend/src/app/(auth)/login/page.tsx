import React from 'react'
import LoginForm from "@/components/Auth/LoginForm"

const LoginPage = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[4px] justify-center items-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage