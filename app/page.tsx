import { getPageSections, getSectionByName, getSectionsByPrefix } from '@/lib/notion'

// ─── Fallback data (used when Notion token is absent or returns empty) ─────────
const FALLBACK_HERO = {
  section: 'Hero',
  content: 'Your reputation is your revenue.',
  subtitle:
    'RepSignal monitors every review across Google, Yelp, and 50+ platforms — then drafts AI responses in seconds. Set alerts, track trends, and dominate local search.',
  order: 1,
  published: true,
  id: 'fallback-hero',
}
const FALLBACK_PROBLEM = {
  section: 'Problem',
  content: 'Most small businesses check reviews manually — if at all.',
  subtitle:
    'A single unanswered 1-star review can cost you 30 customers. Manual monitoring is slow, inconsistent, and impossible to scale.',
  order: 2,
  published: true,
  id: 'fallback-problem',
}
const FALLBACK_FEATURES = [
  {
    section: 'Feature 1',
    content: 'Unified Dashboard',
    subtitle: 'See every review from Google, Yelp, TripAdvisor and more in one clean feed.',
    order: 3,
    published: true,
    id: 'fallback-f1',
  },
  {
    section: 'Feature 2',
    content: 'AI Responses',
    subtitle:
      'One click generates a professional, on-brand reply — reviewed by you before it goes live.',
    order: 4,
    published: true,
    id: 'fallback-f2',
  },
  {
    section: 'Feature 3',
    content: 'Instant Alerts',
    subtitle:
      'Get notified by email or SMS the moment a new review lands — no more checking manually.',
    order: 5,
    published: true,
    id: 'fallback-f3',
  },
  {
    section: 'Feature 4',
    content: 'AI Search Visibility',
    subtitle:
      'Optimize your listing keywords so AI search engines surface your business first.',
    order: 6,
    published: true,
    id: 'fallback-f4',
  },
]
const FALLBACK_CTA = {
  section: 'CTA',
  content: 'Start free. No credit card.',
  subtitle:
    'Join 400+ local businesses already on the waitlist. Be first in line when we launch.',
  order: 7,
  published: true,
  id: 'fallback-cta',
}

// ─── Feature icons (inline SVG) ──────────────────────────────────────────────
const featureIcons = [
  // Dashboard / grid
  <svg key="dashboard" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>,
  // AI spark
  <svg key="ai" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
  </svg>,
  // Bell / alert
  <svg key="bell" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>,
  // Search / magnifier
  <svg key="search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <path d="M8 11h6M11 8v6" />
  </svg>,
]

// ─── Check icon for pricing ───────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 flex-shrink-0 text-accent"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// ─── Pricing tiers ────────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    description: 'Perfect for single-location businesses getting started.',
    features: [
      '1 business location',
      'Google & Yelp monitoring',
      'Email alerts',
      '20 AI responses/mo',
      'Weekly digest reports',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$35',
    period: '/mo',
    description: 'The sweet spot for growing local businesses.',
    features: [
      '3 business locations',
      '50+ platform monitoring',
      'Email & SMS alerts',
      'Unlimited AI responses',
      'Competitor tracking',
      'Monthly review reports',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Visibility',
    price: '$59',
    period: '/mo',
    description: 'Dominate local search with AI-powered optimization.',
    features: [
      '10 business locations',
      '50+ platform monitoring',
      'Email, SMS & Slack alerts',
      'Unlimited AI responses',
      'AI search visibility tools',
      'White-label reports',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Get Started',
    popular: false,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  // Fetch from Notion at build time (async Server Component)
  const sections = await getPageSections()

  const hero = getSectionByName(sections, 'Hero') ?? FALLBACK_HERO
  const problem = getSectionByName(sections, 'Problem') ?? FALLBACK_PROBLEM
  const featureSections = getSectionsByPrefix(sections, 'Feature')
  const features = featureSections.length >= 4 ? featureSections : FALLBACK_FEATURES
  const cta = getSectionByName(sections, 'CTA') ?? FALLBACK_CTA

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            {/* Logo mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight text-white">RepSignal</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-subtle transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-sm text-subtle transition-colors hover:text-white">
              Pricing
            </a>
          </nav>

          <a href="#waitlist" className="btn-primary text-sm">
            Join Waitlist
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-hero-glow"
          />
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block">
              <span className="section-label">AI Reputation Management</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-b from-white to-subtle bg-clip-text text-transparent">
                {hero.content || 'Your reputation is your revenue.'}
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-subtle sm:text-lg">
              {hero.subtitle ||
                'RepSignal monitors every review across Google, Yelp, and 50+ platforms — then drafts AI responses in seconds.'}
            </p>

            {/* Waitlist form */}
            <form
              id="waitlist"
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field flex-1"
                required
                aria-label="Email address"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Join Waitlist
              </button>
            </form>

            {/* Social proof / stats */}
            <div className="mt-12 flex items-center justify-center gap-8 border-t border-border pt-10 sm:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">27M</p>
                <p className="mt-1 text-xs text-muted">SMBs in the US</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">$35<span className="text-base font-medium">/mo</span></p>
                <p className="mt-1 text-xs text-muted">avg plan price</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">400+</p>
                <p className="mt-1 text-xs text-muted">on waitlist</p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* ── Problem ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="section-label mb-6 inline-block">The Problem</span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
              {problem.content || 'Most small businesses check reviews manually — if at all.'}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-subtle sm:text-lg">
              {problem.subtitle ||
                'A single unanswered 1-star review can cost you 30 customers. Manual monitoring is slow, inconsistent, and impossible to scale.'}
            </p>

            {/* Pain points */}
            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {[
                { stat: '94%', label: 'of consumers read online reviews before visiting a business' },
                { stat: '53%', label: 'of customers expect a reply to a negative review within a week' },
                { stat: '3.3×', label: 'more revenue for businesses with 4+ star average ratings' },
              ].map((item) => (
                <div key={item.stat} className="card text-center">
                  <p className="mb-2 text-4xl font-bold text-accent">{item.stat}</p>
                  <p className="text-sm leading-relaxed text-subtle">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* ── Features ── */}
        <section id="features" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="section-label mb-6 inline-block">Features</span>
              <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
                Everything you need to own your reputation
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.slice(0, 4).map((feature, i) => (
                <div
                  key={feature.id}
                  className="card group relative overflow-hidden"
                >
                  {/* Accent glow on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(400px circle at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%)',
                    }}
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-muted text-accent ring-1 ring-accent/20">
                      {featureIcons[i]}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {feature.content}
                    </h3>
                    <p className="text-sm leading-relaxed text-subtle">{feature.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* ── Pricing ── */}
        <section id="pricing" className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="section-label mb-6 inline-block">Pricing</span>
              <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-subtle">No hidden fees. Cancel any time.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                    tier.popular
                      ? 'border-accent bg-surface-2 shadow-lg shadow-accent/10'
                      : 'border-border bg-surface hover:border-border-light hover:bg-surface-2'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-accent/30">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="mb-1 text-sm font-medium text-subtle">{tier.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">{tier.price}</span>
                      <span className="text-subtle">{tier.period}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{tier.description}</p>
                  </div>

                  <ul className="mb-8 flex flex-col gap-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-subtle">
                        <CheckIcon />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <a
                      href="#waitlist"
                      className={`block w-full rounded-lg px-5 py-3 text-center text-sm font-medium transition-all duration-200 active:scale-95 ${
                        tier.popular
                          ? 'bg-accent text-white hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20'
                          : 'border border-border text-subtle hover:border-border-light hover:bg-surface-2 hover:text-white'
                      }`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glow-line" />

        {/* ── CTA ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            {/* Glow blob */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative">
              <span className="section-label mb-6 inline-block">Get Early Access</span>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
                {cta.content || 'Start free. No credit card.'}
              </h2>
              <p className="mb-10 text-base leading-relaxed text-subtle sm:text-lg">
                {cta.subtitle ||
                  'Join 400+ local businesses already on the waitlist. Be first in line when we launch.'}
              </p>

              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field flex-1"
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Join Waitlist
                </button>
              </form>

              <p className="mt-4 text-xs text-muted">
                Free during beta &middot; No spam, ever &middot; Unsubscribe any time
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">RepSignal</span>
          </div>

          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} RepSignal. All rights reserved.
          </p>

          <nav className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted transition-colors hover:text-subtle">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted transition-colors hover:text-subtle">
              Terms
            </a>
            <a href="mailto:hello@repsignal.com" className="text-xs text-muted transition-colors hover:text-subtle">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
