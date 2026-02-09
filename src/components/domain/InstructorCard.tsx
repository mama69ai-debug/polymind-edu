import React from 'react'
import type { Instructor } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui'

interface InstructorCardProps {
  instructor: Instructor
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-surface shadow-card" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-text">
              {instructor.name}
            </div>
            <div className="truncate text-sm text-muted">講師</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text">{instructor.bio}</p>
      </CardContent>
    </Card>
  )
}
