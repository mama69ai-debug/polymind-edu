'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { PageLayout, PageHeader } from '@/components/layout'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('密碼與確認密碼不一致')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
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
      <PageHeader title="註冊" description="建立你的 PolyMind 帳號。" />
      <div className="mx-auto max-w-md">
        <form onSubmit={handleRegister} className="space-y-4">
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
            hint="至少 6 個字元"
            required
          />
          <Input
            label="確認密碼"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error}
            required
          />
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            註冊
          </Button>
          <p className="text-center text-sm text-muted">
            已經有帳號？{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              登入
            </Link>
          </p>
        </form>
      </div>
    </PageLayout>
  )
}
