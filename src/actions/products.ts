'use server';
import { db } from '@/lib/config.firebase';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Helper function to convert Firestore doc to Product type
function convertToProduct(doc: QueryDocumentSnapshot<DocumentData>): Product {
    const data = doc.data();
    return {
        id: doc.id,
        slug: data.slug || '',
        name: data.name || '',
        sku: data.sku || '',
        barcode: data.barcode || '',
        description: data.description || '',
        short_description: data.short_description || '',
        price: Number(data.price) || 0,
        cost_price: Number(data.cost_price) || 0,
        wholesale_price: Number(data.wholesale_price) || 0,
        category: data.category || '',
        sub_category: data.sub_category || '',
        brand: data.brand || '',
        manufacturer: data.manufacturer || '',
        volume: Number(data.volume) || 0,
        weight: Number(data.weight) || 0,
        dimensions: data.dimensions || '',
        min_stock_level: Number(data.min_stock_level) || 0,
        max_stock_level: Number(data.max_stock_level) || 0,
        quantity: Number(data.quantity) || 0,
        discount: Number(data.discount) || 0,
        tax_rate: data.tax_rate || '',
        shipping_class: data.shipping_class || '',
        skin_type: data.skin_type || '',
        benefits: data.benefits || '',
        ingredients: data.ingredients || '',
        expiry_date: data.expiry_date || '',
        manufacturing_date: data.manufacturing_date || '',
        warranty: data.warranty || '',
        badge: data.badge || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        tags: data.tags || '',
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : []
    };
}

// Get all products
export async function getProducts(): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const products = productsSnapshot.docs.map(convertToProduct);
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: "Failed to fetch products" };
    }
}

// Get product statistics
export async function getProductStats() {
    try {
        const productsResult = await getProducts();
        if (!productsResult.success || !productsResult.data) {
            return { success: false, error: "Failed to fetch product stats" };
        }

        const products = productsResult.data;
        const stats = {
            total: products.length,
            lowStock: products.filter(p => p.quantity <= p.min_stock_level).length,
            outOfStock: products.filter(p => p.quantity === 0).length,
            withDiscount: products.filter(p => p.discount > 0).length
        };

        return { success: true, data: stats };
    } catch (error) {
        console.error('Error calculating product stats:', error);
        return { success: false, error: "Failed to calculate product stats" };
    }
}

// Get product growth data
export async function getProductGrowthData() {
    try {
        const productsResult = await getProducts();
        if (!productsResult.success || !productsResult.data) {
            return { success: false, error: "Failed to fetch product growth data" };
        }

        const products = productsResult.data;
        const monthlyData = products.reduce<Record<string, number>>((acc, product) => {
            if (product.manufacturing_date) {
                const month = new Date(product.manufacturing_date).toISOString().slice(0, 7);
                acc[month] = (acc[month] || 0) + 1;
            }
            return acc;
        }, {});

        return { success: true, data: monthlyData };
    } catch (error) {
        console.error('Error calculating growth data:', error);
        return { success: false, error: "Failed to calculate product growth data" };
    }
}

// Get single product by ID
export async function getProductById(productId: string): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);

        if (!productSnapshot.exists()) {
            return { success: false, error: "Product not found" };
        }

        const product = convertToProduct(productSnapshot as QueryDocumentSnapshot<DocumentData>);
        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: "Failed to fetch product" };
    }
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const product = productsSnapshot.docs
            .map(convertToProduct)
            .find(product => product.slug === slug);

        if (!product) {
            return { success: false, error: "Product not found" };
        }

        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return { success: false, error: "Failed to fetch product" };
    }
}

// Create new product
export async function createProduct(productData: Omit<Product, 'id'>): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, productData);
        const newProduct = { id: docRef.id, ...productData } as Product;
        
        revalidatePath('/admin/products');
        revalidatePath('/admin/states');
        
        return { success: true, data: newProduct };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: "Failed to create product" };
    }
}

// Update product
export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<{ success: boolean; error?: string }> {
    try {
        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);

        if (!productSnapshot.exists()) {
            return { success: false, error: "Product not found" };
        }

        await updateDoc(productDoc, productData);

        // Revalidate all relevant paths
        revalidatePath('/admin/products');
        revalidatePath('/admin/states');
        if (productData.slug) {
            revalidatePath(`/admin/products/${productData.slug}`);
            revalidatePath(`/products/${productData.slug}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: "Failed to update product" };
    }
}

// Delete product
export async function deleteProduct(idOrFormData: string | FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const productId = typeof idOrFormData === 'string' 
            ? idOrFormData 
            : idOrFormData.get('id') as string;

        if (!productId) {
            return { success: false, error: "No product ID provided" };
        }

        const productDoc = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDoc);
        
        if (!productSnapshot.exists()) {
            return { success: false, error: "Product not found" };
        }

        await deleteDoc(productDoc);
        revalidatePath('/admin/products');
        revalidatePath('/admin/states');

        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to delete product"
        };
    }
}

// Product type definition
export interface Product {
    id: string;
    slug: string;
    name: string;
    sku: string;
    barcode: string;
    description: string;
    short_description: string;
    price: number;
    cost_price: number;
    wholesale_price: number;
    category: string;
    sub_category: string;
    brand: string;
    manufacturer: string;
    volume: number;
    weight: number;
    dimensions: string;
    min_stock_level: number;
    max_stock_level: number;
    quantity: number;
    discount: number;
    tax_rate: string;
    shipping_class: string;
    skin_type: string;
    benefits: string;
    ingredients: string;
    expiry_date: string;
    manufacturing_date: string;
    warranty: string;
    badge: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    tags: string;
    images: string[];
    videos: string[];
}

export interface ProductFormErrors {
    [key: string]: string;
}
