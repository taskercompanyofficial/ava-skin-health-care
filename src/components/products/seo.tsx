import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { LabelInputContainer } from '@/components/custom/LabelInputContainer'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '@/components/custom/TagInput'
import { Product, ProductFormErrors } from '@/actions/products'
interface Form {
    data: Product
    errors: ProductFormErrors
    setData: (key: keyof Product, value: string) => void
}
export default function Seo({ form }: { form: Form }) {
    return (
        <Card className="col-span-12 md:col-span-6 bg-white border shadow-sm">
            <CardHeader className="">
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                    Add SEO information for your product
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <LabelInputContainer
                    label="Meta Title"
                    name="meta_title"
                    value={form.data.meta_title}
                    onChange={(e) => form.setData('meta_title', e.target.value)}
                    placeholder="SEO title (50-60 characters)"
                    className="rounded"
                    errorMessage={form.errors.metaTitle}
                />

                <Textarea
                    name="meta_description"
                    value={form.data.meta_description}
                    onChange={(e) => form.setData('meta_description', e.target.value)}
                    rows={2}
                    placeholder="SEO description (150-160 characters max)"
                    className="rounded"
                />


                {form.errors.metaDescription && (
                    <p className="text-sm text-red-500">{form.errors.metaDescription}</p>
                )}
                <TagInput
                    value={form.data.meta_keywords}
                    onChange={(e) => form.setData('meta_keywords', e)}
                    placeholder="SEO keywords (10-15 words)"
                    className="rounded"
                />
            </CardContent>
        </Card>
    )
}
