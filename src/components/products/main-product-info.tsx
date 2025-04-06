import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Textarea } from '@/components/ui/textarea'
import { Product, ProductFormErrors } from '@/actions/products'

interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function MainProductInfo({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-8 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                    This section is for basic information about the product.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <LabelInputContainer
                    label="Product Name"
                    name="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    required
                    placeholder="Enter product name"
                    errorMessage={form.errors.name}
                    className="rounded"
                    autoFocus
                />

                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer
                        label="SKU"
                        name="sku"
                        value={form.data.sku}
                        onChange={(e) => form.setData('sku', e.target.value)}
                        placeholder="SKU-12345"
                        required
                        className="rounded"
                        errorMessage={form.errors.sku}
                    />
                    <LabelInputContainer
                        label="Barcode"
                        name="barcode"
                        value={form.data.barcode}
                        onChange={(e) => form.setData('barcode', e.target.value)}
                        placeholder="123456789012"
                        className="rounded"
                        errorMessage={form.errors.barcode}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer
                        label="Brand"
                        name="brand"
                        value={form.data.brand}
                        onChange={(e) => form.setData('brand', e.target.value)}
                        placeholder="Enter brand name"
                        className="rounded"
                        errorMessage={form.errors.brand}
                    />
                    <LabelInputContainer
                        label="Manufacturer"
                        name="manufacturer"
                        value={form.data.manufacturer}
                        onChange={(e) => form.setData('manufacturer', e.target.value)}
                        placeholder="Enter manufacturer"
                        className="rounded"
                        errorMessage={form.errors.manufacturer}
                    />
                </div>
                <LabelInputContainer
                    label="Short Description"
                    name="short_description"
                    value={form.data.short_description}
                    onChange={(e) => form.setData('short_description', e.target.value)}
                    placeholder="Brief product description (appears in listings)..."
                    className="rounded"
                    errorMessage={form.errors.short_description}
                />
                <Textarea
                    name="description"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    required
                    rows={4}
                    placeholder="Detailed product description..."
                    className="rounded"
                />

            </CardContent>
        </Card>
    )
}
