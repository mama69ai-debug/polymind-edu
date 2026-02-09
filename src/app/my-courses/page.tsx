import { createClient } from '@/lib/supabase/server'
import { PageHeader, PageLayout, Section } from '@/components/layout'
import { CourseList } from '@/components/domain'

export default async function MyCoursesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <PageLayout>
        <PageHeader
          title="我的課程"
          description="請先登入以查看你的課程。"
        />
      </PageLayout>
    )
  }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, courses(*, instructor:instructors(*))')
    .eq('user_id', user.id)

  const items = (enrollments ?? [])
    .map((enrollment) => {
      const course = enrollment.courses as unknown as {
        id: string
        title: string
        description: string | null
        cover_url: string | null
        price: number
        instructor_id: string | null
        status: string
        instructor: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
        } | null
      } | null
      if (!course) return null

      return {
        course: {
          id: course.id,
          title: course.title,
          description: course.description ?? '',
          coverUrl: course.cover_url ?? '',
          price: course.price,
          instructorId: course.instructor_id ?? '',
          status: course.status as 'draft' | 'published',
        },
        instructor: course.instructor
          ? {
              id: course.instructor.id,
              name: course.instructor.name,
              avatarUrl: course.instructor.avatar_url ?? '',
              bio: course.instructor.bio ?? '',
            }
          : null,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <PageLayout>
      <PageHeader title="我的課程" description="你已購買/加入的課程。" />

      <Section title="課程">
        <CourseList
          items={items}
          emptyTitle="你還沒有任何課程"
          emptyDescription="先去課程列表挑一門課吧。"
        />
      </Section>
    </PageLayout>
  )
}
