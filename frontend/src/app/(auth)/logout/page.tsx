import React from 'react'
import { cookies } from "next/headers"
import { redirectHome } from '@/lib/generalActions'
import { endSession } from '@/lib/session'

const LogoutPage = async () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                You will be redirected home in a few seconds ...
            </div>
        </div>
    )
}

export default LogoutPage