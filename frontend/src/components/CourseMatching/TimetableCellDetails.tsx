type TimetableCellDetailsProps = {
    header: string;
    content: string;
}

const TimetableCellDetails: React.FC<TimetableCellDetailsProps> = ({ header, content }: TimetableCellDetailsProps) => {
    return (
        <div className="flex flex-row items-center">
            <div className="scroll-m-20 text-base font-semibold tracking-tight">
                {header}:&nbsp;
            </div>
            <div className="scroll-m-20 text-base text-black font-normal tracking-tight">
                {content}
            </div>
        </div>
    )
}

export default TimetableCellDetails;