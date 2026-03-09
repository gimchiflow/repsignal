'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // If email confirmation is disabled, go straight to dashboard
    setTimeout(() => {
      router.push('/app/dashboard')
      router.refresh()
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f8fc] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f3161]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0f3161]">RepSignal</h1>
          <p className="mt-1 text-sm text-gray-500">Create your free account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-[0_4px_6px_-1px_rgba(15,49,97,0.06),0_10px_30px_-5px_rgba(15,49,97,0.1)] border border-[#e0e8f0]">
          {success ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#46a095]/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="#46a095" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0f3161]">Account created!</h2>
              <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#0f3161]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#e0e8f0] bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-[#46a095] focus:outline-none focus:ring-2 focus:ring-[#46a095]/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#0f3161]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-lg border border-[#e0e8f0] bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-[#46a095] focus:outline-none focus:ring-2 focus:ring-[#46a095]/20"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#0f3161]">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#e0e8f0] bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-[#46a095] focus:outline-none focus:ring-2 focus:ring-[#46a095]/20"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#46a095] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3d8e84] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#46a095]/30"
              >
                {loading ? 'Creating account…' : 'Create free account'}
              </button>
            </form>
          )}

          {!success && (
            <>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e0e8f0]" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-[#e0e8f0]" />
              </div>

              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a
                  href="/app/login"
                  className="font-semibold text-[#46a095] transition-colors hover:text-[#0f3161]"
                >
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} RepSignal. All rights reserved.
        </p>
      </div>
    </div>
  )
}
