'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { db } from '@/lib/config.firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArrowLeft } from '@tabler/icons-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

interface Props {
    params: {
        slug: string;
    };
}

export default function UserForm({ params }: Props) {
    const isNew = params.slug === 'new';
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<User>({
        id: '',
        name: '',
        email: '',
        role: 'user',
        createdAt: {
            seconds: 0,
            nanoseconds: 0,
        },
    });
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (!isNew) {
                try {
                    const docRef = doc(db, 'users', params.slug);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUser({ id: docSnap.id, ...docSnap.data() } as User);
                    } else {
                        toast.error('User not found');
                        router.push('/admin/users');
                    }
                } catch {
                    toast.error('Failed to fetch user');
                    router.push('/admin/users');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, [isNew, params.slug, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            if (isNew) {
                // Create new user
                await addDoc(collection(db, 'users'), {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                toast.success('User created successfully');
            } else {
                // Update existing user
                const docRef = doc(db, 'users', user.id);
                await updateDoc(docRef, {
                    name: user.name,
                    role: user.role,
                    updatedAt: new Date(),
                });
                toast.success('User updated successfully');
            }
            router.push('/admin/users');
        } catch {
            toast.error(isNew ? 'Failed to create user' : 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/admin/users')}
                    className="mr-4"
                >
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">{isNew ? 'Create New User' : 'Edit User'}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isNew ? 'User Information' : `Editing ${user.name}`}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <Input
                                    id="name"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    disabled={!isNew}
                                    required
                                    className="w-full"
                                />
                                {!isNew && (
                                    <p className="text-sm text-gray-500">
                                        Email cannot be changed
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium">Role</label>
                                <Select
                                    value={user.role}
                                    onValueChange={(value: 'user' | 'admin') =>
                                        setUser({ ...user, role: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {!isNew && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Created At</label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                        {new Date(user.createdAt.seconds * 1000).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={saving} className="px-6">
                                {saving ? 'Saving...' : (isNew ? 'Create User' : 'Save Changes')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/users')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}