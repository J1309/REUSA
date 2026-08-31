import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats, testimonials, usd } from '../data.js'
import { useListings, useListingTypes } from '../store.js'
import { Img, Reveal, Counter, Stars, PropertyCard, btnPrimary, btnMoss, btnWhite, btnGhost, btn } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ *
 * 1. Hero Section (Inspired by Terris Reference)
 * ------------------------------------------------------------------ */
function Hero() {
  const bg = useRef(null)
  const copy = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle smooth parallax drift
      gsap.to(bg.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(copy.current, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: '55% top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-[96svh] overflow-hidden bg-ink pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 flex items-center">
      {/* Background Photography with Terris-style architectural vertical greenery */}
      <div ref={bg} className="absolute inset-0 -bottom-[14%] pointer-events-none">
        <img
          src="/images/showcase/showcase-02.webp"
          alt="Architectural green tower residence"
          fetchPriority="high"
          className="size-full object-cover object-top scale-105 transition-transform duration-[2.5s]"
        />
        {/* Rich Atmospheric Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
      </div>

      <div ref={copy} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] items-end">
          {/* Left Column: Terris-style Headline & Dual CTAs */}
          <div className="max-w-2xl text-white">
            {/* Slash Eyebrow */}
            <div className="mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-white/70">
                / WELCOME TO REALTOR LG
              </span>
            </div>

            {/* Giant Clean Modern Headline */}
            <h1 className="font-modern font-bold text-[clamp(2.8rem,6.8vw,5.4rem)] leading-[1.02] tracking-tight text-white">
              Your Property.
              <br />
              Your Brand. Your Story.
            </h1>

            {/* Refined Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/80 max-w-xl font-normal">
              Welcome to Realtor LG—modern architectural residences crafted for comfort, style, and effortless luxury living.
            </p>

            {/* Dual Button Group (Terris Deep Olive Pill + Solid White Pill) */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5">
              <Link
                to="/listings"
                className={`${btnMoss} px-7 min-h-12 text-sm font-semibold tracking-wide shadow-xl hover:shadow-moss/30`}
              >
                Explore Residences
              </Link>
              <a
                href="#consultation"
                className={`${btnWhite} px-7 min-h-12 text-sm font-semibold tracking-wide shadow-xl`}
              >
                Schedule a Tour
              </a>
            </div>
          </div>

          {/* Right Column: Floating Micro-Showcase Card with Intimate Media Frame */}
          <div className="hidden lg:block">
            <div className="rounded-[2.2rem] border border-white/20 bg-ink/80 p-5 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] text-white max-w-md ml-auto">
              <p className="text-xs leading-relaxed text-white/80 font-normal px-2 pt-1 pb-4">
                A boutique brokerage built for modern intentional living—elevated, intimate, and timeless.
              </p>

              {/* Inner Media Frame with cozy suite photo + play overlay badge */}
              <Link
                to="/listings/001"
                className="group relative block aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src="/images/showcase/showcase-06.webp"
                  alt="Curated interior suite"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Central Frosted Play/Explore Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <svg className="size-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium">The Garden House Suite</span>
                  <span className="text-accent font-mono">$2,450,000</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 2. Three-Card Feature Showcase Row (Amenities, Floor Plans, Neighbourhood)
 * ------------------------------------------------------------------ */
const showcaseCards = [
  {
    title: 'Amenities',
    tag: 'Curated Spaces',
    image: '/images/showcase/showcase-04.webp',
    link: '/listings',
    description: 'Light-filled lounges, private courtyards, and wellness sanctuaries.',
  },
  {
    title: 'Floor Plans',
    tag: 'Architectural Specs',
    image: '/images/showcase/showcase-01.webp',
    link: '/listings',
    description: 'Tailored living layouts with double-height volume and natural stone.',
  },
  {
    title: 'Neighbourhood',
    tag: 'Community Culture',
    image: '/images/showcase/showcase-07.webp',
    link: '/about',
    description: 'Walkable village streets, artisan coffee, and protected parklands.',
  },
]

function FeatureShowcaseRow() {
  return (
    <section className="bg-sand py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseCards.map((card, i) => (
            <Link
              key={card.title}
              to={card.link}
              className="group relative overflow-hidden rounded-[2rem] border border-stone/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl block aspect-[4/4.5] sm:aspect-[4/4.8]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="size-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Bottom Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

              {/* Card Bottom Meta */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-mono">
                    {card.tag}
                  </span>
                  <h3 className="font-modern font-bold text-2xl sm:text-3xl text-white mt-0.5">
                    {card.title}
                  </h3>
                </div>

                {/* Circular White Arrow Badge */}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-moss group-hover:text-white">
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 3. Editorial Story Section ("Crafted with Intention. Designed to Belong.")
 * ------------------------------------------------------------------ */
function CraftedWithIntention() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-28 border-y border-stone/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column: Warm Lifestyle Photo Container */}
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-stone/80 bg-stone/20 shadow-md aspect-[4/3.2] sm:aspect-[4/3]">
              <img
                src="/images/showcase/showcase-05.webp"
                alt="Couple enjoying sunlit residence"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </Reveal>

          {/* Right Column: Editorial Narrative matching Terris */}
          <Reveal className="lg:pl-6">
            <div className="mb-3">
              <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-sea font-semibold">
                / ABOUT REALTOR LG
              </span>
            </div>

            <h2 className="font-modern font-bold text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.08] text-ink tracking-tight">
              Crafted with Intention.
              <br />
              Designed to Belong.
            </h2>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted font-normal">
              Designed for those who value balance, flow, and everyday ease. Every square foot is vetted for natural light, tactile materiality, and spatial harmony. Whether you're unwinding after a long day or hosting friends for dinner, this space is built to support the rhythm of modern living—calm, intuitive, and beautifully functional.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/about"
                className={`${btnMoss} px-7 min-h-12 text-sm font-semibold tracking-wide shadow-md`}
              >
                Our Philosophy
              </Link>
              <Link
                to="/listings"
                className="text-sm font-semibold text-ink hover:text-sea transition-colors underline-offset-4 hover:underline"
              >
                View Selected Residences →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 4. Search & Filter Bar Console
 * ------------------------------------------------------------------ */
function SearchBar() {
  const navigate = useNavigate()
  const propertyTypes = useListingTypes()
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    for (const [k, v] of f.entries()) if (v && v !== 'All' && v !== 'Any') params.set(k, v)
    navigate(`/listings?${params}`)
  }

  return (
    <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8">
      <Reveal>
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-3xl border border-stone/80 bg-white p-4 sm:p-5 shadow-[0_20px_50px_-20px_rgba(12,31,28,0.15)] sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
        >
          {/* Location input */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/40 px-4 py-3 border border-stone/60 focus-within:bg-white focus-within:border-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Location</span>
              <input
                name="q"
                placeholder="Montecito, Austin, Naples..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60 font-medium"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/40 px-4 py-3 border border-stone/60 focus-within:bg-white focus-within:border-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Property Type</span>
              <select
                name="type"
                className="w-full bg-transparent text-sm text-ink outline-none cursor-pointer font-medium"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Price */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/40 px-4 py-3 border border-stone/60 focus-within:bg-white focus-within:border-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Price Cap</span>
              <select
                name="max"
                className="w-full bg-transparent text-sm text-ink outline-none cursor-pointer font-medium"
              >
                <option value="Any">No Limit</option>
                <option value="1000000">Under $1,000,000</option>
                <option value="2000000">Under $2,000,000</option>
                <option value="3000000">Under $3,000,000</option>
                <option value="5000000">Under $5,000,000</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button className={`${btnMoss} min-h-12 rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full text-sm font-semibold tracking-wider uppercase`}>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </form>
      </Reveal>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 5. Featured Portfolio Showcase
 * ------------------------------------------------------------------ */
function Featured() {
  const list = useListings()
  const flagged = list.filter((p) => p.featured)
  const featured = (flagged.length ? flagged : list).slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-10">
      <div className="mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">/ ACTIVE PORTFOLIO</span>
          <h2 className="mt-1.5 font-modern font-bold text-[clamp(2rem,4vw,3.2rem)] leading-tight text-ink">
            Featured Residences
          </h2>
        </Reveal>
        <Reveal>
          <Link
            to="/listings"
            className="group inline-flex items-center gap-2 rounded-full border border-stone bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-moss shadow-sm transition-all"
          >
            <span>View All Listings</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>

      <Reveal stagger={0.15} y={40} className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <PropertyCard key={p.id} p={p} priority />
        ))}
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 6. Standards & Proven Statistics
 * ------------------------------------------------------------------ */
function WhyUs() {
  return (
    <section className="bg-ink text-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-semibold">/ BROKERAGE STANDARD</span>
          <h2 className="mt-2 font-modern font-bold text-[clamp(2rem,4vw,3.2rem)] leading-tight">
            Eighteen years, one market at a time.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70">
            We don't run automated high-volume pipelines. Every client works directly with a licensed principal, from initial advisory to the wire confirmation.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="mt-14 sm:mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-white/15 pt-6">
              <Counter to={s.value} suffix={s.suffix} className="font-modern font-bold text-[clamp(2.2rem,5vw,3.6rem)] text-white" />
              <p className="mt-2 text-xs sm:text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 7. Testimonials
 * ------------------------------------------------------------------ */
function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000)
    return () => clearInterval(id)
  }, [])
  const t = testimonials[i]

  return (
    <section className="bg-deep text-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center lg:px-10">
        <Stars n={t.stars} />
        <blockquote key={i} className="mt-8 animate-[fadeIn_0.8s_ease] font-display text-[clamp(1.5rem,3.2vw,2.4rem)] leading-snug">
          “{t.quote}”
        </blockquote>
        <p className="mt-8 text-xs sm:text-sm text-white/60">
          <strong className="text-white">{t.name}</strong> — {t.place}
        </p>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Testimonial ${n + 1}`}
              className="p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  n === i ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 8. Private Consultation CTA
 * ------------------------------------------------------------------ */
function CTA() {
  return (
    <section id="consultation" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28 lg:px-10">
      <Reveal className="overflow-hidden rounded-[2.5rem] bg-white p-8 sm:p-14 text-center shadow-[0_30px_70px_-30px_rgba(12,31,28,0.2)] border border-stone/80 md:p-20">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">/ PRIVATE ADVISORY</span>
        <h2 className="mx-auto mt-2 max-w-2xl font-modern font-bold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
          Tell us what you're looking for.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm sm:text-base text-muted leading-relaxed">
          No automated newsletters, no junior handoffs. One discreet consultation with a principal broker, usually the same day.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <a href="tel:+18005550142" className={`${btnMoss} min-h-12 px-8 text-sm font-semibold shadow-md`}>
            Call +1 (800) 555-0142
          </a>
          <Link to="/about" className={`${btnGhost} text-ink min-h-12 px-8 text-sm font-semibold`}>
            Meet the Principals
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureShowcaseRow />
      <CraftedWithIntention />
      <SearchBar />
      <Featured />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  )
}
