'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/config.firebase';
import { toast } from 'sonner';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MainProductInfo from "@/components/products/main-product-info";
import Pricing from "@/components/products/pricing";
import PhysicalProperties from "@/components/products/physical-properties";
import Inventory from "@/components/products/inventory";
import Organization from "@/components/products/organization";
import Attributes from "@/components/products/attributes";
import Seo from "@/components/products/seo";
import AdditionalInfo from "@/components/products/additional-info";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { X, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { createProduct, updateProduct } from '@/actions/products';
import type { Product } from '@/actions/products';
import SubmitBtn from '../custom/submit-button';

interface ProductFormErrors {
    [key: string]: string;
}

interface Props {
    product?: Product;
}

export default function ProductForm({ product }: Props) {
    const isNew = !product;
    const [errors, setErrors] = useState<ProductFormErrors>({});
    const [processing, setProcessing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<Product>({
        id: product?.id || '',
        name: product?.name || "",
        sku: product?.sku || "",
        barcode: product?.barcode || "",
        description: product?.description || "",
        short_description: product?.short_description || "",
        price: product?.price || 0,
        cost_price: product?.cost_price || 0,
        wholesale_price: product?.wholesale_price || 0,
        category: product?.category || "",
        sub_category: product?.sub_category || "",
        brand: product?.brand || "",
        manufacturer: product?.manufacturer || "",
        volume: product?.volume || 0,
        weight: product?.weight || 0,
        dimensions: product?.dimensions || "",
        min_stock_level: product?.min_stock_level || 0,
        max_stock_level: product?.max_stock_level || 0,
        quantity: product?.quantity || 0,
        discount: product?.discount || 0,
        tax_rate: product?.tax_rate || "",
        shipping_class: product?.shipping_class || "",
        skin_type: product?.skin_type || "",
        benefits: product?.benefits || "",
        ingredients: product?.ingredients || "",
        expiry_date: product?.expiry_date || "",
        manufacturing_date: product?.manufacturing_date || "",
        warranty: product?.warranty || "",
        badge: product?.badge || "",
        meta_title: product?.meta_title || "",
        meta_description: product?.meta_description || "",
        meta_keywords: product?.meta_keywords || "",
        tags: product?.tags || "",
        images: product?.images || [],
        videos: product?.videos || [],
        slug: product?.slug || "",
    });

    const router = useRouter();

    // Generate slug whenever product name changes
    useEffect(() => {
        if (formData.name) {
            const generatedSlug = formData.name.toLowerCase().replace(/\s+/g, '-');
            setFormData(prev => ({
                ...prev,
                slug: generatedSlug
            }));
        }
    }, [formData.name]);

    const setData = (key: string | number | symbol, value: string) => {
        // Handle number conversions
        const numberFields = ['price', 'cost_price', 'wholesale_price', 'volume', 'weight',
            'min_stock_level', 'max_stock_level', 'quantity', 'discount'];

        if (numberFields.includes(key as string)) {
            setFormData(prev => ({
                ...prev,
                [key]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [key]: value
            }));
        }

        // Clear any existing error for this field
        if (errors[key as string]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key as string];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: ProductFormErrors = {};

        // Required fields validation
        if (!formData.name) newErrors.name = 'Product name is required';
        if (!formData.sku) newErrors.sku = 'SKU is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.category) newErrors.category = 'Category is required';

        // Numeric validations
        if (formData.min_stock_level > formData.max_stock_level) {
            newErrors.min_stock_level = 'Minimum stock cannot exceed maximum stock';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !formData.name) {
            toast.error('Please select files and ensure product name is set');
            return;
        }

        setUploadingImage(true);
        const loadingToast = toast.loading('Uploading media files...');

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExtension = file.name.split('.').pop()?.toLowerCase();
                const isVideo = fileExtension === 'mp4' || fileExtension === 'webm';

                // Create a reference to the file in Firebase Storage
                const storageRef = ref(storage, `products/${formData.name}/${Date.now()}-${file.name}`);

                // Upload the file
                await uploadBytes(storageRef, file);

                // Get the download URL
                const downloadURL = await getDownloadURL(storageRef);

                // Update the form data with the new image/video URL
                if (isVideo) {
                    setFormData(prev => ({
                        ...prev,
                        videos: [...prev.videos, downloadURL]
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, downloadURL]
                    }));
                }

                toast.success(`Uploaded ${i + 1} of ${files.length} files`);
            }

            toast.success('All media uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload media');
        } finally {
            toast.dismiss(loadingToast);
            setUploadingImage(false);
            // Reset the input
            e.target.value = '';
        }
    };

    const removeMedia = (index: number, type: 'images' | 'videos') => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_: string, i: number) => i !== index)
        }));
        toast.success(`${type === 'images' ? 'Image' : 'Video'} removed successfully`);
    };

    const form = {
        data: formData,
        errors: errors,
        setData: setData,
        processing: processing
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setProcessing(true);
        const loadingToast = toast.loading(isNew ? 'Creating product...' : 'Updating product...');

        try {
            const productWithSlug = { ...formData };
            let response;

            if (isNew) {
                response = await createProduct(productWithSlug);
                if (response.success) {
                    toast.success('Product created successfully');
                }
            } else {
                response = await updateProduct(formData.id, productWithSlug);
                if (response.success) {
                    toast.success('Product updated successfully');
                }
            }

            if (response.success) {
                router.push('/admin/products');
            } else {
                toast.error(response.error || 'Failed to save product');
            }

        } catch (error: any) {
            toast.error(error.message || 'Failed to save product');
            console.error('Form submission error:', error);
        } finally {
            toast.dismiss(loadingToast);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{isNew ? 'Create New Product' : 'Edit Product'}</h1>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/products')}
                        type="button"
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <SubmitBtn
                        variant="default"
                        type="submit"
                        processing={processing}
                    >
                        Submit
                    </SubmitBtn>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <MainProductInfo form={form} />
                    <Pricing form={form} />

                    <Card className="col-span-12 md:col-span-6 bg-white border shadow-sm">
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>
                                Upload images and videos for your product
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {formData.name ? (
                                <>
                                    <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                                        <label className="flex flex-col items-center justify-center cursor-pointer">
                                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">
                                                {uploadingImage ? 'Uploading...' : 'Click to upload images or videos'}
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*,video/mp4,video/webm"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>

                                    {(formData.images.length > 0 || formData.videos.length > 0) && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Media</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {formData.images.map((image: string, index: number) => (
                                                    <div key={index} className="relative group bg-white rounded-lg shadow-sm overflow-hidden aspect-square">
                                                        <Image
                                                            src={image}
                                                            alt={`Product ${index + 1}`}
                                                            fill
                                                            className="object-cover transition-opacity group-hover:opacity-75"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder.jpg';
                                                                toast.error('Failed to load image');
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => removeMedia(index, 'images')}
                                                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                            disabled={processing}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {formData.videos.map((video: string, index: number) => (
                                                    <div key={index} className="relative group bg-white rounded-lg shadow-sm overflow-hidden aspect-square">
                                                        <video
                                                            src={video}
                                                            className="w-full h-full object-cover"
                                                            onError={() => toast.error('Failed to load video')}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => removeMedia(index, 'videos')}
                                                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                            disabled={processing}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 text-center h-full">
                                    <p className="text-gray-500">Please enter a product name before adding media</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <PhysicalProperties form={form} />
                    <Inventory form={form} />
                    <Organization form={form} />
                    <Attributes form={form} />
                    <Seo form={form} />
                    <AdditionalInfo form={form} />
                </div>
            </div>
        </form>
    );
}