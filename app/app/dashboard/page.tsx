import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ReviewCard from './ReviewCard'

export const metadata = {
  title: 'Dashboard — RepSignal',
}

// ── Types ────────────────────────────────────────────────────────────────────

export type Review = {
  id: string
  user_id: string
  platform: 'Google' | 'Yelp' | 'Facebook'
  author: string
  rating: number
  review_text: string
  review_date: string
  sentiment: 'positive' | 'neutral' | 'negative'
  responded: boolean
}

// ── Mock seed data ────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Omit<Review, 'id' | 'user_id'>[] = [
  {
    platform: 'Google',
    author: 'Marcus T.',
    rating: 5,
    review_text:
      'Absolutely love this gym. The equipment is always clean, the staff knows your name, and the classes are top-notch. Signed up six months ago and I\'ve been coming every day. Worth every penny.',
    review_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    responded: true,
  },
  {
    platform: 'Yelp',
    author: 'Sarah K.',
    rating: 2,
    review_text:
      'Disappointed with my last few visits. The locker rooms are often dirty and the peak-hour wait for machines is getting out of hand. Management needs to address crowding before adding more memberships.',
    review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'negative',
    responded: false,
  },
  {
    platform: 'Facebook',
    author: 'David R.',
    rating: 4,
    review_text:
      'Great facility overall. The trainers are knowledgeable and happy to help even if you\'re not paying for personal training. Docking one star because parking is a nightmare on weekday mornings.',
    review_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    responded: false,
  },
  {
    platform: 'Google',
    author: 'Jennifer L.',
    rating: 1,
    review_text:
      'Cancelled my membership after three months. They charged me twice in one month and the billing team took two weeks to respond. The gym itself is fine but the administrative side is a mess.',
    review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'negative',
    responded: false,
  },
  {
    platform: 'Yelp',
    author: 'Mike O.',
    rating: 3,
    review_text:
      'Decent gym for the price. Nothing exceptional but nothing terrible either. The cardio section is well maintained but the free weights area could use more dumbbells in the 30-50lb range.',
    review_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'neutral',
    responded: true,
  },
  {
    platform: 'Facebook',
    author: 'Rachel M.',
    rating: 5,
    review_text:
      'Best decision I ever made joining here. Lost 20 lbs in three months with the help of the nutrition coaching program. The community vibe here is unlike any other gym I\'ve been to. 10/10 recommend.',
    review_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    sentiment: 'positive',
    responded: true,
  },
]

// ── Stats helpers ─────────────────────────────────────────────────────────────

function computeStats(reviews: Review[]) {
  const total = reviews.length
  const avgRating =
    total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0
  const responded = reviews.filter((r) => r.responded).length
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const unanswered = total - responded
  return { total, avgRating, responseRate, unanswered }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/app/login')

  // Try fetching existing reviews
  let { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .order('review_date', { ascending: false })

  // Seed mock reviews if none exist
  if (!error && (!reviews || reviews.length === 0)) {
    const toInsert = MOCK_REVIEWS.map((r) => ({ ...r, user_id: user.id }))
    const { data: seeded } = await supabase
      .from('reviews')
      .insert(toInsert)
      .select()
    reviews = seeded ?? []
  }

  const allReviews: Review[] = (reviews ?? []) as Review[]
  const stats = computeStats(allReviews)

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="border-b border-[#e0e8f0] bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0f3161]">Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Your reputation overview at a glance
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#46a095]/30 bg-[#46a095]/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#46a095] animate-pulse" />
            <span className="text-xs font-semibold text-[#46a095]">Live monitoring</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-7">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Reviews"
            value={String(stats.total)}
            icon={<StarIcon />}
            color="navy"
          />
          <StatCard
            label="Avg Rating"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
            icon={<RatingIcon />}
            color="teal"
            suffix="/ 5"
          />
          <StatCard
            label="Response Rate"
            value={`${stats.responseRate}%`}
            icon={<ResponseIcon />}
            color="orange"
          />
          <StatCard
            label="Unanswered"
            value={String(stats.unanswered)}
            icon={<AlertIcon />}
            color={stats.unanswered > 0 ? 'red' : 'teal'}
          />
        </div>

        {/* Review feed */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0f3161]">
              Recent Reviews{' '}
              <span className="ml-1 rounded-full bg-[#0f3161]/8 px-2 py-0.5 text-xs font-semibold text-[#0f3161]/60">
                {allReviews.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sorted by newest</span>
            </div>
          </div>

          {allReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0e8f0] bg-white py-16">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f8fc]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0f3161" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#0f3161]">No reviews yet</p>
              <p className="mt-1 text-xs text-gray-400">Connect your business profiles to start seeing reviews</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {allReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

type StatColor = 'navy' | 'teal' | 'orange' | 'red'

const colorMap: Record<StatColor, { bg: string; text: string; icon: string }> = {
  navy: { bg: 'bg-[#0f3161]/8', text: 'text-[#0f3161]', icon: 'text-[#0f3161]' },
  teal: { bg: 'bg-[#46a095]/10', text: 'text-[#46a095]', icon: 'text-[#46a095]' },
  orange: { bg: 'bg-[#ffb340]/15', text: 'text-[#cc8c28]', icon: 'text-[#ffb340]' },
  red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
}

function StatCard({
  label,
  value,
  icon,
  color,
  suffix,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: StatColor
  suffix?: string
}) {
  const c = colorMap[color]
  return (
    <div className="rounded-2xl border border-[#e0e8f0] bg-white p-5 shadow-[0_4px_6px_-1px_rgba(15,49,97,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
          <span className={`h-4 w-4 ${c.icon}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
      </div>
    </div>
  )
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )
}

function RatingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  )
}

function ResponseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}
