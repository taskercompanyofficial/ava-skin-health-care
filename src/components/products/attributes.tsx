import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/custom/TagInput"

import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function Attributes({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-4 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Product Attributes</CardTitle>
                <CardDescription>
                    Add product attributes for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label>Skin Type</Label>
                    <TagInput
                        value={form.data.skin_type}
                        onChange={(skin_types) => form.setData('skin_type', skin_types)}
                        placeholder="Dry, Oily, Combination..."
                        className={form.errors.skinType ? 'border-red-500' : ''}
                    />
                    {form.errors.skinType && (
                        <p className="text-sm text-red-500">{form.errors.skinType}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Benefits</Label>
                    <TagInput
                        value={form.data.benefits}
                        onChange={(benefits) => form.setData('benefits', benefits)}
                        placeholder="Hydrating, Anti-aging..."
                        className={form.errors.benefits ? 'border-red-500' : ''}
                    />
                    {form.errors.benefits && (
                        <p className="text-sm text-red-500">{form.errors.benefits}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Ingredients</Label>
                    <TagInput
                        value={form.data.ingredients}
                        onChange={(ingredients) => form.setData('ingredients', ingredients)}
                        placeholder="Hyaluronic Acid, Vitamin C..."
                        className={form.errors.ingredients ? 'border-red-500' : ''}
                    />
                    {form.errors.ingredients && (
                        <p className="text-sm text-red-500">{form.errors.ingredients}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
