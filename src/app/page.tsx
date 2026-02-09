import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageLayout, Section } from '@/components/layout'
import { CourseList } from '@/components/domain'
import { Button } from '@/components/ui'

export default async function Home() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, instructor:instructors(*)')
    .eq('status', 'published')
    .limit(3)

  const featuredCourses = (courses ?? []).map((course) => ({
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
  }))

  return (
    <PageLayout>
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold text-text lg:text-5xl">
          PolyMind
        </h1>
        <p className="mt-4 text-xl text-muted">
          幫助你用最適合自己的方式，學到可落地的專業技能。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/courses">
            <Button size="lg" variant="primary">
              瀏覽課程
            </Button>
          </Link>
          <Link href="/my-courses">
            <Button size="lg" variant="secondary">
              我的學習
            </Button>
          </Link>
        </div>
      </div>

      <Section title="精選課程">
        <CourseList
          items={featuredCourses}
          emptyTitle="尚無課程"
          emptyDescription="敬請期待。"
        />
      </Section>
    </PageLayout>
  )
}
