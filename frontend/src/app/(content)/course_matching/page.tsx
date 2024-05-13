const courseMatching = () => {
    const course = 'flex flex-col items-center pt-[30px] w-[296px] h-[532px] bg-white'
    return(
        <div>
            <div className="text-black font-sans text-[64px] font-[700] tracking-[-1.28px] ml-[80px] mb-[80px]">
                Course Matching
            </div>
            <div className='flex bg-[#DEDEDE] justify-evenly items-center h-[650px]'>
                <div className={ course }>MA1522</div>
                <div className={ course } />
                <div className={ course } />
                <div className={ course } />
            </div>
        </div>
    )
}

export default courseMatching