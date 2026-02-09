import React from 'react'
import type { Chapter } from '@/types'
import { EmptyState } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'

interface ChapterListProps {
  chapters: Chapter[]
}

export function ChapterList({ chapters }: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <EmptyState
        message="尚無章節"
        description="這門課的章節內容正在準備中。"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {chapters.map((ch, index) => (
        <Card key={ch.id}>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-10 shrink-0 text-sm font-semibold text-muted">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-text">
                  {ch.title}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
