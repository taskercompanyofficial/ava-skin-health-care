import { getProducts } from '@/actions/products';
import { Hero } from '@/components/hero'
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import { ProductSkeleton } from '@/skeletons/product-skeleton';
import ProductsCardGrid from '@/components/products/prducts-card';

export default async function page() {
    try {
        const products = await getProducts();
        if (!products.success) {
            throw new Error(products.error || 'Failed to fetch products');
        }

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
                    <Suspense fallback={<ProductSkeleton />}>
                        <ProductsCardGrid products={products.data || []} />
                    </Suspense>

                    <div className="mt-16 flex justify-center">
                        <Button size="lg" className="group bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300">
                            Explore All Products
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </section>
            </div>
        )
    } catch (error) {
        console.error('Error loading products:', error);
        return (
            <div className="text-center py-20">
                <p className="text-red-500">Failed to load products. Please try again later.</p>
            </div>
        );
    }
}
