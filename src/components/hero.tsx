"use client"
import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './ui/carousel';
import { Loader } from 'lucide-react'

const heroImages = [
    {
        id: 1,
        image: 'https://firebasestorage.googleapis.com/v0/b/ava-skin-healthcare.firebasestorage.app/o/d506ed33-bd20-4079-8747-e2268966a089.jpg?alt=media&token=01337e3b-05cd-4d2d-878c-ef73e8c65e87',
        title: 'Premium Skincare Collection',
        subtitle: 'Discover our luxurious range of medical-grade skincare products',
        cta: 'Shop Skincare',
        link: '/collections/skincare',
        categories: ['Anti-aging', 'Brightening', 'Hydration']
    },
    {
        id: 2,
        image: 'https://firebasestorage.googleapis.com/v0/b/ava-skin-healthcare.firebasestorage.app/o/f733f6ad-cb63-49b3-b4f8-8f15698ea793.jpg?alt=media&token=986b40b7-a1f7-4fc2-b5f1-e3d1bba1cfac',
        title: 'Medical Creams',
        subtitle: 'Professional-grade treatments for various skin conditions',
        cta: 'View Products',
        link: '/medical-creams',
        categories: ['Acne Treatment', 'Eczema Relief', 'Scar Healing']
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Whitening Solutions',
        subtitle: 'Safe and effective skin brightening treatments',
        cta: 'Learn More',
        link: '/whitening',
        categories: ['Face', 'Body', 'Specialized']
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Luxury Lotions',
        subtitle: 'Nourishing body care for all skin types',
        cta: 'Explore Range',
        link: '/lotions',
        categories: ['Body Butter', 'Hand Cream', 'Moisturizer']
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Medical Creams',
        subtitle: 'Professional-grade treatments for various skin conditions',
        cta: 'View Products',
        link: '/medical-creams',
        categories: ['Acne Treatment', 'Eczema Relief', 'Scar Healing']
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Whitening',
        subtitle: 'Safe and effective skin brightening treatments',
        cta: 'Learn More',
        link: '/whitening',
        categories: ['Face', 'Body', 'Specialized']
    },
    {
        id: 7,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Anti-Aging Collection',
        subtitle: 'Turn back time with our premium anti-aging formulas',
        cta: 'Explore Collection',
        link: '/anti-aging',
        categories: ['Serums', 'Creams', 'Eye Care']
    },
    {
        id: 8,
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Sun Protection',
        subtitle: 'Shield your skin from harmful UV rays',
        cta: 'Shop Now',
        link: '/sun-protection',
        categories: ['SPF 30+', 'SPF 50+', 'After Sun']
    },
    {
        id: 9,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Natural Products',
        subtitle: 'Organic and natural skincare solutions',
        cta: 'Discover Range',
        link: '/natural',
        categories: ['Organic', 'Vegan', 'Cruelty-Free']
    },
    {
        id: 10,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Facial Treatments',
        subtitle: 'Professional facial care products for home use',
        cta: 'View Treatments',
        link: '/facial',
        categories: ['Masks', 'Exfoliants', 'Toners']
    },
    {
        id: 11,
        image: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Acne Solutions',
        subtitle: 'Targeted treatments for clear, healthy skin',
        cta: 'Shop Solutions',
        link: '/acne-solutions',
        categories: ['Cleansers', 'Spot Treatments', 'Kits']
    },
    {
        id: 12,
        image: 'https://images.unsplash.com/photo-1614859324967-1ce3966dc863?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Sensitive Skin',
        subtitle: 'Gentle formulations for sensitive skin types',
        cta: 'Explore Products',
        link: '/sensitive-skin',
        categories: ['Hypoallergenic', 'Fragrance-Free', 'Soothing']
    },
    {
        id: 13,
        image: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Luxury Skincare',
        subtitle: 'Premium ingredients for exceptional results',
        cta: 'Discover Luxury',
        link: '/luxury',
        categories: ['Premium', 'Gift Sets', 'Exclusive']
    },
    {
        id: 14,
        image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        title: 'Men\'s Collection',
        subtitle: 'Specialized skincare designed for men',
        cta: 'Shop Men\'s',
        link: '/mens',
        categories: ['Shaving', 'Moisturizers', 'Cleansers']
    }
]

export function Hero() {
    const [isLoading, setIsLoading] = useState(true)
    const [api, setApi] = useState<CarouselApi>()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = heroImages.map(slide => {
                return new Promise((resolve, reject) => {
                    const img = new Image()
                    img.src = slide.image
                    img.onload = resolve
                    img.onerror = reject
                })
            })

            try {
                await Promise.all(imagePromises)
                setIsLoading(false)
            } catch (error) {
                console.error('Error preloading images:', error)
                setIsLoading(false)
            }
        }

        preloadImages()
    }, [])

    // Setup autoplay
    useEffect(() => {
        if (!api || !api.canScrollNext()) return

        // Start autoplay
        intervalRef.current = setInterval(() => {
            api.scrollNext()
        }, 5000) // Change slide every 5 seconds

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [api])

    // Pause autoplay on hover/interaction
    const pauseAutoplay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }

    const resumeAutoplay = () => {
        pauseAutoplay()
        intervalRef.current = setInterval(() => {
            api?.scrollNext()
        }, 5000)
    }

    if (isLoading) {
        return (
            <div className="relative h-[700px] bg-muted flex items-center justify-center">
                <Loader className="animate-spin rounded-full h-12 w-12 " />
            </div>
        )
    }

    return (
        <div 
            className="relative h-[700px] overflow-hidden"
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
        >
            <Carousel
                className="h-full"
                setApi={setApi}
                opts={{
                    loop: true,
                    align: "start"
                }}
            >
                <CarouselContent>
                    {heroImages.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative h-[700px]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                    role="img"
                                    aria-label={slide.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative h-full container mx-auto px-4 flex items-center justify-between"
                                >
                                    <div className="max-w-2xl">
                                        <motion.h1
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-6xl font-bold text-white mb-4"
                                        >
                                            {slide.title}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-2xl text-white/90 mb-8"
                                        >
                                            {slide.subtitle}
                                        </motion.p>
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex flex-wrap gap-4 mb-8"
                                        >
                                            {slide.categories.map((category, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </motion.div>
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <Button
                                                size="lg"
                                                className="hover:scale-105 transition-transform text-lg px-8"
                                                asChild
                                            >
                                                <Link href={slide.link}>
                                                    {slide.cta}
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    </div>
                                    <div className="hidden lg:block">
                                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-[300px]">
                                            <h3 className="text-white text-xl font-semibold mb-4">Featured Categories</h3>
                                            <ul className="space-y-3">
                                                {slide.categories.map((category, idx) => (
                                                    <li key={idx} className="text-white/80 hover:text-white transition-colors">
                                                        <Link href={`/category/${category.toLowerCase()}`}>
                                                            → {category}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}