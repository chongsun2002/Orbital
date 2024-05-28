import { getUserId } from "@/lib/generalActions";
import { redirect } from "next/navigation";

const Page = async () => {
    const id = await getUserId();
    redirect('/user/' + id.id);
}

export default Page;