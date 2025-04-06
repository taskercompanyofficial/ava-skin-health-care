'use server';
import { db } from '@/lib/config.firebase';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUserAccount } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Get all users
export async function getUsers() {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users" + error };
    }
}

// Get user statistics
export async function getUserStats() {
    try {
        const { data: users, success } = await getUsers();

        if (!success || !users) {
            throw new Error("Failed to fetch users");
        }

        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.role === 'active').length;

        const currentDate = new Date();
        const newUsersThisMonth = users.filter(user => {
            const userDate = new Date(user.createdAt.seconds * 1000);
            return userDate.getMonth() === currentDate.getMonth() &&
                userDate.getFullYear() === currentDate.getFullYear();
        }).length;

        return {
            success: true,
            data: {
                totalUsers,
                activeUsers,
                newUsersThisMonth
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to calculate user statistics" };
    }
}

// Get user growth data for charts
export async function getUserGrowthData() {
    try {
        const { data: users, success } = await getUsers();

        if (!success || !users) {
            throw new Error("Failed to fetch users");
        }

        const usersByMonth = users.reduce((acc: Record<string, number>, user) => {
            const month = new Date(user.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const chartData = Object.entries(usersByMonth).map(([month, count]) => ({
            month,
            users: count,
        }));

        return {
            success: true,
            data: chartData
        };
    } catch (error) {
        return { success: false, error: "Failed to calculate user growth data" };
    }
}

// Get single user by ID
export async function getUserById(userId: string) {
    try {
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            return { success: false, error: "User not found" };
        }

        return {
            success: true,
            data: {
                id: userSnapshot.id,
                ...userSnapshot.data()
            } as User
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch user" };
    }
}

// Create new user
export async function createUser(userData: Omit<User, 'id'>) {
    try {
        const usersCollection = collection(db, 'users');
        const docRef = await addDoc(usersCollection, userData);
        return { success: true, data: { id: docRef.id, ...userData } as User };
    } catch (error) {
        return { success: false, error: "Failed to create user" };
    }
}

// Update user
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>) {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, userData);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update user" };
    }
}

// Delete user
export async function deleteUser(idOrFormData: string | FormData) {
    try {
        let userId: string;

        // Handle either string userId or FormData with id field
        if (typeof idOrFormData === 'string') {
            userId = idOrFormData;
        } else {
            // Extract user ID from FormData
            userId = idOrFormData.get('id') as string;
            if (!userId) {
                return { success: false, error: "No user ID provided" };
            }
        }

        // Use the deleteUserAccount function with adminMode
        await deleteUserAccount({ userId, adminMode: true });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return {
            success: false, error: typeof error === 'string'
                ? error
                : error instanceof Error
                    ? error.message
                    : "Failed to delete user"
        };
    }
}
