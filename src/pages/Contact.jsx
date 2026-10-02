import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, btnMoss, btnGhost, btnWhite } from '../ui.jsx'

const serviceTypes = [
  'Buying a Home',
  'Selling a Property',
  'Commercial Real Estate',
  'Investment Advisory',
  'Rental & Tenant Placement',
  'Landlord Representation',
]

const timelines = [
  'Immediately (0–30 days)',
  '1–3 Months',
  '3–6 Months',
  '6–12 Months',
  'Just Exploring',
]

const budgetRanges = [
  'Under $500,000',
  '$500,000 – $1,000,000',
  '$1,000,000 – $2,500,000',
  '$2,500,000 – $5,000,000',
  '$5,000,000+',
  'Commercial / Investment Portfolio',
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Buying a Home',
    timeline: '1–3 Months',
    budget: '$500,000 – $1,000,000',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg('Please complete all required fields (*).')
      return
    }
    setErrorMsg('')
    setIsSubmitting(true)

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 800)
  }

  return (
    <>
      {/* 1. Header Section */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 pt-28 sm:pt-36 lg:pt-40 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">
              / DIRECT INQUIRY & CONSULTATION
            </span>
          </div>

          <h1 className="font-modern font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] text-ink tracking-tight">
            Connect Directly with{' '}
            <span className="font-serif italic font-normal text-sea block sm:inline">
              Lijo George.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-muted font-normal max-w-2xl leading-relaxed">
            Personalized guidance for residential, commercial, investment, and rental transactions across Pennsylvania. Licensed Realtor since 2005 with over $25M+ sold.
          </p>
        </Reveal>
      </header>

      {/* 2. Main Contact Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 sm:pb-28 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] items-start">
          {/* Left Column: Direct Credentials & Immediate Contact Channels */}
          <Reveal className="space-y-6">
            {/* Primary Phone Highlight Card */}
            <div className="relative overflow-hidden rounded-[2.2rem] bg-ink p-8 text-sand shadow-xl">
              <div className="relative z-10">
                <span className="text-xs font-mono uppercase tracking-[0.22em] text-accent font-semibold">
                  Direct Line · Call or Text
                </span>
                <p className="mt-3 font-modern font-bold text-3xl sm:text-4xl text-white tracking-tight">
                  +1 (215) 776-7940
                </p>
                <p className="mt-3 text-sm text-sand/75 leading-relaxed">
                  Connect with Lijo George directly. Available Monday through Saturday for urgent inquiries, private showings, or strategic market evaluations.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="tel:+12157767940"
                    className={`${btnWhite} min-h-11 px-6 text-xs font-semibold shadow-md`}
                  >
                    Call Now
                  </a>
                  <a
                    href="sms:+12157767940"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-sand/30 px-5 text-xs font-semibold text-sand hover:bg-white/10 transition-colors"
                  >
                    Send Text Message
                  </a>
                </div>
              </div>

              {/* Decorative subtle ambient backdrop glow */}
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-60 rounded-full bg-sea/25 blur-3xl" />
            </div>

            {/* Direct Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
                <div className="size-10 rounded-2xl bg-sand/80 flex items-center justify-center text-moss font-bold mb-3">
                  ✉
                </div>
                <h3 className="font-modern font-semibold text-base text-ink">Email Inquiries</h3>
                <a
                  href="mailto:hello@realtorlg.com"
                  className="mt-1 block text-sm font-medium text-sea hover:underline"
                >
                  hello@realtorlg.com
                </a>
                <p className="mt-2 text-xs text-muted">
                  Expect a personal reply within 24 business hours.
                </p>
              </div>

              <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
                <div className="size-10 rounded-2xl bg-sand/80 flex items-center justify-center text-moss font-bold mb-3">
                  ⚲
                </div>
                <h3 className="font-modern font-semibold text-base text-ink">Service Territory</h3>
                <p className="mt-1 text-sm font-medium text-ink">
                  Pennsylvania Statewide
                </p>
                <p className="mt-2 text-xs text-muted">
                  Specializing in Greater Philadelphia, Bucks, Montgomery, Chester, and surrounding regions.
                </p>
              </div>
            </div>

            {/* Fiduciary Guarantee Box */}
            <div className="rounded-3xl border border-stone/80 bg-sand/40 p-6 sm:p-7">
              <h4 className="font-modern font-semibold text-ink text-sm sm:text-base">
                Why Work Directly With Lijo George?
              </h4>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-moss font-bold">✓</span>
                  <span><strong>20+ Years in Pennsylvania Real Estate:</strong> Continuous licensed service since 2005.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-moss font-bold">✓</span>
                  <span><strong>$25M+ in Closed Volume:</strong> Deep transactional mastery across shifting markets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-moss font-bold">✓</span>
                  <span><strong>No Junior Handoffs:</strong> You deal directly with the principal owner on every single phase.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-moss font-bold">✓</span>
                  <span><strong>Comprehensive Scope:</strong> Residential, Commercial, Investment Advisory, and Rentals.</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Right Column: Interactive Consultation Inquiry Form */}
          <Reveal>
            <div className="rounded-[2.2rem] border border-stone/80 bg-white p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(12,31,28,0.08)]">
              {isSubmitted ? (
                <div className="py-12 text-center animate-[fadeIn_0.4s_ease]">
                  <div className="mx-auto size-16 rounded-full bg-sand flex items-center justify-center text-moss text-2xl font-bold mb-4">
                    ✓
                  </div>
                  <h3 className="font-modern font-bold text-2xl text-ink">
                    Consultation Request Received
                  </h3>
                  <p className="mt-3 text-sm text-muted max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-ink">{formData.name}</strong>. Lijo George will personally review your requirements and reach out to you directly at <strong className="text-ink">{formData.phone}</strong> or <strong className="text-ink">{formData.email}</strong> within 24 hours.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          service: 'Buying a Home',
                          timeline: '1–3 Months',
                          budget: '$500,000 – $1,000,000',
                          message: '',
                        })
                      }}
                      className={`${btnMoss} text-xs font-semibold px-6 min-h-11`}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-modern font-bold text-2xl text-ink">
                      Schedule a Private Consultation
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted">
                      Complete this form or call directly at <a href="tel:+12157767940" className="text-sea font-semibold hover:underline">+1 (215) 776-7940</a>.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-sea focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (215) 000-0000"
                        className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-sea focus:bg-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-sea focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Service Type Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                      Primary Service Needed
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {serviceTypes.map((item) => {
                        const selected = formData.service === item
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => setFormData((p) => ({ ...p, service: item }))}
                            className={`rounded-xl border px-3 py-2.5 text-xs font-medium text-left transition-all ${
                              selected
                                ? 'border-moss bg-moss text-white shadow-sm'
                                : 'border-stone/80 bg-white text-ink hover:border-sea hover:bg-sand/30'
                            }`}
                          >
                            {item}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Timeline & Budget Dropdowns */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                        Anticipated Timeline
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink focus:border-sea focus:bg-white focus:outline-none transition-colors cursor-pointer"
                      >
                        {timelines.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                        Target Price Range / Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink focus:border-sea focus:bg-white focus:outline-none transition-colors cursor-pointer"
                      >
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                      Specific Property Details or Goals (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share any preferred PA neighborhoods, desired square footage, timeline details, or specific property links..."
                      className="w-full rounded-xl border border-stone bg-sand/20 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-sea focus:bg-white focus:outline-none transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${btnMoss} w-full min-h-12 text-sm font-semibold tracking-wide uppercase shadow-md transition-all ${
                      isSubmitting ? 'opacity-70 cursor-wait' : ''
                    }`}
                  >
                    {isSubmitting ? 'Transmitting Request...' : 'Send Consultation Request'}
                  </button>

                  <p className="text-[11px] text-center text-muted">
                    Your information is strictly private and guarded with absolute fiduciary confidentiality.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Direct Location & Statewide PA Presence Strip */}
      <section className="bg-sand/40 border-t border-stone/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sea font-semibold">
                EXPERTISE 01
              </span>
              <h3 className="mt-2 font-modern font-bold text-lg text-ink">
                Buyers & Sellers
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Strategic comparative market analyses, aggressive marketing campaigns, and seasoned contract negotiation for residential real estate.
              </p>
            </div>

            <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sea font-semibold">
                EXPERTISE 02
              </span>
              <h3 className="mt-2 font-modern font-bold text-lg text-ink">
                Commercial & Industrial
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Representing business owners, operators, and commercial investors in acquisitions, disposition, and commercial leasing across PA.
              </p>
            </div>

            <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sea font-semibold">
                EXPERTISE 03
              </span>
              <h3 className="mt-2 font-modern font-bold text-lg text-ink">
                Investment & Rentals
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Cash-flow modeling, tenant vetting, and property management advisory for investors expanding their United States real estate wealth.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
