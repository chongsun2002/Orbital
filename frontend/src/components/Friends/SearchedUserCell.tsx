import Link from "next/link";
import ProfileDisplay from "../User/ProfileDisplay";
import { Separator } from "../ui/separator";

type SearchedUserCellProps = {
    id: string;
    name: string;
    image?: string;
}

const SearchedUserCell: React.FC<SearchedUserCellProps> = ({ id, name, image } : SearchedUserCellProps) => {
    return (
        <div>
            <Link href={`/user/${id}`} className="w-full h-full flex flex-row border-solid">
                <ProfileDisplay name={name} image={image}></ProfileDisplay>
            </Link>
            <Separator className="my-2"/>
        </div>
    )
}

export default SearchedUserCell;