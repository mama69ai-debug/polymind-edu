interface EmptyStateProps {
  message: string
  description?: string
}

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-lg font-medium text-muted">{message}</p>
      {description && (
        <p className="mt-2 text-sm text-muted">{description}</p>
      )}
    </div>
  )
}
