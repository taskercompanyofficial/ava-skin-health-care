import Link from "next/link"
import UserDropDown from "./user-dropdown"
import Searchbar from "./search-bar";
import Navigation from "./navigation";
import MobileMenu from "./mobile-menu";
import { Suspense } from "react";

export default async function Header() {
    return (
        <header className={`sticky top-0 z-50 w-full border-b transition-all duration-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-4`}>
            <div className="container mx-auto flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-4 transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                            AVA Skin
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                            Healthcare & Beauty
                        </span>
                    </div>
                </Link>

                {/* Navigation - Desktop */}
                <Navigation />

                {/* Search and Actions */}
                <div className="flex items-center space-x-4">
                    <Suspense fallback={<div className="w-40 h-9 bg-gray-200 animate-pulse rounded-md"></div>}>
                        <Searchbar />
                    </Suspense>
                    <UserDropDown />
                    <Suspense fallback={<div className="w-10 h-10 bg-gray-200 animate-pulse rounded-md"></div>}>
                        <MobileMenu />
                    </Suspense>
                </div>
            </div>
        </header>
    )
}
