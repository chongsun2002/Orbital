import { SearchedUserDetails } from "@/lib/types/userTypes"
import SearchedUserCell from "./SearchedUserCell"
import { Separator } from "../ui/separator";
import { cookies } from "next/headers";

type SearchedUsersListProps = {
    users: SearchedUserDetails[];
}

const SearchedUsersList: React.FC<SearchedUsersListProps> = ({ users } : SearchedUsersListProps) => {
    const session = cookies().get('session')?.value;
    const username = session ? JSON.parse(session).name : "";
    
    return (
        <div className="flex flex-col border-solid rounded-md">
            <Separator className="mb-2"/>
            <div className="p-1.5 font-semibold">
                Search Results
            </div>
            {users.map((user, index) => {
                return user.name === username ? null : (<SearchedUserCell key={index} id={user.id} name={user.name}/>)
            })}
        </div>
    )
}

export default SearchedUsersList;