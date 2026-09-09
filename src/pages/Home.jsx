import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats, testimonials, usd } from '../data.js'
import { useListings, useListingTypes } from '../store.js'
import { Img, Reveal, Counter, Stars, PropertyCard, btnPrimary, btnMoss, btnWhite, btnGhost, btn } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ *
 * 1. Centered Dusk Estate Hero Section (Inspired by Reference Design)
 * ------------------------------------------------------------------ */
const heroTabs = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'sell', label: 'Sell' },
  { id: 'private', label: 'Private Treaty' },
  { id: 'sold', label: 'Just Sold' },
  { id: 'value', label: 'Home Value' },
]

function Hero() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('buy')
  const [query, setQuery] = useState('')
  const bg = useRef(null)
  const content = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle cinematic parallax on scroll
      gsap.to(bg.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(content.current, {
        opacity: 0,
        y: -35,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: '60% top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (activeTab === 'rent') params.set('type', 'Condo')
    navigate(`/listings?${params.toString()}`)
  }

  const quickPills = ['Montecito, CA', 'Austin, TX', 'Naples, FL', '4+ Beds', 'Waterfront', 'Under $3M']

  return (
    <section className="relative min-h-[64svh] sm:min-h-[70svh] lg:min-h-[74svh] overflow-hidden bg-ink pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16 flex items-center justify-center">
      {/* High-Resolution Architectural Video Background (Untinted & Crisp) */}
      <div ref={bg} className="absolute inset-0 -bottom-[10%] pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/hero-custom.webp"
          className="size-full object-cover object-center scale-105"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div ref={content} className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full text-center text-white z-10">
        {/* Headline with thin, refined luxury typography */}
        <div className="animate-[fadeIn_0.8s_ease]">
          <span className="block font-serif italic font-light text-xl sm:text-3xl md:text-4xl text-accent drop-shadow-md tracking-wide">
            Your Sanctuary. Your Legacy.
          </span>
          <h1 className="mt-1.5 font-modern font-light text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.06] tracking-tight text-white drop-shadow-md">
            Your Property. Your Brand. Your Story.
          </h1>
        </div>

        {/* Interactive Filter Category Tabs */}
        <div className="mt-6 sm:mt-7 flex items-center justify-center gap-1.5 sm:gap-4 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {heroTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-light tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white font-medium'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 inset-x-2 h-0.5 bg-white rounded-full transition-all" />
              )}
            </button>
          ))}
        </div>

        {/* Expansive Search Bar Pill Console */}
        <form
          onSubmit={handleSearch}
          className="mt-3.5 sm:mt-4 mx-auto max-w-3xl rounded-full bg-white/95 p-1.5 sm:p-2 pl-5 sm:pl-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl border border-white/80 flex items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-white/30"
        >
          {/* Location Icon */}
          <svg className="size-5 text-muted shrink-0 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          {/* Search Input */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Address, neighborhood, city, or ZIP..."
            className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-muted/70 outline-none font-normal"
          />

          {/* Clear button if typed */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-muted hover:text-ink px-1"
            >
              ✕
            </button>
          )}

          {/* Vibrant High-Contrast Search Action Button */}
          <button
            type="submit"
            className="rounded-full bg-[#d9222a] hover:bg-[#bd181f] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Search</span>
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-white/60 text-[11px] uppercase tracking-wider font-medium mr-1">Trending:</span>
          {quickPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => {
                setQuery(pill)
                const params = new URLSearchParams()
                params.set('q', pill)
                navigate(`/listings?${params.toString()}`)
              }}
              className="rounded-full bg-black/30 hover:bg-white/20 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-normal text-white/90 transition-all hover:scale-105"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Trust footnote */}
        <p className="mt-4 sm:mt-5 text-[11px] text-white/50 tracking-wide font-light">
          *Based on proprietary transaction fidelity and independent 2025 national client satisfaction index.
        </p>
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
          {showcaseCards.map((card) => (
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
 * Full-Sized Square-Edged Image to the Right
 * ------------------------------------------------------------------ */
function CraftedWithIntention() {
  return (
    <section className="bg-white border-y border-stone/70 overflow-hidden">
      <div className="grid lg:grid-cols-2 items-center">
        {/* Left Column: Editorial Narrative */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-14 sm:py-20 lg:py-24 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
          <Reveal>
            <div className="mb-3">
              <span className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-sea font-semibold">
                / ABOUT REALTOR LG
              </span>
            </div>

            <h2 className="font-modern font-light text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.08] text-ink tracking-tight">
              Crafted with <span className="font-serif italic font-normal text-sea">Intention.</span>
              <br />
              Designed to <span className="font-serif italic font-normal text-sea">Belong.</span>
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

        {/* Right Column: Square-Edged Image with Controlled Height */}
        <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] w-full bg-stone/20 overflow-hidden">
          <img
            src="/images/showcase/showcase-05.webp"
            alt="Couple enjoying sunlit residence"
            className="size-full object-cover rounded-none"
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * 4. Featured Portfolio Showcase
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
 * 5. Standards & Proven Statistics
 * ------------------------------------------------------------------ */
function WhyUs() {
  return (
    <section className="bg-ink text-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-semibold">/ BROKERAGE STANDARD</span>
          <h2 className="mt-2 font-modern font-bold text-[clamp(2rem,4vw,3.2rem)] leading-tight">
            Eighteen years, <span className="font-serif italic font-normal text-accent">one market at a time.</span>
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
 * 6. Testimonials
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
        <blockquote key={i} className="mt-8 animate-[fadeIn_0.8s_ease] font-serif italic text-[clamp(1.6rem,3.4vw,2.6rem)] leading-snug text-sand">
          “{t.quote}”
        </blockquote>
        <p className="mt-8 text-xs sm:text-sm text-white/60">
          <strong className="text-white font-modern font-semibold">{t.name}</strong> — {t.place}
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
 * 7. Private Consultation CTA
 * ------------------------------------------------------------------ */
function CTA() {
  return (
    <section id="consultation" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28 lg:px-10">
      <Reveal className="overflow-hidden rounded-[2.5rem] bg-white p-8 sm:p-14 text-center shadow-[0_30px_70px_-30px_rgba(12,31,28,0.2)] border border-stone/80 md:p-20">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">/ PRIVATE ADVISORY</span>
        <h2 className="mx-auto mt-2 max-w-2xl font-modern font-bold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
          Tell us what you're <span className="font-serif italic font-normal text-sea">looking for.</span>
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
      <Featured />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  )
}
