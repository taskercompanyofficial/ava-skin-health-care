"use client"
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Heart, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge'
import { Tooltip } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Product } from '@/actions/products'


export default function ProductCard({
    id,
    name,
    price,
    images,
    slug,
    description,
    discount = 0,
    quantity,
    expiry_date = '',
    badge = ''
}: Product) {
    const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleAddToCart = () => {
        console.log('Add to cart:', id);
    };

    // Generate star rating display
    const renderStars = () => {
        const rating = 4.5;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`star-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            );
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(
                <div key="half-star" className="relative">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        }

        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star key={`empty-star-${i}`} className="h-3 w-3 text-gray-300" />
            );
        }

        return stars;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
            whileHover={{ scale: 1.02 }}
        >
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full p-0">
                <CardHeader className="p-0 relative">
                    <div
                        className="relative h-48 w-full"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {images && images.length > 0 ? (
                            <div className="h-full w-full overflow-hidden rounded-lg relative">
                                <Image
                                    src={isHovered && images[1] ? images[1] : images[0]}
                                    alt={name}
                                    fill
                                    className="object-contain hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                    onError={(e) => {
                                        // Handle image loading errors
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite error loops
                                        target.src = '/placeholder-image.jpg'; // Fallback image
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {/* Show out of stock overlay if product is not available */}
                                {quantity <= 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white font-medium px-3 py-1 bg-red-500 rounded-md text-sm">
                                            Out Of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg ${isFavorite ? 'text-red-500' : ''}`}
                            onClick={() => setIsFavorite(!isFavorite)}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </motion.button>
                        <div className="absolute top-2 left-2 flex gap-2">
                            {discount > 0 && (
                                <Badge className="bg-red-500/90 backdrop-blur-sm text-xs">
                                    Save {discount}%
                                </Badge>
                            )}
                            {badge && (
                                <Badge className="bg-primary/90 backdrop-blur-sm text-xs">
                                    {badge}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="py-4 px-6">
                    <div className="flex items-center justify-between mb-2">
                        <Tooltip>
                            <Link href={`/products/${slug}`}>
                                <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">
                                    {name}
                                </h3>
                            </Link>
                        </Tooltip>
                    </div>
                    <Tooltip>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 hover:text-foreground transition-colors">
                            {description}
                        </p>
                    </Tooltip>
                    {expiry_date && (
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Expires: {expiry_date}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            {discount > 0 ? (
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm text-primary">RS: {discountedPrice.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground line-through">RS: {price.toFixed(2)}</p>
                                </div>
                            ) : (
                                <p className="font-bold text-sm text-primary">RS: {price.toFixed(2)}</p>
                            )}
                        </div>
                        <Badge
                            variant={quantity > 0 ? "default" : "secondary"}
                            className={`capitalize text-xs ${quantity > 0 ? 'bg-green-500/80' : 'bg-red-500/80'}`}
                        >
                            {quantity > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            {renderStars()}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button
                        variant="outline"
                        className="w-1/2 text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        disabled={quantity <= 0}
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add to Cart
                    </Button>
                    <Button
                        className="w-1/2 text-xs h-8 bg-primary hover:bg-primary/90 transition-colors"
                        disabled={quantity <= 0}
                        onClick={() => console.log('Buy now:', id)}
                        aria-label="Buy now"
                    >
                        Buy Now
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
