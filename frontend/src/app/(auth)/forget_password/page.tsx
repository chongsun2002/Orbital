import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm'
import React from 'react'

const Page = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[4px] justify-center items-center">
                <ForgotPasswordForm></ForgotPasswordForm>
            </div>
        </div>
    )
}

export default Page