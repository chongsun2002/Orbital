interface DividerProps {
    message: String
}

const Divider: React.FC<DividerProps> = (props) => {
    return <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow
    before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 text-[#828282] text-center font-sans
    text-[16px]/[24px] font-[400]">{ props.message }</div>
}

export default Divider