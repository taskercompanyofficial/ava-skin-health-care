"use client"

import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Toggle } from '../ui/toggle';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

export default function Searchbar() {
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [queryParam, setQueryParam] = useQueryState('q')
    const router = useRouter()
    
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex relative group">
                    <Search className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Search</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 p-4" align="end">
                <Card className="border-none shadow-none">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Search Products</CardTitle>
                        <CardDescription>Find what you&apos;re looking for</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <div className="relative">
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
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>

                            {recentSearches.length > 0 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <div className="flex justify-between items-center">
                                        <DropdownMenuLabel>Recent Searches</DropdownMenuLabel>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setRecentSearches([]);
                                                localStorage.removeItem('recentSearches');
                                            }}
                                            className="h-8 text-xs"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((term) => (
                                            <Badge
                                                key={term}
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setSearchQuery(term);
                                                    setQueryParam(term);
                                                    router.push(`/search?q=${encodeURIComponent(term)}`);
                                                }}
                                            >
                                                {term}
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Popular Searches</DropdownMenuLabel>
                            <div className="flex flex-wrap gap-2">
                                {["Moisturizer", "Serum", "Sunscreen", "Deals"].map((tag) => (
                                    <Toggle
                                        key={tag}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSearchQuery(tag)}
                                    >
                                        {tag}
                                    </Toggle>
                                ))}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
