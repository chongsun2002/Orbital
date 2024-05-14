import { FC, ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const CourseHeading: FC<Props> = ({ className, children, ...props }) => {
    return (
        <Badge className={cn('hover:bg-primary font-sans w-[177px] h-[47px] justify-center text-[18px]', className)}>{ children }</Badge>
    )
}

export default CourseHeading