"use client"

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, ShoppingBag, Sparkles, Zap, Info } from 'lucide-react'

export default function Navigation() {
    const pathname = usePathname()

    return (
        <nav className="hidden md:flex items-center space-x-8">
            <Tabs defaultValue={pathname === "/" ? "home" : pathname === "/products" ? "shop" : pathname === "/new-arrivals" ? "new" : pathname === "/deals" ? "deals" : pathname === "/about" ? "about" : "home"} className="hidden md:flex">
                <TabsList>
                    <TabsTrigger value="home" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="shop" asChild>
                        <Link href="/products" className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Products
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="new" asChild>
                        <Link href="/new-arrivals" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            New Arrivals
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="deals" asChild>
                        <Link href="/deals" className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Deals
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="about" asChild>
                        <Link href="/about" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            About
                        </Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </nav>
    )
}
