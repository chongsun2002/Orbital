import { SearchedUserDetails } from "./types/userTypes";
import { API_URL } from "./utils";

/**
 * Creates an activity on the backend with all the necessary details.
 *
 * @param search - input of the user into the search field.
 * @param pageNum - number of the page of activities that the user has navigated to.
 * @param category - category the user has selected.
 * @param date - date the user has selected.
 * @param location - location the user has selected.
 * @returns A promise of CreatedActivityDetails.
 */
export async function getUsers(search: string): Promise<{ users: SearchedUserDetails[] }> {
    const params = new URLSearchParams({
        search: search,
    });
    const url = new URL('api/v1/user/search', API_URL);
    url.search = params.toString();
    const response: Response = await fetch(url.toString(), {
        method: 'GET',
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error("Could not reach server");
    }
    return response.json();
}