import { Footer } from '@/components/footer'
import Announcment from '@/components/headers/announcment'
import Header from '@/components/headers/header'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <><Announcment />
            <Header />
            {children}
            <Footer />
        </>
    )
}
