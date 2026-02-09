import { createClient } from '@/lib/supabase/server'
import { CourseList } from '@/components/domain'
import { PageHeader, PageLayout, Section } from '@/components/layout'

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, instructor:instructors(*)')
    .eq('status', 'published')

  const items = (courses ?? []).map((course) => ({
    course: {
      id: course.id,
      slug: course.slug ?? '',
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
  }))

  return (
    <PageLayout>
      <PageHeader title="課程" description="挑選一門適合你的課程，開始學習。" />
      <Section title="課程列表">
        <CourseList items={items} />
      </Section>
    </PageLayout>
  )
}
