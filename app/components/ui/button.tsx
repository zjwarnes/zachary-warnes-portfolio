import { cn } from 'app/lib/utils'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  disableGlow?: boolean
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disableGlow = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none'
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
    secondary: 'bg-[var(--color-secondary)] text-white hover:bg-opacity-80',
    outline: 'border border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] text-white',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        !disableGlow && 'animate-border-glow',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
} 