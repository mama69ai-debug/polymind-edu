import React, { HTMLAttributes, forwardRef } from 'react'

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface rounded-card shadow-card text-text ${className}`}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

/* -------------------------------------------------------------------------- */
/*                                 CardHeader                                 */
/* -------------------------------------------------------------------------- */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-6 ${className}`}
        {...props}
      />
    )
  }
)
CardHeader.displayName = 'CardHeader'

/* -------------------------------------------------------------------------- */
/*                                 CardContent                                */
/* -------------------------------------------------------------------------- */

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
    )
  }
)
CardContent.displayName = 'CardContent'

/* -------------------------------------------------------------------------- */
/*                                 CardFooter                                 */
/* -------------------------------------------------------------------------- */

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-6 pt-0 ${className}`}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'
