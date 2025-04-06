import { getProductBySlug } from '@/actions/products'
import ProductsForm from '@/components/products/products-form'
import React from 'react'
interface ProductPageProps {
    params: Promise<{ slug: string }>
}


export default async function page({ params }: ProductPageProps) {
    const slug = await params
    if (slug.slug === 'new') {
        return (
            <div>
                <ProductsForm />
            </div>
        )
    }

    const { success, data } = await getProductBySlug(slug.slug)
    return (
        <div>
            <ProductsForm product={success ? data : undefined} />
        </div>
    )
}
