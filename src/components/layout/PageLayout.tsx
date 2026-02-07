import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl p-section">
        {children}
      </div>
    </div>
  )
}
