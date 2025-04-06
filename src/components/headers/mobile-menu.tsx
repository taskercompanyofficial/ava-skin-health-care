"use client"

import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Search, Menu, Zap, Info, Sparkles, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'

export default function MobileMenu() {
    const [searchQuery, setSearchQuery] = useState("")
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [queryParam, setQueryParam] = useQueryState('q')
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches')
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches))
        }
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Save to recent searches
            const updatedSearches = [
                searchQuery,
                ...recentSearches.filter(s => s !== searchQuery)
            ].slice(0, 5)

            setRecentSearches(updatedSearches)
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))

            // Navigate to search results using nuqs
            setQueryParam(searchQuery)
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
            toast.success(`Searching for "${searchQuery}"`)
            setSearchQuery("")
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <nav className="flex flex-col space-y-4 p-4">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <Input
                            type="search"
                            placeholder={queryParam ? queryParam : "Search products..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full"
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </form>

                    <SheetClose asChild>
                        <Link
                            href="/"
                            className={`flex items-center gap-2 text-sm font-medium p-2 ${pathname === "/" ? "bg-primary/20" : "hover:bg-primary/10"} rounded-md transition-colors`}
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/products"
                            className={`flex items-center gap-2 text-sm font-medium p-2 ${pathname === "/products" ? "bg-primary/20" : "hover:bg-primary/10"} rounded-md transition-colors`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            All Products
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/new-arrivals"
                            className={`flex items-center gap-2 text-sm font-medium p-2 ${pathname === "/new-arrivals" ? "bg-primary/20" : "hover:bg-primary/10"} rounded-md transition-colors`}
                        >
                            <Sparkles className="h-4 w-4" />
                            New Arrivals
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/deals"
                            className={`flex items-center gap-2 text-sm font-medium p-2 ${pathname === "/deals" ? "bg-primary/20" : "hover:bg-primary/10"} rounded-md transition-colors`}
                        >
                            <Zap className="h-4 w-4" />
                            Deals
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link
                            href="/about"
                            className={`flex items-center gap-2 text-sm font-medium p-2 ${pathname === "/about" ? "bg-primary/20" : "hover:bg-primary/10"} rounded-md transition-colors`}
                        >
                            <Info className="h-4 w-4" />
                            About
                        </Link>
                    </SheetClose>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
