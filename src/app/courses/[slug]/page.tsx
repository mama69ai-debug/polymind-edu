import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChapterList, InstructorCard } from '@/components/domain'
import { PageHeader, PageLayout, Section } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/ui'

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, instructor:instructors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!course) return notFound()

  const { data: chapters } = await supabase
    .from('course_chapters')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const courseData = {
    id: course.id,
    slug: course.slug ?? '',
    title: course.title,
    description: course.description ?? '',
    coverUrl: course.cover_url ?? '',
    price: course.price,
    instructorId: course.instructor_id ?? '',
    status: course.status as 'draft' | 'published',
  }

  const instructorData = course.instructor
    ? {
        id: course.instructor.id,
        name: course.instructor.name,
        avatarUrl: course.instructor.avatar_url ?? '',
        bio: course.instructor.bio ?? '',
      }
    : null

  const chaptersData = (chapters ?? []).map((ch) => ({
    id: ch.id,
    courseId: ch.course_id,
    title: ch.title,
    content: ch.content ?? '',
    sortOrder: ch.sort_order,
  }))

  return (
    <PageLayout>
      <PageHeader title={courseData.title} description={courseData.description} />

      <div className="space-y-8">
        <Section title="開始學習">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <div className="text-sm text-muted">
                價格：NT$ {courseData.price.toLocaleString('zh-TW')}
              </div>
              <Link href={`/courses/${courseData.slug}/learn`}>
                <Button variant="primary">進入學習頁</Button>
              </Link>
            </CardContent>
          </Card>
        </Section>

        {instructorData ? (
          <Section title="講師">
            <InstructorCard instructor={instructorData} />
          </Section>
        ) : null}

        <Section title="章節">
          <ChapterList chapters={chaptersData} />
        </Section>
      </div>
    </PageLayout>
  )
}
