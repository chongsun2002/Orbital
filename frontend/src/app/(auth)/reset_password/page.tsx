import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm'
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm'
import React from 'react'

const Page = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[4px] justify-center items-center">
                <ResetPasswordForm></ResetPasswordForm>
            </div>
        </div>
    )
}

export default Page