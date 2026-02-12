import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChapterList } from '@/components/domain'
import { PageHeader, PageLayout, Section } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/ui'

interface LearnPageProps {
  params: Promise<{ slug: string }>
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!course) return notFound()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/learn`)
  }

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!enrollment) {
    return (
      <PageLayout>
        <PageHeader
          title="需要購買課程"
          description="您尚未購買此課程，請先完成購買才能觀看內容。"
        />
        <Section>
          <Card>
            <CardContent className="flex flex-col gap-4 text-center py-8">
              <div className="text-4xl">🔒</div>
              <h2 className="text-xl font-semibold">此課程需要購買</h2>
              <p className="text-muted">
                請先購買課程後，即可觀看完整內容。
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <Link href={`/courses/${slug}`}>
                  <Button variant="primary">查看課程詳情</Button>
                </Link>
                <Link href="/courses">
                  <Button variant="secondary">瀏覽其他課程</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Section>
      </PageLayout>
    )
  }

  const { data: chapters } = await supabase
    .from('course_chapters')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const chaptersData = (chapters ?? []).map((ch) => ({
    id: ch.id,
    courseId: ch.course_id,
    title: ch.title,
    content: ch.content ?? '',
    sortOrder: ch.sort_order,
  }))

  const firstChapter = chaptersData[0] ?? null

  return (
    <PageLayout>
      <PageHeader
        title={`${course.title}（學習頁）`}
        description="章節內容占位：後續 Phase 4 會接入章節選擇與進度。"
      />

      <div className="space-y-8">
        <Section title="章節列表">
          <ChapterList chapters={chaptersData} />
        </Section>

        <Section title="章節內容">
          <Card>
            <CardContent>
              {firstChapter ? (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-text">
                    {firstChapter.title}
                  </div>
                  <div className="text-sm text-text">{firstChapter.content}</div>
                </div>
              ) : (
                <div className="text-sm text-muted">尚無可顯示的章節。</div>
              )}
            </CardContent>
          </Card>
        </Section>
      </div>
    </PageLayout>
  )
}
