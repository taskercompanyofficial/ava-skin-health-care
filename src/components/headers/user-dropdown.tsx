"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserIcon, Settings, ShoppingBag, UserCircle, LayoutDashboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoutComponent from './logout';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import type { User } from 'firebase/auth';

export default function UserDropDown() {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setFirebaseUser(userData.firebaseUser);
                    setUserProfile(userData.profile);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-9 w-9 rounded-full bg-primary/20"></div>
            </div>
        );
    }

    return (
        firebaseUser ? (
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full hover:bg-primary/10 transition-all duration-200"
                            >
                                {firebaseUser.photoURL ? (
                                    <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                                        <AvatarImage src={firebaseUser.photoURL} alt={firebaseUser.displayName || "User"} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground font-medium">
                                            {firebaseUser.displayName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                                <span className="sr-only">Account</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary text-primary-foreground">
                        <p className="font-medium">{userProfile?.name || firebaseUser.displayName}</p>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden rounded-xl border border-primary/10">
                    <Card className="border-none shadow-none p-0 m-0">
                        <CardContent className="p-0 m-0">
                            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    {firebaseUser.photoURL ? (
                                        <Avatar className="h-12 w-12 border-2 border-background/80 shadow-md">
                                            <AvatarImage src={firebaseUser.photoURL} alt={userProfile?.name || firebaseUser.displayName || "User"} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground font-medium">
                                                {(userProfile?.name || firebaseUser.displayName)?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground shadow-md">
                                            <UserIcon className="h-6 w-6" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg">{userProfile?.name || firebaseUser.displayName}</span>
                                        <span className="text-xs text-muted-foreground">{userProfile?.email || firebaseUser.email}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground bg-background/50 rounded-md px-2 py-1 inline-flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                                    Active now
                                </div>
                            </div>
                            <nav className="p-2">
                                {userProfile?.role === 'admin' && (
                                    <DropdownMenuItem asChild className="flex items-center py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors">
                                        <Link href="/admin" className="w-full">
                                            <LayoutDashboard className="h-4 w-4 mr-2 text-primary/80" />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="flex items-center py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors">
                                    <Link href="/profile" className="w-full">
                                        <UserCircle className="h-4 w-4 mr-2 text-primary/80" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex items-center py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors">
                                    <Link href="/orders" className="w-full">
                                        <ShoppingBag className="h-4 w-4 mr-2 text-primary/80" />
                                        <span>Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex items-center py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-colors">
                                    <Link href="/settings" className="w-full">
                                        <Settings className="h-4 w-4 mr-2 text-primary/80" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 bg-primary/10" />
                                <DropdownMenuItem asChild>
                                    <LogoutComponent />
                                </DropdownMenuItem>
                            </nav>
                        </CardContent>
                    </Card>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full px-4 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                        >
                            <UserIcon className="h-4 w-4 mr-2 text-primary/70" />
                            <span className="font-medium">Login</span>
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-primary text-primary-foreground">
                    Sign in to your account
                </TooltipContent>
            </Tooltip>
        )
    );
}
