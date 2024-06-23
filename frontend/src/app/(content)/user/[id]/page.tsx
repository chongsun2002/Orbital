import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUploader from "@/components/ui/ImageUploader";
import ProfileDisplay from "@/components/User/ProfileDisplay";
import { Friend, getFriends, isFriend } from "@/lib/friendsActions";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import ImageForm from "@/components/ui/ImageForm"
import { getUserDetails, getUserId, UserDetails, userIsPublic } from "@/lib/generalActions";
import EditProfileForm from "@/components/User/EditProfileForm";
import OwnProfile from "@/components/User/OwnProfile";
import PublicProfile from "@/components/User/PublicProfile";
import { redirect } from "next/navigation";
import PrivateProfile from "@/components/User/PrivateProfile";

const Page = async ({params}: {params: {id: string}}) => {
    let friends: Friend[] | undefined; 
    try {
        friends = await getFriends();
    } catch (error) {
        friends = undefined;
    }
    

    const client = new S3Client({
        region: "ap-southeast-1",
        credentials: fromCognitoIdentityPool({
            clientConfig: { region: "ap-southeast-1" },
            identityPoolId: "ap-southeast-1:ed889a85-ab0f-42ed-bdf6-2f01b0949aaf"
        })
    });
//    const command = new GetObjectCommand({
//        Bucket: 'adventus-orbital',
//        Key: 'user-images/Untitled.jpg'
//    });
    var img;
    //try {
    //    const response = await client.send(command);
    //    const b = await response.Body?.transformToByteArray();
    //    if (img != undefined) {
    //        const buff: { ArrayBuffer: ArrayBuffer } = b?.buffer;
    //        const c = new Blob();
    //    }
    //} catch (error) {
    //    console.error(error);
    //}
    const id: string | undefined = await getUserId();
    if (id === undefined) {
        redirect('/login');
    }
    const user: UserDetails | null = await getUserDetails(params.id);
    if (user === null) {
        return (
            <div>404 User not found</div>
        )
    }
    const isFriends: Boolean = await isFriend(params.id);
    const isPublic: Boolean = await userIsPublic(params.id);
    return (
        <div className='flex flex-col'>
            { id === params.id
                ? <OwnProfile user={user}/>
                : isPublic || isFriends
                    ? <PublicProfile isFriends={isFriends} id={params.id} user={user}/>
                    : <PrivateProfile id={params.id} user={user} />
            }
        </div>
    );
}

export default Page;