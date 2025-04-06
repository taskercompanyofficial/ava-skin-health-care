"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, deleteUserAccount } from '@/lib/auth';
import { User } from 'firebase/auth';
import { UserProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserIcon, Loader2, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData) {
                    setFirebaseUser(userData.firebaseUser);
                    setUserProfile(userData.profile);
                } else {
                    // Redirect to login if no user
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                toast.error("Failed to load user profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleDeleteAccount = async () => {
        if (!firebaseUser) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            // Check if user is using email/password auth
            const needsPassword = firebaseUser.providerData.some(
                provider => provider.providerId === 'password'
            );
            
            if (needsPassword && !password) {
                setDeleteError("Please enter your password to confirm deletion");
                setIsDeleting(false);
                return;
            }
            
            // Use the new options format
            await deleteUserAccount(needsPassword ? { password } : undefined);
            
            toast.success("Your account has been deleted");
            router.push('/');
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : "Failed to delete account");
            console.error("Error deleting account:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!firebaseUser || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
                    <p className="mb-6">Please log in to view your profile</p>
                    <Button onClick={() => router.push('/login')}>Go to Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
            
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>
                                Manage your personal information and account settings
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {firebaseUser.photoURL ? (
                                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                                        <AvatarImage src={firebaseUser.photoURL} alt={userProfile.name || firebaseUser.displayName || "User"} />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground">
                                            {(userProfile.name || firebaseUser.displayName)?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-primary-foreground">
                                        <UserIcon className="h-12 w-12" />
                                    </div>
                                )}
                                
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{userProfile.name || firebaseUser.displayName}</h3>
                                    <p className="text-muted-foreground">{userProfile.email || firebaseUser.email}</p>
                                    <div className="text-sm px-2 py-1 bg-primary/10 rounded-full inline-block mt-2">
                                        {userProfile.role === 'admin' ? 'Administrator' : 'User'}
                                    </div>
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </label>
                                    <Input 
                                        id="name" 
                                        value={userProfile.name || firebaseUser.displayName || ""}
                                        disabled
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <Input 
                                        id="email" 
                                        value={userProfile.email || firebaseUser.email || ""}
                                        disabled
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Security</CardTitle>
                            <CardDescription>
                                Manage your account security settings and delete your account
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <div className="border border-destructive/10 rounded-lg p-6 bg-destructive/5">
                                <h3 className="text-lg font-semibold flex items-center text-destructive mb-3">
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                    Delete Your Account
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete your account and all associated data. 
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        
                                        {firebaseUser.providerData.some(provider => provider.providerId === 'password') && (
                                            <div className="mb-4">
                                                <label htmlFor="password" className="text-sm font-medium block mb-2">
                                                    Enter your password to confirm
                                                </label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Your current password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        )}
                                        
                                        {deleteError && (
                                            <div className="text-sm text-destructive mb-4">
                                                {deleteError}
                                            </div>
                                        )}
                                        
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => {
                                                setPassword("");
                                                setDeleteError(null);
                                            }}>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent dialog from closing on error
                                                    handleDeleteAccount();
                                                }}
                                                disabled={isDeleting}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    "Delete Account"
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 