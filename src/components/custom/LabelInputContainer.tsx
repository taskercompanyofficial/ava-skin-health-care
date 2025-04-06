"use client";

import React, { useState, InputHTMLAttributes, useMemo } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  topRightComponent?: React.ReactNode;
  containerClassName?: string;
}

export const LabelInputContainer = React.memo(({
  label,
  labelClassName,
  description,
  errorMessage,
  icon,
  type = "text",
  disabled,
  topRightComponent,
  containerClassName,
  ...props
}: EnhancedInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = useMemo(() =>
    props.id || `input-${Math.random().toString(36).substring(2, 9)}`,
    [props.id]
  );

  const inputClassName = useMemo(() =>
    cn(
      "placeholder:text-xs placeholder:font-mono",
      icon && "pl-10",
      errorMessage && "border-red-500"
    ),
    [icon, errorMessage]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className={cn("flex items-center justify-between", labelClassName)}>
        {label && (
          <Label htmlFor={inputId}>
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        {topRightComponent}
      </div>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {React.cloneElement(icon as React.ReactElement)}
            {disabled && <Lock className="h-4 w-4 ml-1 text-muted-foreground" />}
          </div>
        )}

        <Input
          id={inputId}
          type={inputType}
          className={inputClassName}
          placeholder={type === "password" ? "********" : props.placeholder}
          disabled={disabled}
          aria-describedby={description ? `${inputId}-description` : undefined}
          aria-invalid={errorMessage ? true : undefined}
          {...props}
        />

        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {description && (
        <p
          id={`${inputId}-description`}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {errorMessage && (
        <p
          className="text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

LabelInputContainer.displayName = "LabelInputContainer";
