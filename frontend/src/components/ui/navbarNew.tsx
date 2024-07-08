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

const NavbarNew = ({user}: {user: {id: string, name: string, image: string}}) => {
    return (
        <NavigationMenu className='w-full'>
            <div className='w-full'>
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
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='bg-transparent hover:bg-inherit'>
                            <NavProfileDisplay className='font-semibold text-base' name={user.name} image={user.image} />
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="-mt-6">
                            <ul className="flex flex-col gap-[12px] items-center w-full font-sans">
                                <li>
                                    <Link href={'/user/'+user.id} legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            My Profile
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/user/'+user.id+'/friends'} legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            My Friends
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/user/'+user.id+'/activities'} legacyBehavior passHref>
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
                }
                    </div>

                </NavigationMenuList>
            </div>
        </NavigationMenu>
    )
} 

export default NavbarNew;