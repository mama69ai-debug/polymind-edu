import React from 'react'
import Link from 'next/link'
import type { Course, Instructor } from '@/types'
import { Button, Card, CardContent, CardFooter, CardHeader } from '@/components/ui'

interface CourseCardProps {
  course: Course
  instructor: Instructor | null
}

export function CourseCard({ course, instructor }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-text">
              {course.title}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {instructor ? instructor.name : '—'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm text-muted">價格</div>
            <div className="text-lg font-semibold text-text">
              NT$ {course.price.toLocaleString('zh-TW')}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm text-text">{course.description}</p>
      </CardContent>

      <CardFooter>
        <Link className="w-full" href={`/courses/${course.slug}`}>
          <Button className="w-full" variant="primary">
            查看課程
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
