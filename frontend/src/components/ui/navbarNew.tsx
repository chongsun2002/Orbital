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
import ProfileDisplay from "@/components/User/ProfileDisplay";
import Link from "next/link";
import { Logo } from "./logo"
import LogoutButton from "../Auth/LogoutButton";
import { Button } from "./button";

const NavbarNew = ({user}: {user: {id: string, name: string, image: string}}) => {
    return (
        <NavigationMenu className='w-full'>
            <div className='w-full'>      
            <NavigationMenuList className='flex flex-row flex-nowrap w-full items-center justify-between px-[81px] py-8 shadow-lg bg-gradient-to-t
                from-blue-100 text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold gap-[48px]'>
                <Logo />

                <div className='flex justify-end items-center gap-[48px] text-black font-sans text-xl/[30px] font-[400px] tracking-[-.01em] font-semibold'>
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

            { user.id === '' 
                ? <Button className="rounded-3xl" asChild>
                      <Link href="/login" className='font-sans text-[18px] font-[400px] tracking-[-.01em]'>Sign In</Link>
                  </Button> 
                :
                <NavigationMenuItem>
                    <NavigationMenuTrigger className='bg-inherit'>
                        <ProfileDisplay className='font-semibold text-base' name={user.name} image={user.image} />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
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