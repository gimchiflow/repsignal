import { getPageSections, getSectionByName, getSectionsByPrefix } from '@/lib/notion'
import WaitlistForm from './components/WaitlistForm'

const FALLBACK_HERO = {
  section: 'Hero', content: 'Your reputation is your revenue.',
  subtitle: 'RepSignal monitors every review across Google, Yelp, and 50+ platforms — then drafts AI responses in seconds. Set alerts, track trends, and show up where customers are looking.',
  order: 1, published: true, id: 'fallback-hero',
}
const FALLBACK_PROBLEM = {
  section: 'Problem', content: 'Most small businesses check reviews manually — if at all.',
  subtitle: 'A single unanswered 1-star review can cost you 30 customers. Manual monitoring is slow, inconsistent, and impossible to scale.',
  order: 2, published: true, id: 'fallback-problem',
}
const FALLBACK_FEATURES = [
  { section: 'Feature 1', content: 'Unified Review Dashboard', subtitle: 'See every review from Google, Yelp, Facebook and more in one clean feed. No more tab-hopping or missed feedback.', order: 3, published: true, id: 'f1' },
  { section: 'Feature 2', content: 'AI Response Drafting', subtitle: 'Get a professional, on-brand reply for every review in one click — reviewed and sent in seconds, not hours.', order: 4, published: true, id: 'f2' },
  { section: 'Feature 3', content: 'Instant Alerts', subtitle: 'Get notified the moment a bad review lands via SMS or email. Respond before it damages your reputation.', order: 5, published: true, id: 'f3' },
  { section: 'Feature 4', content: 'AI Search Visibility', subtitle: 'Find out if ChatGPT and Google AI recommend your business — and get actionable steps to improve your ranking.', order: 6, published: true, id: 'f4' },
]
const FALLBACK_CTA = {
  section: 'CTA', content: 'Start free. No credit card.',
  subtitle: 'Join the waitlist and get early access when we launch.',
  order: 7, published: true, id: 'fallback-cta',
}

const featureIcons = [
  <svg key="d" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  <svg key="a" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  <svg key="b" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  <svg key="s" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
]

const pricingTiers = [
  {
    name: 'Starter', price: '$19', period: '/mo',
    description: 'Perfect for single-location businesses just getting started.',
    features: ['Google & Facebook monitoring', 'Email alerts', '20 AI responses/mo', 'Weekly digest reports', '1 business location'],
    cta: 'Get Started', popular: false,
  },
  {
    name: 'Growth', price: '$35', period: '/mo',
    description: 'The sweet spot for growing local businesses.',
    features: ['50+ platform monitoring', 'Email & SMS alerts', 'Unlimited AI responses', 'Competitor tracking', 'Monthly review reports', '3 business locations', 'Priority support'],
    cta: 'Get Started', popular: true,
  },
  {
    name: 'Visibility', price: '$59', period: '/mo',
    description: 'Dominate local search with AI-powered optimization.',
    features: ['Everything in Growth', 'AI search visibility tools', 'ChatGPT/Gemini monitoring', 'White-label reports', 'API access', '10 business locations', 'Dedicated account manager'],
    cta: 'Get Started', popular: false,
  },
]

function CheckIcon({ color = 'teal' }: { color?: 'teal' | 'white' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className={`w-4 h-4 flex-shrink-0 ${color === 'white' ? 'text-orange' : 'text-teal'}`}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  )
}

export default async function HomePage() {
  const sections = await getPageSections()
  const hero = getSectionByName(sections, 'Hero') ?? FALLBACK_HERO
  const problem = getSectionByName(sections, 'Problem') ?? FALLBACK_PROBLEM
  const featureSections = getSectionsByPrefix(sections, 'Feature')
  const features = featureSections.length >= 4 ? featureSections : FALLBACK_FEATURES
  const cta = getSectionByName(sections, 'CTA') ?? FALLBACK_CTA

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-navy">RepSignal</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-subtle transition-colors hover:text-navy">Features</a>
            <a href="#pricing" className="text-sm font-medium text-subtle transition-colors hover:text-navy">Pricing</a>
            <a href="#how" className="text-sm font-medium text-subtle transition-colors hover:text-navy">How it works</a>
          </nav>

          <a href="#waitlist" className="btn-primary text-sm">Join Waitlist</a>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="bg-hero-gradient px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left */}
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                    AI Reputation Management
                  </span>
                </div>
                <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
                  {hero.content || 'Your reputation is your revenue.'}
                </h1>
                <p className="mb-10 text-base leading-relaxed text-white/75 sm:text-lg max-w-xl">
                  {hero.subtitle || 'RepSignal monitors every review across Google, Yelp, and 50+ platforms — then drafts AI responses in seconds.'}
                </p>
                <div id="waitlist" className="flex flex-col gap-3 sm:flex-row max-w-md">
                  <WaitlistForm dark />
                </div>
                <p className="mt-4 text-xs text-white/50">Free during beta · No credit card · Cancel any time</p>
              </div>

              {/* Right — mock dashboard */}
              <div className="hidden lg:block">
                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Review Feed</p>
                    <span className="rounded-full bg-teal/30 px-2.5 py-0.5 text-xs font-medium text-teal-light">Live</span>
                  </div>
                  {[
                    { stars: 5, text: 'Best gym in the area! Staff is amazing.', platform: 'Google', time: '2m ago', sentiment: 'Positive' },
                    { stars: 2, text: 'Wait times have been really long lately.', platform: 'Yelp', time: '14m ago', sentiment: 'Negative' },
                    { stars: 4, text: 'Great equipment, clean facility overall.', platform: 'Facebook', time: '1h ago', sentiment: 'Positive' },
                  ].map((r, i) => (
                    <div key={i} className="mb-3 rounded-xl border border-white/10 bg-white/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-xs font-semibold text-white/60">{r.platform}</span>
                            <span className="text-yellow-400 text-xs">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                            <span className="text-xs text-white/40">{r.time}</span>
                          </div>
                          <p className="text-sm text-white/80">{r.text}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${r.sentiment === 'Positive' ? 'bg-teal/20 text-teal-light' : 'bg-red-500/20 text-red-300'}`}>
                          {r.sentiment}
                        </span>
                      </div>
                      {r.sentiment === 'Negative' && (
                        <div className="mt-3 rounded-lg border border-orange/20 bg-orange/10 p-3">
                          <p className="text-xs text-white/70 italic">"Thank you for the feedback — we're actively working on reducing wait times and would love to make this right…"</p>
                          <p className="mt-1 text-xs font-medium text-orange">AI Draft · Awaiting approval</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-12">
              {[
                { stat: '27M', label: 'SMBs in North America' },
                { stat: '94%', label: 'of buyers read reviews first' },
                { stat: '$35', label: 'average monthly plan' },
              ].map((s) => (
                <div key={s.stat} className="text-center">
                  <p className="text-3xl font-bold text-white sm:text-4xl">{s.stat}</p>
                  <p className="mt-1 text-sm text-white/55">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem ── */}
        <section className="bg-surface px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="section-label mb-6 inline-block">The Problem</span>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-navy text-balance sm:text-4xl md:text-5xl">
              {problem.content}
            </h2>
            <p className="mx-auto mb-14 max-w-2xl text-base leading-relaxed text-subtle sm:text-lg">
              {problem.subtitle}
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { stat: '94%', label: 'of consumers read reviews before visiting a business' },
                { stat: '53%', label: 'expect a reply to a negative review within 7 days' },
                { stat: '3.3×', label: 'more revenue for businesses with 4+ star ratings' },
              ].map((item) => (
                <div key={item.stat} className="card text-center">
                  <p className="mb-2 text-4xl font-bold text-navy">{item.stat}</p>
                  <p className="text-sm leading-relaxed text-subtle">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="section-label mb-6 inline-block">Features</span>
              <h2 className="text-3xl font-bold tracking-tight text-navy text-balance sm:text-4xl md:text-5xl">
                Everything you need to own your reputation
              </h2>
              <p className="mt-4 text-subtle max-w-xl mx-auto">One dashboard. Every review. Zero headaches.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.slice(0, 4).map((feature, i) => (
                <div key={feature.id} className="card group">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy ring-1 ring-navy/10 transition-colors group-hover:bg-teal/10 group-hover:text-teal group-hover:ring-teal/20">
                    {featureIcons[i]}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-navy">{feature.content}</h3>
                  <p className="text-sm leading-relaxed text-subtle">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="bg-surface px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="section-label mb-6 inline-block">How It Works</span>
              <h2 className="text-3xl font-bold tracking-tight text-navy text-balance sm:text-4xl">
                Up and running in minutes
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Connect your profiles', desc: 'Link Google, Yelp, and Facebook in one click with OAuth.' },
                { num: '02', title: 'Calibrate your voice', desc: 'Answer 5 quick questions so AI responses sound like you, not a bot.' },
                { num: '03', title: 'Get alerted instantly', desc: 'Receive SMS or email the moment a new review comes in.' },
                { num: '04', title: 'Approve & publish', desc: 'Review your AI-drafted response and publish with one tap.' },
              ].map((step) => (
                <div key={step.num} className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-gradient text-white font-bold text-sm shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-navy">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-subtle">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="section-label mb-6 inline-block">Pricing</span>
              <h2 className="text-3xl font-bold tracking-tight text-navy text-balance sm:text-4xl md:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-subtle">No contracts. No hidden fees. Cancel any time.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div key={tier.name} className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                  tier.popular
                    ? 'bg-navy text-white shadow-2xl shadow-navy/30 scale-[1.02]'
                    : 'bg-white border border-border shadow-card hover:shadow-card-hover'
                }`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-orange px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <p className={`mb-1 text-sm font-semibold ${tier.popular ? 'text-white/60' : 'text-subtle'}`}>{tier.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-bold ${tier.popular ? 'text-white' : 'text-navy'}`}>{tier.price}</span>
                      <span className={tier.popular ? 'text-white/60' : 'text-subtle'}>{tier.period}</span>
                    </div>
                    <p className={`mt-3 text-sm leading-relaxed ${tier.popular ? 'text-white/70' : 'text-muted'}`}>{tier.description}</p>
                  </div>
                  <ul className="mb-8 flex flex-col gap-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckIcon color={tier.popular ? 'white' : 'teal'} />
                        <span className={tier.popular ? 'text-white/80' : 'text-subtle'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <a href="#waitlist" className={`block w-full rounded-full px-5 py-3 text-center text-sm font-bold transition-all duration-200 active:scale-95 ${
                      tier.popular
                        ? 'bg-orange text-navy hover:bg-orange-dark'
                        : 'bg-navy text-white hover:bg-navy-light'
                    }`}>
                      {tier.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-teal-gradient px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
              Get Early Access
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
              {cta.content || 'Start free. No credit card.'}
            </h2>
            <p className="mb-10 text-base leading-relaxed text-white/75 sm:text-lg">
              {cta.subtitle || 'Join the waitlist and get early access when we launch.'}
            </p>
            <div className="mx-auto max-w-md">
              <WaitlistForm dark />
            </div>
            <p className="mt-4 text-xs text-white/50">Free during beta · No spam · Unsubscribe any time</p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-navy">RepSignal</span>
          </div>
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} RepSignal. All rights reserved.</p>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted transition-colors hover:text-navy">Privacy</a>
            <a href="#" className="text-xs text-muted transition-colors hover:text-navy">Terms</a>
            <a href="mailto:hello@repsignal.com" className="text-xs text-muted transition-colors hover:text-navy">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
