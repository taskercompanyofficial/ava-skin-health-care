import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}

export default function Pricing({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-4 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                    Add pricing information for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <LabelInputContainer
                    label="Regular Price"
                    type="number"
                    name="price"
                    value={form.data.price}
                    onChange={(e) => form.setData('price', e.target.value)}
                    placeholder="0.00"
                    required
                    className="rounded"
                    errorMessage={form.errors.price}
                />
                <LabelInputContainer
                    label="Cost Price"
                    type="number"
                    name="costPrice"
                    value={form.data.cost_price}
                    onChange={(e) => form.setData('cost_price', e.target.value)}
                    placeholder="0.00"
                    className="rounded"
                    errorMessage={form.errors.cost_price}
                />
                <LabelInputContainer
                    label="Wholesale Price"
                    type="number"
                    name="wholesale_price"
                    value={form.data.wholesale_price}
                    onChange={(e) => form.setData('wholesale_price', e.target.value)}
                    placeholder="0.00"
                    className="rounded"
                    errorMessage={form.errors.wholesale_price}
                />
                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer
                        label="Discount (%)"
                        type="number"
                        name="discount"
                        value={form.data.discount}
                        onChange={(e) => form.setData('discount', e.target.value)}
                        placeholder="0"
                        className="rounded"
                        errorMessage={form.errors.discount}
                    />
                    <LabelInputContainer
                        label="Tax Rate (%)"
                        type="number"
                        name="taxRate"
                        value={form.data.tax_rate}
                        onChange={(e) => form.setData('tax_rate', e.target.value)}
                        placeholder="0"
                        className="rounded"
                        errorMessage={form.errors.tax_rate}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
