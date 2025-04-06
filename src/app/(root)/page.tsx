import { getProducts, Product } from '@/actions/products';
import { Hero } from '@/components/hero'
import ProductCard from '@/components/products/card';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import React from 'react'

export default async function page() {
    const products = await getProducts();
    return (
        <div>
            <Hero />
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                            Featured Products
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our most popular and trending products, handpicked for exceptional quality and value
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.data?.map((product: Product) => (
                        <div
                            key={product.id}
                            className="group hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="relative bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-xl">
                                <ProductCard {...product} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <Button size="lg" className="group bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300">
                        Explore All Products
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </section>
        </div>
    )
}
