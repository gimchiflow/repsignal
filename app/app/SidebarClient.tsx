'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SidebarClient({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/app/login')
    router.refresh()
  }

  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#46a095] text-xs font-bold text-white">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">{email}</p>
          <p className="text-xs text-white/40">Free plan</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Sign out
      </button>
    </div>
  )
}
