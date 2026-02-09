import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui'
import { LogoutButton } from './LogoutButton'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-muted/20 bg-surface shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-section">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-primary">
            PolyMind
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link
              href="/courses"
              className="text-sm font-medium text-text hover:text-primary"
            >
              課程
            </Link>
            <Link
              href="/my-courses"
              className="text-sm font-medium text-text hover:text-primary"
            >
              我的課程
            </Link>
          </div>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted">{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                登入
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
