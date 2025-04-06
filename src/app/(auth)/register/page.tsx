
import React from 'react'
import RegisterComponent from '@/components/auth/registerComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Register',
    description: 'Register to our website',
}

export default function RegisterPage() {
    return (
        <div>
            <RegisterComponent />
        </div>
    )
}
