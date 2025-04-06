"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
export function ProductSkeleton() {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {
                [...Array(12)].map((_, i) => (
                    <Card key={i} className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full p-0">
                        <CardHeader className="p-0">
                            <Skeleton className="h-48 w-full rounded-t-lg" />
                        </CardHeader>
                        <CardContent className="p-4">
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-3 w-3 rounded-full" />
                                ))}
                            </div>
                            <Skeleton className="h-6 w-24 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                            <Skeleton className="h-9 w-full rounded-md" />
                            <Skeleton className="h-9 w-9 rounded-md" />
                        </CardFooter>
                    </Card>
                ))
            }
        </motion.div>
    )
}
