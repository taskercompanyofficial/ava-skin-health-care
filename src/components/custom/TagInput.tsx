"use client"

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge"
import { IconX } from "@tabler/icons-react"

interface TagInputProps {
    value?: string | null
    onChange: (tags: string) => void
    placeholder?: string
    className?: string
}

export function TagInput({ value, onChange, placeholder = "Add tags...", className }: TagInputProps) {
    const [input, setInput] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    
    // Convert comma-separated string to array for internal use, safely handling null or undefined
    const tagsArray = value ? value.split(',').filter(tag => tag.trim() !== '') : []

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input) {
            e.preventDefault()
            const newTag = input.trim()
            if (!tagsArray.includes(newTag)) {
                const newTagsArray = [...tagsArray, newTag]
                onChange(newTagsArray.join(','))
            }
            setInput("")
        } else if (e.key === "Backspace" && !input && tagsArray.length > 0) {
            const newTagsArray = tagsArray.slice(0, -1)
            onChange(newTagsArray.join(','))
        }
    }

    const removeTag = (index: number) => {
        const newTagsArray = tagsArray.filter((_, i) => i !== index)
        onChange(newTagsArray.join(','))
    }

    return (
        <div className={`relative min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 ${className}`}>
            <div className="flex flex-wrap gap-2">
                {tagsArray.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:bg-secondary/80 rounded-full p-0.5"
                        >
                            <IconX size={14} />
                        </button>
                    </Badge>
                ))}
                <div className="relative inline-flex items-center w-full">
                    <span
                        className="invisible absolute whitespace-pre"
                        style={{ fontSize: "14px" }}
                    >
                        {input}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tagsArray.length === 0 ? placeholder : ""}
                        className="border-none outline-none focus:ring-0 p-0 text-sm w-full"
                    />
                </div>
            </div>
        </div>
    )
}
