import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUploader from "@/components/ui/ImageUploader";
import ProfileDisplay from "@/components/User/ProfileDisplay";
import { Friend, getFriends } from "@/lib/friendsActions";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import ImageForm from "@/components/ui/ImageForm"

const Page = async () => {
    let friends: Friend[] | undefined; 
    try {
        friends = await getFriends();
        console.log(friends);
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
    const img_url = 'https://adventus-orbital.s3.ap-southeast-1.amazonaws.com/user-images/clw6rqbat0008fjx43bpss0tp';
    return (
        <div className='flex flex-col'>
            <div className='flex w-full justify-center'>
                <div className='font-sans text-xl'>Your Friends</div>
                { friends === undefined
                    ? <div>Could not get friends</div>
                    : <div>{friends.map((friend, index) => <ProfileDisplay key={index} name={friend.name} image={friend.image}/>)}</div>
                }
            </div>
            <div className='flex w-full justify-center'>Space for courses</div>
            <div><ImageForm/></div>
        </div>
    );
}

export default Page;