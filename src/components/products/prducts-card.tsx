"use client"
import { Product } from '@/actions/products'
import React from 'react'
import ProductCard from './card'
import { motion } from 'framer-motion'

export default function ProductsCardGrid({ products }: { products: Product[] }) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {products?.map((product: Product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                >
                    <motion.div
                        className="relative bg-background rounded-2xl overflow-hidden"
                        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProductCard {...product} />
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>
    )
}
