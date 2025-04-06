import LoginComponent from '@/components/auth/loginComponent'
import React from 'react'

export const metadata = {
    title: 'Login',
    description: 'Login to your account',
}

export default function page() {

    return (
        <LoginComponent />
    )
}
