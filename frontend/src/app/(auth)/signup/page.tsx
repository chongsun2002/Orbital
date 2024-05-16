import React from 'react'
import SignupForm from "@/components/Auth/SignupForm"

const SignupPage = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                <SignupForm />
            </div>
        </div>
    )
}

export default SignupPage