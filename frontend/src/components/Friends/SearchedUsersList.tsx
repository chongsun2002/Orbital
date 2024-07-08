import { SearchedUserDetails } from "@/lib/types/userTypes"
import SearchedUserCell from "./SearchedUserCell"
import { Separator } from "../ui/separator";

type SearchedUsersListProps = {
    users: SearchedUserDetails[];
}

const SearchedUsersList: React.FC<SearchedUsersListProps> = ({ users } : SearchedUsersListProps) => {
    return (
        <div className="flex flex-col border-solid rounded-md">
            <Separator className="mb-2"/>
            <div className="p-1.5 font-semibold">
                Search Results
            </div>
            {users.map((user, index) => {
                return (<SearchedUserCell key={index} id={user.id} name={user.name}/>)
            })}
        </div>
    )
}

export default SearchedUsersList;