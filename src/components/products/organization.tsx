import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "@/components/custom/TagInput"
import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function Organization({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-4 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                    Add organization information for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                        value={form.data.category}
                        onValueChange={(value: string) => form.setData('category', value)}
                    >
                        <SelectTrigger className={`w-full ${form.errors.category ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Skin Care">Skin Care</SelectItem>
                            <SelectItem value="Hair Care">Hair Care</SelectItem>
                            <SelectItem value="Body Care">Body Care</SelectItem>
                            <SelectItem value="Makeup">Makeup</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.errors.category && (
                        <p className="text-sm text-red-500">{form.errors.category}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Sub Category</Label>
                    <Select
                        value={form.data.sub_category}
                        onValueChange={(value: string) => form.setData('sub_category', value)}
                    >
                        <SelectTrigger className={`w-full ${form.errors.sub_category ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cleansers">Cleansers</SelectItem>
                            <SelectItem value="Moisturizers">Moisturizers</SelectItem>
                            <SelectItem value="Serums">Serums</SelectItem>
                            <SelectItem value="Masks">Masks</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.errors.sub_category && (
                        <p className="text-sm text-red-500">{form.errors.sub_category}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <TagInput
                        value={form.data.tags}
                        onChange={(tags) => form.setData('tags', tags)}
                        placeholder="Add tags..."
                        className={form.errors.tags ? 'border-red-500' : ''}
                    />
                    {form.errors.tags && (
                        <p className="text-sm text-red-500">{form.errors.tags}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
