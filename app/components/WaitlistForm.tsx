'use client'

export default function WaitlistForm({ dark = false }: { dark?: boolean }) {
  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        required
        aria-label="Email address"
        className={`flex-1 rounded-full px-5 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
          dark
            ? 'bg-white/15 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:ring-white/20'
            : 'bg-white border border-border text-gray-900 placeholder-gray-400 focus:border-teal focus:ring-teal/20'
        }`}
      />
      <button
        type="submit"
        className="btn-orange whitespace-nowrap"
      >
        Join Waitlist
      </button>
    </form>
  )
}
