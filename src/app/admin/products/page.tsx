import { getProducts, getProductStats, getProductGrowthData, deleteProduct } from '@/actions/products';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, PackagePlus, Edit } from "lucide-react";
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import DeleteDialog from '@/components/custom/delete-dialog';

export default async function ProductsPage() {
    const { data: products, success: productsSuccess, error: productsError } = await getProducts();
    const { data: stats, success: statsSuccess } = await getProductStats();
    const { data: growthData, success: growthSuccess } = await getProductGrowthData();

    if (!productsSuccess) {
        return (
            <div className="p-4">
                <div className="text-red-500">Error loading products: {productsError}</div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products Overview</h1>
                <Link
                    href="/admin/products/new"
                    className={buttonVariants({ variant: "default" })}
                >
                    <PackagePlus className="h-4 w-4 mr-2" />
                    Create New Product
                </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.total : 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.lowStock : 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products with Discount</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsSuccess ? stats?.withDiscount : 0}</div>
                    </CardContent>
                </Card>
            </div>

            {growthSuccess && growthData && Object.keys(growthData).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Product Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(growthData).map(([month, count]) => (
                                <div key={month} className="flex justify-between items-center">
                                    <span>{month}</span>
                                    <span>{count} products</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/products/${product.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <DeleteDialog 
                                            action={deleteProduct}
                                            title="Delete Product"
                                            description="Are you sure you want to delete this product?"
                                            id={product.id}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
