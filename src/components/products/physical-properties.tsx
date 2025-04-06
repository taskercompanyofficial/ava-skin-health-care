import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}

export default function PhysicalProperties({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-6 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Physical Properties</CardTitle>
                <CardDescription>
                    Add physical properties for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <LabelInputContainer
                        label="Volume"
                        name="volume"
                        value={form.data.volume}
                        onChange={(e) => form.setData('volume', e.target.value)}
                        placeholder="100ml"
                        className="rounded"
                        errorMessage={form.errors.volume}
                    />
                    <LabelInputContainer
                        label="Weight"
                        name="weight"
                        value={form.data.weight}
                        onChange={(e) => form.setData('weight', e.target.value)}
                        placeholder="250g"
                        className="rounded"
                        errorMessage={form.errors.weight}
                    />
                    <LabelInputContainer
                        label="Dimensions"
                        name="dimensions"
                        value={form.data.dimensions}
                        onChange={(e) => form.setData('dimensions', e.target.value)}
                        placeholder="10x5x2 cm"
                        className="rounded"
                        errorMessage={form.errors.dimensions}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <LabelInputContainer
                        label="Manufacturing Date"
                        type="date"
                        name="manufacturingDate"
                        value={form.data.manufacturing_date}
                        onChange={(e) => form.setData('manufacturing_date', e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="rounded"
                        errorMessage={form.errors.manufacturing_date}
                    />
                    <LabelInputContainer
                        label="Expiry Date"
                        type="date"
                        name="expiry_date"
                        value={form.data.expiry_date}
                        onChange={(e) => form.setData('expiry_date', e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="rounded"
                        errorMessage={form.errors.expiry_date}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
