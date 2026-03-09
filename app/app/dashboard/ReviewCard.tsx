'use client'

import { useState } from 'react'
import type { Review } from './page'

const PLATFORM_STYLES: Record<
  Review['platform'],
  { bg: string; text: string; dot: string }
> = {
  Google: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Yelp: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  Facebook: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
}

const SENTIMENT_STYLES: Record<
  Review['sentiment'],
  { bg: string; text: string; label: string }
> = {
  positive: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Positive' },
  neutral: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Neutral' },
  negative: { bg: 'bg-red-50', text: 'text-red-700', label: 'Negative' },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={i < rating ? '#ffb340' : 'none'}
          stroke={i < rating ? '#ffb340' : '#d1d5db'}
          strokeWidth="1.2"
          className="h-3.5 w-3.5"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function ReviewCard({ review }: { review: Review }) {
  const [draft, setDraft] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const platform = PLATFORM_STYLES[review.platform]
  const sentiment = SENTIMENT_STYLES[review.sentiment]

  async function handleDraftResponse() {
    if (draft) {
      setDraft(null)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: review.review_text,
          rating: review.rating,
          platform: review.platform,
          businessName: 'Peak Performance Gym',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to generate response')
      }

      const data = await res.json()
      setDraft(data.draft)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!draft) return
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[#e0e8f0] bg-white shadow-[0_4px_6px_-1px_rgba(15,49,97,0.06)] transition-all duration-200 hover:shadow-[0_8px_12px_-2px_rgba(15,49,97,0.1)]">
      {/* Card header */}
      <div className="px-5 pt-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Platform badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${platform.bg} ${platform.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${platform.dot}`} />
              {review.platform}
            </span>

            {/* Sentiment badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${sentiment.bg} ${sentiment.text}`}
            >
              {sentiment.label}
            </span>

            {/* Responded badge */}
            {review.responded && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                Responded
              </span>
            )}
          </div>

          {/* Date */}
          <span className="flex-shrink-0 text-xs text-gray-400">
            {formatDate(review.review_date)}
          </span>
        </div>

        {/* Author + stars */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3161]/8 text-xs font-bold text-[#0f3161]">
            {review.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0f3161]">{review.author}</p>
            <StarRating rating={review.rating} />
          </div>
        </div>

        {/* Review text */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600">{review.review_text}</p>
      </div>

      {/* AI Draft section */}
      {draft && (
        <div className="mx-5 mb-4 rounded-xl border border-[#ffb340]/30 bg-[#ffb340]/8 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ffb340" className="h-4 w-4">
                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.24a1 1 0 0 0 0 1.962l1.192.24a1 1 0 0 1 .785.785l.24 1.192a1 1 0 0 0 1.962 0l.24-1.192a1 1 0 0 1 .785-.785l1.192-.24a1 1 0 0 0 0-1.962l-1.192-.24a1 1 0 0 1-.785-.785l-.24-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
              </svg>
              <span className="text-xs font-semibold text-[#cc8c28]">AI Draft Response</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[#cc8c28] transition-colors hover:bg-[#ffb340]/20"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-sm italic leading-relaxed text-gray-700">&ldquo;{draft}&rdquo;</p>
        </div>
      )}

      {error && (
        <div className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Footer actions */}
      <div className="border-t border-[#e0e8f0] px-5 py-3.5">
        <button
          onClick={handleDraftResponse}
          disabled={loading}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
            draft
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-[#0f3161] text-white hover:bg-[#1a4a8a]'
          }`}
        >
          {loading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : draft ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide Draft
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.24a1 1 0 0 0 0 1.962l1.192.24a1 1 0 0 1 .785.785l.24 1.192a1 1 0 0 0 1.962 0l.24-1.192a1 1 0 0 1 .785-.785l1.192-.24a1 1 0 0 0 0-1.962l-1.192-.24a1 1 0 0 1-.785-.785l-.24-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
              </svg>
              Draft AI Response
            </>
          )}
        </button>
      </div>
    </div>
  )
}
