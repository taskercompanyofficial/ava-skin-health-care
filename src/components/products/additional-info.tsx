import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function AdditionalInfo({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-6 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                    Add additional information for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <LabelInputContainer
                    label="Warranty"
                    name="warranty"
                    value={form.data.warranty}
                    onChange={(e) => form.setData('warranty', e.target.value)}
                    placeholder="1 year limited warranty"
                    className="rounded"
                />

                <LabelInputContainer
                    label="Badge"
                    name="badge"
                    value={form.data.badge}
                    onChange={(e) => form.setData('badge', e.target.value)}
                    placeholder="New, Featured, Sale"
                    className="rounded"
                />

                <LabelInputContainer
                    label="Shipping Class"
                    name="shipping_class"
                    value={form.data.shipping_class}
                    onChange={(e) => form.setData('shipping_class', e.target.value)}
                    placeholder="Standard, Express, Fragile"
                    className="rounded"
                />
            </CardContent>
        </Card>
    )
}
