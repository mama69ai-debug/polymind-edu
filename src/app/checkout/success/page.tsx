import Link from 'next/link';
import { PageLayout, PageHeader, Section } from '@/components/layout';
import { Button, Card, CardContent } from '@/components/ui';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <PageLayout>
      <PageHeader
        title="購買成功"
        description="感謝您的購買！您現在可以開始學習了。"
      />

      <Section>
        <Card>
          <CardContent className="flex flex-col gap-4 text-center py-8">
            <div className="text-4xl">✓</div>
            <h2 className="text-xl font-semibold">付款完成</h2>
            <p className="text-muted">
              您的課程已經加入到「我的課程」中
            </p>
            {sessionId && (
              <p className="text-sm text-muted">
                交易 ID: {sessionId}
              </p>
            )}
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/my-courses">
                <Button variant="primary">查看我的課程</Button>
              </Link>
              <Link href="/courses">
                <Button variant="secondary">繼續瀏覽課程</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Section>
    </PageLayout>
  );
}
