import CreateForm from "@/components/Activities/CreateForm";

const Page = () => {
    return (
        <div className='flex h-dvh justify-center items-center'>
            <div className="flex flex-col w-[400px] gap-[20px] justify-center items-center">
                <CreateForm />
            </div>
        </div>
    )
}

export default Page