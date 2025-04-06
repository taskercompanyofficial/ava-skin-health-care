"use client";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
}

export function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cartItems')
            return saved ? JSON.parse(saved) : []
        }
        return []
    })

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)
    const [isOpen, setIsOpen] = useState(false)

    const updateQuantity = (id: string, change: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + change)
                if (newQuantity === 0) {
                    toast.success(`${item.name} removed from cart`)
                    return null
                }
                return { ...item, quantity: newQuantity }
            }
            return item
        }).filter(Boolean) as CartItem[])
    }

    const removeItem = (id: string) => {
        const itemToRemove = cartItems.find(item => item.id === id)
        setCartItems(prev => prev.filter(item => item.id !== id))
        if (itemToRemove) {
            toast.success(`${itemToRemove.name} removed from cart`)
        }
    }

    const handleCheckout = () => {
        toast.success("Proceeding to checkout...")
        setCartItems([])
        setIsOpen(false)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent">
                    <ShoppingCart className="h-4 w-4" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:max-w-[540px] overflow-y-auto">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <SheetTitle>Cart ({itemCount})</SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex flex-col gap-4 p-4">
                    {cartItems.length === 0 ? (
                        <div className="flex h-[400px] flex-col items-center justify-center gap-2">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                            <p className="font-medium">Your cart is empty</p>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <ShoppingCart className="h-6 w-6 text-muted-foreground/50" />
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">${item.price}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <SheetFooter className="border-t pt-4">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
