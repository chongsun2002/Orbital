"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import NavProfileDisplay from "@/components/User/NavProfileDisplay";
import Link from "next/link";
import { Logo } from "./logo"
import LogoutButton from "../Auth/LogoutButton";
import { Button } from "./button";
import NavPopover from "./nav-popover";
import Mailbox from "../User/Mailbox";
import { Notification } from "@/lib/types/userTypes";

type NavbarProps = {
    user: {id: string, name: string, image: string};
    notifications: Notification[];
    viewNotification: (notificationId: string) => Promise<any>;
    deleteNotifications: (notificationIds: string[]) => Promise<any>;
}

const NavbarNew: React.FC<NavbarProps> = ({user, notifications, viewNotification, deleteNotifications}: NavbarProps) => {
    return (
        <NavigationMenu className='w-full'>
            <div className='w-full relative'>
                <NavigationMenuList className='flex flex-row flex-nowrap w-full items-center justify-between px-[20px] py-8 shadow-lg bg-gradient-to-t
                    from-blue-100 sm:px-[80px]'> 
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center sm:hidden">
                            <NavPopover/>
                        </div>
                        <Logo />
                    </div>

                    <div className='flex justify-end items-center text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold'>
                        <div className="hidden sm:flex gap-[48px] pr-[48px]">
                            <NavigationMenuItem>
                                <Link href='/course_matching' legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        Course Matching
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href='/friends' legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        Find Friends
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href='/activities' legacyBehavior passHref>
                                    <NavigationMenuLink>
                                        Join Activities
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </div>

                { user.id === '' 
                    ? <Button className="rounded-3xl" asChild>
                            <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                         </Button> 
                    :
                    <div className="flex flex-row items-center gap-[15px]">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent'>
                                <NavProfileDisplay className='font-semibold text-base' name={user.name} image={user.image} />
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="mt-2 absolute w-[100px] sm:w-full">
                                <ul className="flex flex-col gap-[12px] items-center w-full font-sans sm:w-[150px]">
                                    <li>
                                        <Link id='myProfile' href={'/user/'+user.id} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                My Profile
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link id='myFriends' href={'/user/'+user.id+'/friends'} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                My Friends
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link id='myActivities' href={'/user/'+user.id+'/activities'} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                My Activities
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li className='w-full'>
                                        <LogoutButton/>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="flex items-center">
                            <Mailbox notifications={notifications} viewNotification={viewNotification} deleteNotifications={deleteNotifications}/>
                        </NavigationMenuItem>
                    </div>
                }
                    </div>

                </NavigationMenuList>
            </div>
        </NavigationMenu>
    )
} 

export default NavbarNew;