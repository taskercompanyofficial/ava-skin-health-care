"use client"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Phone, Mail, MapPin, Clock, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'

const contactInfo = [
    { icon: Phone, text: "+92 303-095-9792" },
    { icon: Mail, text: "support@avaskinhealthcare.com" },
    { icon: MapPin, text: "Kohe Noor Plaza office No-3 FSD" },
    { icon: Clock, text: "Mon-Fri: 9AM-6PM EST" }
]

const quickLinks = [
    { href: "/products", text: "Products" },
    { href: "/about", text: "About" },
    { href: "/contact", text: "Contact" },
    { href: "/blog", text: "Blog" },
    { href: "/careers", text: "Careers" },
    { href: "/press", text: "Press & Media" },
    { href: "/partners", text: "Partner With Us" }
]

const customerServiceLinks = [
    { href: "/shipping", text: "Shipping Information" },
    { href: "/returns", text: "Returns & Exchanges" },
    { href: "/faq", text: "FAQ" },
    { href: "/privacy", text: "Privacy Policy" },
    { href: "/terms", text: "Terms & Conditions" },
    { href: "/warranty", text: "Warranty Information" },
    { href: "/track-order", text: "Track Your Order" }
]

const socialLinks = [
    { href: "https://facebook.com", Icon: Facebook },
    { href: "https://instagram.com", Icon: Instagram },
    { href: "https://twitter.com", Icon: Twitter },
    { href: "https://youtube.com", Icon: Youtube },
    { href: "https://linkedin.com", Icon: Linkedin }
]

export function Footer() {
    const [showScrollButton, setShowScrollButton] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 200
            setShowScrollButton(window.scrollY > scrollThreshold)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter submission
    }

    return (
        <footer className="border-t relative">
            <Button
                variant="outline"
                size="icon"
                className={`fixed bottom-4 right-4 rounded-none transition-all duration-300 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 shadow-lg hover:shadow-primary/20 ${
                    showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <ArrowUp className="h-4 w-4 text-primary" />
            </Button>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-4">About Us</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            We offer the best products with exceptional quality and service. Your satisfaction is our top priority. With over 10 years of experience, we&apos;ve served more than 100,000 happy customers worldwide.
                        </p>
                        <div className="space-y-2">
                            {contactInfo.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Icon className="h-4 w-4" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(({ href, text }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            {customerServiceLinks.map(({ href, text }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            {socialLinks.map(({ href, Icon }) => (
                                <Link 
                                    key={href}
                                    href={href} 
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">Newsletter</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                            </p>
                            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1"
                                    required
                                />
                                <Button
                                    type="submit"
                                    variant="default"
                                >
                                    Subscribe
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground mt-2">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} avaskinhealthcare. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <img src="/HD/secure.png" alt="Payment methods" className="h-6" />
                            <p className="text-xs text-muted-foreground">
                                Secure payments method is cash on delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
