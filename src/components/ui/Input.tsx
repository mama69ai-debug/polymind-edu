import React, { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, hint, error, disabled, id, ...props }, ref) => {
    // Generate a unique ID if one isn't provided, for accessibility
    const inputId = id || React.useId()
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-medium text-text"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          aria-invalid={!!error}
          className={`
            flex h-10 w-full rounded-card border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-muted/50
            transition-colors
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            disabled:cursor-not-allowed disabled:opacity-50
            ${error 
              ? 'border-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]' 
              : 'border-muted focus-visible:border-primary'
            }
            ${className}
          `.trim()}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-sm text-accent">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
