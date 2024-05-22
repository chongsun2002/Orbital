import CreateActivityForm from "@/components/Activities/CreateActivityForm";

const Page = () => {
    return (
        <div className='flex h-dvh justify-center'>
            <div className="flex flex-col w-[400px] gap-[20px] mt-[56px] items-center">
                <CreateActivityForm />
            </div>
        </div>
    )
}

export default Page