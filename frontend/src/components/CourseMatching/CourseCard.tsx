import { FC, ReactHTMLElement } from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const CourseCard: FC<Props> = ({ children, ...props }) => {
    return (
        <div className='flex flex-col gap-[16px] items-center px-[22px] pt-[30px] w-[296px] h-[532px] bg-white'>{ children }</div>
    )
}

export default CourseCard