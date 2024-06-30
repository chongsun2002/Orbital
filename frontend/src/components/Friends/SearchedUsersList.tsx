import { SearchedUserDetails } from "@/lib/types/userTypes"
import SearchedUserCell from "./SearchedUserCell"

type SearchedUsersListProps = {
    users: SearchedUserDetails[];
}

const SearchedUsersList: React.FC<SearchedUsersListProps> = ({ users } : SearchedUsersListProps) => {
    return (
        <div className="flex flex-col mx-[80px] border-solid border-2 rounded-md p-4">
            {users.map((user, index) => {
                return (<SearchedUserCell key={index} id={user.id} name={user.name}/>)
            })}
        </div>
    )
}

export default SearchedUsersList;