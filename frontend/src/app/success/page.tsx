'use client'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Success = () => {
    const router = useRouter();

    useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 3000);
  
      return () => clearTimeout(timer); // Cleanup timer if the component unmounts
    }, [router]);
  
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                Success! You will be redirected home in a few seconds ...
            </div>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                Otherwise, click the adventus icon or close the tab.
            </div>
        </div>
    )
}

export default Success;