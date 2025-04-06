"use client";

import React, { useState } from 'react';
import { registerUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LabelInputContainer } from '@/components/custom/LabelInputContainer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, Lock } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/validations/auth-validation';
import { z } from 'zod';

export default function RegisterComponent() {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateField = (field: keyof RegisterFormData, value: string) => {
        try {
            if (field === 'passwordConfirmation') {
                // For password confirmation, validate entire form to check matching
                registerSchema.parse({ ...formData, passwordConfirmation: value });
            } else {
                // For other fields, validate the entire form but only process errors for this field
                try {
                    registerSchema.parse({ ...formData, [field]: value });
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const fieldError = error.errors.find(err => err.path[0] === field);
                        if (fieldError) {
                            throw error;
                        }
                    }
                }
            }
            // Clear error if validation passes
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldError = error.errors.find(err => err.path.includes(field));
                if (fieldError) {
                    setErrors(prev => ({ ...prev, [field]: fieldError.message }));
                }
            }
        }
    };

    const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            registerSchema.parse(formData);
            setLoading(true);

            await registerUser(formData.name, formData.email, formData.password);
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
                err.errors.forEach(error => {
                    const field = error.path[0] as keyof RegisterFormData;
                    newErrors[field] = error.message;
                });
                setErrors(newErrors);
            } else if (err instanceof Error) {
                // Handle Firebase errors specifically
                if (err.message.includes('auth/email-already-in-use')) {
                    setErrors({ email: "This email is already registered. Please use a different email or login." });
                } else {
                    setErrors({ email: err.message });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000"
                    alt="Background"
                    fill
                    className="object-cover opacity-10"
                />
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center space-y-8 p-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h1>
                        <p className="text-lg text-gray-600">Create an account to access exclusive features and join thousands of users.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {[
                            {
                                title: "Personalized Experience",
                                description: "Tailored content and recommendations",
                                image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800"
                            },
                            {
                                title: "Secure Platform",
                                description: "Your data is always protected",
                                image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?q=80&w=800"
                            },
                            {
                                title: "24/7 Support",
                                description: "Help whenever you need it",
                                image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=800"
                            },
                            {
                                title: "Regular Updates",
                                description: "New features and improvements",
                                image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="p-6 bg-white/80 rounded-xl shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 -z-10">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover opacity-20"
                                    />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center"
                >
                    <Card className="w-full max-w-md shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your details to create your account
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        label: "Full Name",
                                        icon: <User className="h-4 w-4 text-muted-foreground" />,
                                        type: "text",
                                        value: formData.name,
                                        onChange: handleChange('name'),
                                        placeholder: "Enter your full name",
                                        error: errors.name,
                                        delay: 0.2
                                    },
                                    {
                                        label: "Email",
                                        icon: <Mail className="h-4 w-4 text-muted-foreground" />,
                                        type: "email",
                                        value: formData.email,
                                        onChange: handleChange('email'),
                                        placeholder: "Enter your email",
                                        error: errors.email,
                                        delay: 0.3
                                    },
                                    {
                                        label: "Password",
                                        icon: <Lock className="h-4 w-4 text-muted-foreground" />,
                                        type: "password",
                                        value: formData.password,
                                        onChange: handleChange('password'),
                                        placeholder: "Create a password",
                                        error: errors.password,
                                        delay: 0.4
                                    },
                                    {
                                        label: "Confirm Password",
                                        icon: <Lock className="h-4 w-4 text-muted-foreground" />,
                                        type: "password",
                                        value: formData.passwordConfirmation,
                                        onChange: handleChange('passwordConfirmation'),
                                        placeholder: "Confirm your password",
                                        error: errors.passwordConfirmation,
                                        delay: 0.5
                                    }
                                ].map((field, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: field.delay }}
                                    >
                                        <LabelInputContainer
                                            label={field.label}
                                            icon={field.icon}
                                            type={field.type}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            required
                                            disabled={loading}
                                            errorMessage={field.error}
                                        />
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full font-semibold hover:opacity-90 transition-opacity"
                                        disabled={loading}
                                    >
                                        Create Account
                                    </Button>
                                </motion.div>
                            </CardContent>
                            <CardFooter>
                                <motion.p
                                    className="w-full text-sm text-center text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="text-primary hover:underline transition-colors font-medium"
                                    >
                                        Sign in
                                    </Link>
                                </motion.p>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
