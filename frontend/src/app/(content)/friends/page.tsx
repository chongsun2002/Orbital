import FriendsSearch from "@/components/Friends/FriendsSearch";
import { SearchedUserDetails } from "@/lib/types/userTypes";
import { getUsers } from "@/lib/userActions";
import SearchedUsersList from "@/components/Friends/SearchedUsersList";

const Page = async ({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    }
}) => {
    const query: string = searchParams?.query || '';
    let users: SearchedUserDetails[] = [];
    try {
        const searchedUsers = (await getUsers(query)).users;
        if (!!searchedUsers) {
            users = searchedUsers;
        }
    } catch (error) {
        console.error(`There was an error getting users ${error}`);
    }
    return (
        <div className="mx-[10px] sm:mx-[80px]">
            <FriendsSearch></FriendsSearch>
            <SearchedUsersList users={users}></SearchedUsersList>
        </div>
    )
}

export default Page;