import { ReactNode } from 'react'

interface SectionProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`bg-surface rounded-card shadow-card p-section ${className}`}>
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-text">{title}</h2>
      )}
      <div>{children}</div>
    </section>
  )
}
