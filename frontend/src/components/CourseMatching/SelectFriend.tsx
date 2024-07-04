"use client"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

import { Friend } from "@/lib/friendsActions";
  
const SelectFriend = ({ onChange, friends, NUSModsURLs }: { onChange: (value: string) => void, friends: Friend[], NUSModsURLs: {name: string, url: string}[]}) => {
    const nusModsNamesSet = new Set(NUSModsURLs.map(item => item.name));

    return(
        <Command className='bg-gray-100 rounded-lg'>
            <CommandInput placeholder="Search for a friend..."/>
            <CommandList>
                <CommandEmpty>No results found. Your friend may not have added their NUSMods URL to their profile!</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    {friends
                        .map((friend) => friend.timetableUrl && !nusModsNamesSet.has(friend.name) 
                            ? <CommandItem 
                                key={friend.id}
                                value={JSON.stringify({name: friend.name, url: friend.timetableUrl})}
                                onSelect={onChange}
                                className="hover:bg-blue-100"
                                >{friend.name}</CommandItem> 
                            : null
                        )}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

        {/*<Select onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose friend" />
            </SelectTrigger>
            <SelectContent>
                {friends.map((friend) => friend.timetableUrl 
                    ? <SelectItem key={friend.id} value={"name="+friend.name+"&url="+encodeURIComponent(friend.timetableUrl)}>{friend.name}</SelectItem> 
                    : <></>)}
            </SelectContent>
        </Select>
        "name="+friend.name+"&url="+encodeURIComponent(friend.timetableUrl)*/}

export default SelectFriend;