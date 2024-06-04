'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LuCheckCheck, LuCheckCircle2 } from 'react-icons/lu'

const Success = () => {
    const router = useRouter();

    useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
  
      return () => clearTimeout(timer); // Cleanup timer if the component unmounts
    }, [router]);
  
    return (
        <div className='flex flex-col w-screen mt-[45vh] items-center justify-center gap-5'>
            <LuCheckCircle2 size="12vw" strokeWidth={1} color='green' className="animate-bounce"/>
            <div className="text-2xl text-green">Success! Redirecting home ...</div>
        </div>
    )
}

export default Success;