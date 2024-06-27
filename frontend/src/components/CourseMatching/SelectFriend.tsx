import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Friend } from "@/lib/friendsActions";
  
const SelectFriend = ({onChange, friends}: {onChange: any, friends: Friend[]}) => {

    return(
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose friend" />
            </SelectTrigger>
            <SelectContent>
                {friends.map((friend) => friend.timetableUrl ? <SelectItem value={friend.timetableUrl}>{friend.name}</SelectItem> : <></>)}
            </SelectContent>
        </Select>    
    )
}

export default SelectFriend;