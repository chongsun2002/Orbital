import Link from 'next/link'
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className='flex flex-col w-full items-center gap-[12px] mt-[60vh]'>
            <Logo/>
            <h2>404 Not Found</h2>
            <p>Could not find requested resource</p>
            <Button>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
  )
}