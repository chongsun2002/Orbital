"use client"

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { handleGoogle } from '@/lib/authActions'
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

//declare var google: any;

export default function GoogleButton() {
    /*
    return (
        <div>
            <Button type="button" className="bg-[#E6E6E6] text-black w-full hover:bg-[#E6E6E6]/60">
                <FcGoogle className="mr-2 h-4 w-4" />Google
            </Button>
        </div>
    )
    */
    const { toast } = useToast();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const router = useRouter();
    

    async function googleSignin(response: any) {
        try {
            await handleGoogle(response);
            router.push('/');
        } catch (error) {
            toast({
                title: (error as Error).message 
            });
            return;
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            const { google } = window;
            if (google) {
                google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                    callback: googleSignin,
                });
                const buttonDiv = document.getElementById("buttonDiv");
                if (buttonDiv) {
                    google.accounts.id.renderButton(
                        buttonDiv,
                        { theme: "outline", size: "large", width: 400 }  // customization attributes
                    );
                }
                google.accounts.id.prompt(); // also display the One Tap dialog
            } 
        }, 1);
    }, [scriptLoaded]);
    
    return (
        <div>
            <Script src="https://accounts.google.com/gsi/client" async onLoad={() => setScriptLoaded(true)}></Script>
            <div id='buttonDiv' className='font-sans'/>
        </div>
    ) 
}
