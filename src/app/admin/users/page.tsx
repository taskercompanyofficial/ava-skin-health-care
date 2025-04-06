import { getUsers, getUserStats, getUserGrowthData, deleteUser } from '@/actions/users';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconUserPlus, IconUserCheck, IconEdit } from "@tabler/icons-react";
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import DeleteDialog from '@/components/custom/delete-dialog';
export default async function UsersPage() {
    const { data: users, success: usersSuccess, error: usersError } = await getUsers();
    const { data: stats, success: statsSuccess } = await getUserStats();
    const { data: growthData, success: growthSuccess } = await getUserGrowthData();

    if (!usersSuccess) {
        return (
            <div className="p-4">
                <div className="text-red-500">Error loading users: {usersError}</div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users Overview</h1>
                <Link
                    href="/admin/users/new"
                    className={buttonVariants({ variant: "default" })}
                >
                    <IconUserPlus className="h-4 w-4 mr-2" />
                    Create New User
                </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.totalUsers : 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <IconUserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.activeUsers : 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
                        <IconUserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.newUsersThisMonth : 0}</div>
                    </CardContent>
                </Card>
            </div>

            {growthSuccess && growthData && growthData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {growthData?.map((data) => (
                                <div key={data.month} className="flex justify-between items-center">
                                    <span>{data.month}</span>
                                    <span>{data.users} users</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name || '-'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.createdAt.seconds * 1000).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    timeZone: 'UTC'
                                })}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/users/${user.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                                            <IconEdit className="h-4 w-4" />
                                        </Link>
                                        <DeleteDialog 
                                            action={deleteUser} 
                                            title="Delete User" 
                                            description="Are you sure you want to delete this user?" 
                                            id={user.id}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
