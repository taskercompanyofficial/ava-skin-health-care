"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, signInWithGoogle } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { LabelInputContainer } from "@/components/custom/LabelInputContainer"
import SubmitBtn from "@/components/custom/submit-button"
import { loginSchema, type LoginFormData } from '@/validations/auth-validation'
import { z } from 'zod'

export default function LoginComponent() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter()

    const validateField = (field: keyof LoginFormData, value: string) => {
        try {
            const fieldSchema = z.object({ [field]: loginSchema.shape[field] })
            fieldSchema.parse({ [field]: value })
            // Clear error if validation passes
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldError = error.errors.find(err => err.path.includes(field))
                if (fieldError) {
                    setErrors(prev => ({ ...prev, [field]: fieldError.message }))
                }
            }
        }
    }

    const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, [field]: value }))
        validateField(field, value)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        try {
            loginSchema.parse(formData)
            setLoading(true)

            await loginUser(formData.email, formData.password)
            router.push('/')
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof LoginFormData, string>> = {}
                err.errors.forEach(error => {
                    const field = error.path[0] as keyof LoginFormData
                    newErrors[field] = error.message
                })
                setErrors(newErrors)
            } else if (err instanceof Error) {
                setErrors({ email: err.message })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setErrors({})
        setLoading(true)

        try {
            await signInWithGoogle()
            router.push('/')
        } catch (error: any) {
            setErrors({ email: error.message || 'Failed to login with Google' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative flex justify-center items-center">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2000"
                    alt="Background"
                    fill
                    className="object-cover opacity-10"
                />
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded py-2 px-4 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </motion.div>
                        {Object.values(errors).length > 0 && (
                            <div className="p-3 bg-red-100 text-red-700 rounded">
                                {Object.values(errors)[0]}
                            </div>
                        )}
                        <motion.div
                            className="space-y-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <LabelInputContainer
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                errorMessage={errors.email}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="space-y-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <LabelInputContainer
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange('password')}
                                errorMessage={errors.password}
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="flex items-center justify-between"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Label className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox
                                    name="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) =>
                                        setRememberMe(checked as boolean)
                                    }
                                />
                                Remember me
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <SubmitBtn
                                processing={loading}
                                className="w-full"
                                effect="shine"
                            >
                                Sign In
                            </SubmitBtn>
                        </motion.div>
                    </CardContent>
                    <CardFooter>
                        <motion.p
                            className="w-full text-sm text-center text-muted-foreground"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-primary hover:underline transition-colors font-medium"
                            >
                                Sign up
                            </Link>
                        </motion.p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
