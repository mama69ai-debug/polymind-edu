'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { PageLayout, PageHeader } from '@/components/layout'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/courses')
      router.refresh()
    }
  }

  return (
    <PageLayout>
      <PageHeader title="登入" description="使用你的帳號登入 PolyMind。" />
      <div className="mx-auto max-w-md">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="密碼"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
          />
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            登入
          </Button>
          <p className="text-center text-sm text-muted">
            還沒有帳號？{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              註冊
            </Link>
          </p>
        </form>
      </div>
    </PageLayout>
  )
}
