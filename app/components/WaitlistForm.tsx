'use client'

export default function WaitlistForm() {
  return (
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
  )
}
