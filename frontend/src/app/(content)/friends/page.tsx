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
    let users: SearchedUserDetails[] | undefined;
    try {
        users = (await getUsers(query)).users;
    } catch (error) {
        console.error(`There was an error getting users ${error}`);
    }
    if (users === undefined) {
        return (
            <div>Could not find any users.</div>
        )
    }
    return (
        <div>
            <FriendsSearch></FriendsSearch>
            <SearchedUsersList users={users}></SearchedUsersList>
        </div>
    )
}

export default Page;