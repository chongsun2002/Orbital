import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleButton() {
    return (
        <Button type="button" className="bg-[#E6E6E6] text-black w-full hover:bg-[#E6E6E6]/60">
            <FcGoogle className="mr-2 h-4 w-4" />Google
        </Button>
)}