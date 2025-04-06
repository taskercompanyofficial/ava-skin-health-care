'use client'
import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function Announcment() {
    const slides = [
        {
            id: 1,
            title: '🎉 Special Offer! 25% Off All Services',
            description: 'Limited time discount on all health packages',
        },
        {
            id: 2,
            title: '⭐ New Wellness Program Launching Soon!',
            description: 'Join our holistic health journey',
        },
        {
            id: 3,
            title: '🎯 Free Health Assessment This Week',
            description: 'Book your complimentary consultation today',
        },
        {
            id: 4,
            title: '💪 Join Our Community Challenge',
            description: 'Transform your health with our 30-day program',
        },
    ]

    return (
        <div className='h-10 bg-primary text-white flex items-center justify-between px-4'>
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                    duration: 20,
                    dragFree: false,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id} className="flex items-center justify-center">
                            <a href="#" className="text-sm text-center hover:underline leading-relaxed transition-all duration-300 ">{slide.title}</a>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="h-4 w-4 absolute left-0 border-0 bg-transparent hover:bg-transparent hover:text-white hover:cursor-pointer" />
                <CarouselNext className="h-4 w-4 absolute right-0 border-0 bg-transparent hover:bg-transparent hover:text-white hover:cursor-pointer" />
            </Carousel>
        </div>
    )
}
