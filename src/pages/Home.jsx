import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats, testimonials, usd } from '../data.js'
import { useListings, useListingTypes } from '../store.js'
import { Img, Reveal, Counter, SplitText, Stars, PropertyCard, btnPrimary, btnGhost, btn } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

const heroSlides = [
  {
    src: '/images/hero/hero-01.webp',
    title: 'The Garden Residence',
    location: 'Montecito, California',
    price: 2450000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    tag: 'Architectural Villa',
    id: '001',
  },
  {
    src: '/images/hero/hero-02.webp',
    title: 'Coastal Villa No. 3',
    location: 'Naples, Florida',
    price: 4750000,
    beds: 5,
    baths: 5,
    sqft: 5200,
    tag: 'Waterfront Estate',
    id: '003',
  },
]

function Hero() {
  const [slide, setSlide] = useState(0)
  const bg = useRef(null)
  const copy = useRef(null)
  const current = heroSlides[slide]

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 7000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: background drifts slower than the page, copy fades out
      gsap.to(bg.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(copy.current, {
        opacity: 0,
        y: -35,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: '60% top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-[85svh] sm:min-h-[92svh] overflow-hidden bg-ink pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      {/* Background Photography with Scrim */}
      <div ref={bg} className="absolute inset-0 -bottom-[16%] pointer-events-none">
        {heroSlides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className={`absolute inset-0 size-full object-cover transition-all duration-[2.2s] ease-out ${
              i === slide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        {/* Multilayered Luxury Lighting Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      <div ref={copy} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-full flex flex-col justify-between">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="max-w-2xl text-sand">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-sand/15 bg-sand/10 px-3 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-sand/80">
                Realtor LG Private Office · Est. 2008
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.1rem,6vw,4.8rem)] leading-[1.02] tracking-tight text-sand">
              <SplitText text="Architectural homes," />
              <br />
              <SplitText text="curated with intention." delay={0.2} className="italic text-accent" />
            </h1>

            <Reveal delay={0.4} className="mt-5 sm:mt-7 text-sm sm:text-lg leading-relaxed text-sand/75 max-w-xl">
              <p>
                We represent fewer than thirty residences a year across premier American enclaves. Every client works directly with a licensed principal from first inspection to close.
              </p>
            </Reveal>

            <Reveal delay={0.6} stagger={0.1} className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/listings"
                className={`${btnPrimary} bg-sand text-ink hover:bg-accent shadow-lg hover:shadow-accent/20 w-full sm:w-auto`}
              >
                Explore Portfolio
              </Link>
              <a href="#contact" className={`${btnGhost} text-sand backdrop-blur-sm border-sand/25 hover:bg-sand/10 w-full sm:w-auto text-center`}>
                Schedule Consultation
              </a>
            </Reveal>

            {/* Authority Benchmark Bar */}
            <Reveal delay={0.8} className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-sand/15 grid grid-cols-3 gap-3 sm:gap-6 text-sand/80">
              <div>
                <p className="font-display text-xl sm:text-3xl text-sand">$520M+</p>
                <p className="text-[10px] sm:text-[11px] text-sand/50 uppercase tracking-wider mt-0.5">Closed</p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-3xl text-accent">98%</p>
                <p className="text-[10px] sm:text-[11px] text-sand/50 uppercase tracking-wider mt-0.5">List/Sale</p>
              </div>
              <div>
                <p className="font-display text-xl sm:text-3xl text-sand">6 States</p>
                <p className="text-[10px] sm:text-[11px] text-sand/50 uppercase tracking-wider mt-0.5">Principals</p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Floating Curated Spotlight Showcase Card */}
          <div className="hidden lg:block">
            <Reveal delay={0.3}>
              <div className="rounded-[2.5rem] border border-sand/20 bg-ink/75 p-6 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] text-sand">
                <div className="flex items-center justify-between border-b border-sand/15 pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                    Residence Spotlight
                  </span>
                  <span className="rounded-full bg-sand/10 px-2.5 py-0.5 text-[10px] text-sand/70">
                    {current.tag}
                  </span>
                </div>

                <div className="mt-5 relative aspect-[16/10] overflow-hidden rounded-2xl border border-sand/10 bg-sand/5">
                  <img
                    src={current.src}
                    alt={current.title}
                    className="size-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-baseline justify-between text-sand">
                    <div>
                      <p className="font-display text-xl">{current.title}</p>
                      <p className="text-xs text-sand/70">{current.location}</p>
                    </div>
                    <p className="font-display text-lg text-accent">{usd(current.price)}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-sand/15 pt-4 text-xs text-sand/70">
                  <div className="flex gap-4">
                    <span><strong>{current.beds}</strong> bd</span>
                    <span>•</span>
                    <span><strong>{current.baths}</strong> ba</span>
                    <span>•</span>
                    <span><strong>{current.sqft.toLocaleString('en-US')}</strong> sqft</span>
                  </div>

                  <Link
                    to={`/listings/${current.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-accent hover:text-sand transition-colors"
                  >
                    <span>View details</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Slide Switcher Controls */}
                <div className="mt-5 flex items-center justify-between border-t border-sand/10 pt-4">
                  <div className="flex gap-2">
                    {heroSlides.map((s, i) => (
                      <button
                        key={s.title}
                        onClick={() => setSlide(i)}
                        className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                          i === slide ? 'bg-sand text-ink shadow' : 'bg-sand/10 text-sand/60 hover:text-sand'
                        }`}
                      >
                        0{i + 1}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] text-sand/40">Auto-cycling showcase</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

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
    <div className="relative z-20 mx-auto -mt-8 sm:-mt-14 max-w-6xl px-4 sm:px-6 lg:px-10">
      <Reveal>
        <form
          onSubmit={submit}
          className="grid gap-2.5 sm:gap-3 rounded-3xl border border-stone/80 bg-white/95 p-3.5 sm:p-4 shadow-[0_30px_70px_-25px_rgba(12,31,28,0.25)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
        >
          {/* Location input */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/30 px-3.5 py-2.5 border border-stone/50 focus-within:bg-white focus-within:border-sea focus-within:ring-1 focus-within:ring-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Location</span>
              <input
                name="q"
                placeholder="City, state, or enclave..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/30 px-3.5 py-2.5 border border-stone/50 focus-within:bg-white focus-within:border-sea focus-within:ring-1 focus-within:ring-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Property Type</span>
              <select
                name="type"
                className="w-full bg-transparent text-sm text-ink outline-none cursor-pointer"
              >
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Price */}
          <div className="flex items-center gap-3 rounded-2xl bg-sand/30 px-3.5 py-2.5 border border-stone/50 focus-within:bg-white focus-within:border-sea focus-within:ring-1 focus-within:ring-sea transition-all">
            <svg className="size-5 text-sea shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Budget Cap</span>
              <select
                name="max"
                className="w-full bg-transparent text-sm text-ink outline-none cursor-pointer"
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
          <button className={`${btnPrimary} h-full min-h-12 rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full`}>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Portfolio
          </button>
        </form>
      </Reveal>
    </div>
  )
}

function Featured() {
  const list = useListings()
  const flagged = list.filter((p) => p.featured)
  const featured = (flagged.length ? flagged : list).slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28 lg:px-10">
      <div className="mb-8 sm:mb-12 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Curated Portfolio</span>
          <h2 className="mt-1 font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-ink">
            Premier Featured Residences
          </h2>
        </Reveal>
        <Reveal>
          <Link
            to="/listings"
            className="group inline-flex items-center gap-2 rounded-full border border-stone bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-accent shadow-sm transition-all"
          >
            <span>View all listings</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>

      <Reveal stagger={0.15} y={50} className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <PropertyCard key={p.id} p={p} priority />
        ))}
      </Reveal>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="bg-ink text-sand py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">The Brokerage Standard</span>
          <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-tight">
            Eighteen years, one market at a time.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-sand/65">
            We don't run automated high-volume pipelines. Every client works directly with a licensed principal, from initial advisory to the wire confirmation.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="mt-10 sm:mt-16 grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-sand/15 pt-5 sm:pt-6">
              <Counter to={s.value} suffix={s.suffix} className="font-display text-[clamp(2rem,5vw,3.6rem)] text-sand" />
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-sand/50">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const lifestyle = [
  { src: '/images/lifestyle/lifestyle-park-01.webp', title: 'The Parklands', copy: 'Twelve acres of preserved green, open until dusk.' },
  { src: '/images/lifestyle/lifestyle-school-01.webp', title: 'The School Catchments', copy: 'Top-tier district enrollment metrics on every listing.' },
  { src: '/images/lifestyle/lifestyle-cafe-01.webp', title: 'The Neighborhood Culture', copy: 'Artisan cafes, fresh grocers, and walkable village streets.' },
]

function Neighborhood() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28 lg:px-10">
      <Reveal className="mb-8 sm:mb-12 max-w-xl">
        <span className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Community Context</span>
        <h2 className="mt-1 font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-tight text-ink">
          You buy a neighborhood, not just a floor plan.
        </h2>
      </Reveal>

      <Reveal stagger={0.15} y={50} className="grid gap-6 sm:gap-7 sm:grid-cols-2 md:grid-cols-3">
        {lifestyle.map((l) => (
          <figure key={l.src} className="group overflow-hidden rounded-3xl border border-stone/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md">
            <div className="overflow-hidden rounded-2xl aspect-[4/5]">
              <Img
                src={l.src}
                alt={l.title}
                wrapClass="size-full"
                className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
              />
            </div>
            <figcaption className="p-3.5 pt-4">
              <h3 className="font-display text-lg sm:text-xl text-ink">{l.title}</h3>
              <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">{l.copy}</p>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  )
}

function Testimonials() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000)
    return () => clearInterval(id)
  }, [])
  const t = testimonials[i]

  return (
    <section className="bg-deep text-sand py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center lg:px-10">
        <Stars n={t.stars} />
        <blockquote key={i} className="mt-6 sm:mt-8 animate-[fadeIn_0.8s_ease] font-display text-[clamp(1.35rem,3.2vw,2.4rem)] leading-snug">
          “{t.quote}”
        </blockquote>
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-sand/60">
          <strong className="text-sand">{t.name}</strong> — {t.place}
        </p>
        <div className="mt-6 sm:mt-8 flex justify-center gap-2">
          {testimonials.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Testimonial ${n + 1}`}
              className="p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  n === i ? 'w-8 bg-sand' : 'w-2 bg-sand/30 hover:bg-sand/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28 lg:px-10">
      <Reveal className="overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white p-6 sm:p-12 text-center shadow-[0_30px_70px_-30px_rgba(12,31,28,0.25)] border border-stone/80 md:p-20">
        <span className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Private Advisory</span>
        <h2 className="mx-auto mt-2 max-w-2xl font-display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-tight text-ink">
          Tell us what you're looking for.
        </h2>
        <p className="mx-auto mt-4 sm:mt-5 max-w-md text-xs sm:text-base text-muted leading-relaxed">
          No automated newsletters, no junior handoffs. One discreet consultation with a principal broker, usually the same day.
        </p>
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row justify-center gap-3 sm:gap-3.5">
          <a href="tel:+18005550142" className={`${btnPrimary} shadow-md`}>
            Call +1 (800) 555-0142
          </a>
          <Link to="/about" className={`${btnGhost} text-ink`}>
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
      <SearchBar />
      <Featured />
      <WhyUs />
      <Neighborhood />
      <Testimonials />
      <CTA />
    </>
  )
}
