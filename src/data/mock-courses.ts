import type { Chapter, Course, Instructor } from '@/types'

export const mockInstructors: Instructor[] = [
  {
    id: 'inst_1',
    name: '王小明',
    avatarUrl: '/images/instructors/inst_1.png',
    bio: '專注於 AI 產品落地與工程實作，帶你從 0 到 1 建立可用的專案。',
  },
]

export const mockCourses: Course[] = [
  {
    id: 'course_1',
    slug: 'ai-engineering-mvp',
    title: 'AI 工程實作入門：從需求到上線',
    description:
      '用最短路徑打造可交付的 AI 專案：需求拆解、資料流程、部署與監控。',
    coverUrl: '/images/courses/course_1.png',
    price: 1490,
    instructorId: 'inst_1',
    status: 'published',
  },
]

export const mockChapters: Chapter[] = [
  {
    id: 'ch_1',
    courseId: 'course_1',
    title: '課程導覽與學習方式',
    content: '本章介紹課程結構與建議學習節奏（內容占位）。',
    sortOrder: 1,
  },
  {
    id: 'ch_2',
    courseId: 'course_1',
    title: '建立你的第一個 MVP',
    content: '本章帶你完成最小可用產品（內容占位）。',
    sortOrder: 2,
  },
]

export function getMockCourseById(courseId: string) {
  const course = mockCourses.find((c) => c.id === courseId) ?? null
  if (!course) return null

  const instructor =
    mockInstructors.find((i) => i.id === course.instructorId) ?? null
  const chapters = mockChapters
    .filter((ch) => ch.courseId === course.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return { course, instructor, chapters }
}
