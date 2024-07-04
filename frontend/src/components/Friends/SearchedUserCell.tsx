import Link from "next/link";
import ProfileDisplay from "../User/ProfileDisplay";

type SearchedUserCellProps = {
    id: string;
    name: string;
    image?: string;
}

const SearchedUserCell: React.FC<SearchedUserCellProps> = ({ id, name, image } : SearchedUserCellProps) => {
    return (
        <div className="py-1.5 hover:bg-gray-100">
            <Link href={`/user/${id}`} className="w-full h-full flex flex-row px-2">
                <ProfileDisplay name={name} image={image}></ProfileDisplay>
            </Link>
        </div>
    )
}

export default SearchedUserCell;