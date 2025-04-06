"use client"
import React from 'react'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { logoutUser } from '@/lib/auth'
import { LogOut } from 'lucide-react';

export default function LogoutComponent() {
    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer flex items-center py-2.5 px-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full"
            >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>This action will logout you from the system.</AlertDialogDescription>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    )
}
