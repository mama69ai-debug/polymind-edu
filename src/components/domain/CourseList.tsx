import React from 'react'
import type { Course, Instructor } from '@/types'
import { EmptyState } from '@/components/layout'
import { CourseCard } from './CourseCard'

type CourseListItem = {
  course: Course
  instructor: Instructor | null
}

interface CourseListProps {
  items: CourseListItem[]
  emptyTitle?: string
  emptyDescription?: string
}

export function CourseList({
  items,
  emptyTitle = '目前沒有課程',
  emptyDescription = '請稍後再回來看看。',
}: CourseListProps) {
  if (items.length === 0) {
    return <EmptyState message={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map(({ course, instructor }) => (
        <CourseCard
          key={course.id}
          course={course}
          instructor={instructor}
        />
      ))}
    </div>
  )
}
