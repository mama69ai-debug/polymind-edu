export type CourseId = string
export type InstructorId = string
export type ChapterId = string

export interface Instructor {
  id: InstructorId
  name: string
  avatarUrl: string
  bio: string
}

export interface Chapter {
  id: ChapterId
  courseId: CourseId
  title: string
  content: string
  sortOrder: number
}

export interface Course {
  id: CourseId
  slug: string
  title: string
  description: string
  coverUrl: string
  price: number
  instructorId: InstructorId
  status: 'draft' | 'published'
}
