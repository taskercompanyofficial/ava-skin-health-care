import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Product, ProductFormErrors } from '@/actions/products'

interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function Inventory({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-4 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                    Add inventory information for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">

                <LabelInputContainer
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={form.data.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('quantity', e.target.value)}
                    placeholder="0"
                    className="rounded"
                    errorMessage={form.errors.quantity}
                />
                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer
                        label="Minimum Stock"
                        type="number"
                        name="min_stock_level"
                        value={form.data.min_stock_level}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('min_stock_level', e.target.value)}
                        placeholder="5"
                        className="rounded"
                        errorMessage={form.errors.min_stock_level}
                    />
                    <LabelInputContainer
                        label="Maximum Stock"
                        type="number"
                        name="max_stock_level"
                        value={form.data.max_stock_level}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('max_stock_level', e.target.value)}
                        placeholder="100"
                        className="rounded"
                        errorMessage={form.errors.max_stock_level}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
