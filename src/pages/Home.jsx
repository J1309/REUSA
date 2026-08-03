import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// three is ~490kB — decorative only, so it must never block the hero paint.
const ThreeAmbient = lazy(() => import('../ThreeAmbient.jsx'))
import { properties, propertyTypes, stats, testimonials } from '../data.js'
import { Img, Reveal, Counter, SplitText, Stars, PropertyCard, btnPrimary, btnGhost } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

const heroSlides = ['/images/hero/hero-01.webp', '/images/hero/hero-02.webp']

function Hero() {
  const [slide, setSlide] = useState(0)
  const bg = useRef(null)
  const copy = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: background drifts slower than the page, copy fades out.
      gsap.to(bg.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(copy.current, {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: bg.current, start: 'top top', end: '60% top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative h-svh min-h-[620px] overflow-hidden bg-ink">
      <div ref={bg} className="absolute inset-0 -bottom-[18%]">
        {heroSlides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            // Both slides load up front — the second is on screen within 6.5s,
            // and it sits in the viewport from the start, so lazy buys nothing.
            fetchPriority={i === 0 ? 'high' : 'low'}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[2s] ${
              i === slide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
      </div>

      <Suspense fallback={null}>
        <ThreeAmbient />
      </Suspense>

      <div ref={copy} className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-sand/60">Aurelia Estates — Est. 2008</p>
        <h1 className="max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] text-sand">
          <SplitText text="Homes worth" />
          <br />
          <SplitText text="the wait." delay={0.25} className="italic text-accent" />
        </h1>
        <Reveal delay={0.7} className="mt-8 max-w-lg text-lg leading-relaxed text-sand/70">
          <p>
            We list fewer than thirty homes a year, and we know every one of them by heart. Tell us what you're after and
            we'll tell you honestly whether it exists.
          </p>
        </Reveal>
        <Reveal delay={0.9} stagger={0.1} className="mt-10 flex flex-wrap gap-3">
          <Link to="/listings" className={`${btnPrimary} bg-sand text-ink hover:bg-accent`}>
            Browse listings
          </Link>
          <a href="#contact" className={`${btnGhost} text-sand`}>
            Talk to an agent
          </a>
        </Reveal>
      </div>

      {/* Dots are 4px tall but the buttons are padded out to a 44px touch target. */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className="px-1.5 py-5">
            <span
              className={`block h-1 rounded-full transition-all duration-500 ${i === slide ? 'w-8 bg-sand' : 'w-3 bg-sand/40'}`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function SearchBar() {
  const navigate = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const params = new URLSearchParams()
    for (const [k, v] of f.entries()) if (v && v !== 'All' && v !== 'Any') params.set(k, v)
    navigate(`/listings?${params}`)
  }
  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-5xl px-6 lg:px-10">
      <Reveal>
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-2xl bg-white p-4 shadow-[0_30px_60px_-30px_rgba(12,31,28,0.4)] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-[11px] uppercase tracking-widest text-muted">Location</span>
            <input
              name="q"
              placeholder="City or state"
              className="min-h-9 border-b border-transparent bg-transparent text-sm outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-[11px] uppercase tracking-widest text-muted">Type</span>
            <select
              name="type"
              className="min-h-9 border-b border-transparent bg-transparent text-sm outline-none transition-colors focus:border-accent"
            >
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 px-2 py-1">
            <span className="text-[11px] uppercase tracking-widest text-muted">Max price</span>
            <select
              name="max"
              className="min-h-9 border-b border-transparent bg-transparent text-sm outline-none transition-colors focus:border-accent"
            >
              <option>Any</option>
              <option value="1000000">$1M</option>
              <option value="2000000">$2M</option>
              <option value="3000000">$3M</option>
              <option value="5000000">$5M</option>
            </select>
          </label>
          <button className={`${btnPrimary} h-full min-h-11`}>Search</button>
        </form>
      </Reveal>
    </div>
  )
}

function Featured() {
  const featured = properties.filter((p) => p.featured)
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Currently on the market</p>
          <h2 className="max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">
            Three homes we'd buy ourselves
          </h2>
        </Reveal>
        <Reveal>
          <Link to="/listings" className="group inline-flex min-h-11 items-center text-sm font-medium text-sea">
            All listings
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>

      {/* All three load eagerly. They're the point of the page, they sit one
          screen below the hero, and three ~150KB images aren't worth gating
          on a lazy-load heuristic that stalls whenever the tab isn't painting. */}
      <Reveal stagger={0.15} y={60} className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <PropertyCard key={p.id} p={p} priority />
        ))}
      </Reveal>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="bg-ink text-sand">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-sand/40">Why us</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">
            Eighteen years, one market at a time.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-sand/60">
            We don't run volume. Every client works directly with a licensed principal, from the first walkthrough to the
            wire confirmation.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="mt-20 grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-sand/15 pt-6">
              <Counter to={s.value} suffix={s.suffix} className="font-display text-[clamp(2.4rem,5vw,3.6rem)]" />
              <p className="mt-2 text-sm text-sand/50">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const lifestyle = [
  { src: '/images/lifestyle/lifestyle-park-01.webp', title: 'The park', copy: 'Twelve acres, two playgrounds, open until dusk.' },
  { src: '/images/lifestyle/lifestyle-school-01.webp', title: 'The schools', copy: 'Catchment data on every listing, before you ask.' },
  { src: '/images/lifestyle/lifestyle-cafe-01.webp', title: 'The corner', copy: 'The coffee, the grocer, the walk home.' },
]

function Neighborhood() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <Reveal className="mb-14 max-w-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">The other half</p>
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">You buy a street, not a floor plan.</h2>
      </Reveal>

      <Reveal stagger={0.15} y={60} className="grid gap-7 md:grid-cols-3">
        {lifestyle.map((l) => (
          <figure key={l.src} className="group overflow-hidden rounded-2xl">
            <Img
              src={l.src}
              alt={l.title}
              wrapClass="aspect-[4/5]"
              className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            <figcaption className="pt-5">
              <h3 className="font-display text-xl">{l.title}</h3>
              <p className="mt-1 text-sm text-muted">{l.copy}</p>
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
    <section className="bg-deep text-sand">
      <div className="mx-auto max-w-4xl px-6 py-28 text-center lg:px-10">
        <Stars n={t.stars} />
        <blockquote key={i} className="mt-8 animate-[fadeIn_0.8s_ease] font-display text-[clamp(1.5rem,3.2vw,2.4rem)] leading-snug">
          “{t.quote}”
        </blockquote>
        <p className="mt-8 text-sm text-sand/50">
          {t.name} — {t.place}
        </p>
        <div className="mt-6 flex justify-center">
          {testimonials.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Testimonial ${n + 1}`} className="px-1.5 py-4.5">
              <span className={`block h-2 rounded-full transition-all ${n === i ? 'w-6 bg-sand' : 'w-2 bg-sand/30'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <Reveal className="overflow-hidden rounded-3xl bg-white p-10 text-center shadow-[0_30px_70px_-40px_rgba(12,31,28,0.5)] md:p-20">
        <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-tight">
          Tell us what you're looking for.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-muted">
          No drip campaigns, no automated follow-ups. One call with a principal, usually the same day.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="tel:+18005550142" className={btnPrimary}>
            Call +1 (800) 555-0142
          </a>
          <Link to="/about" className={`${btnGhost} text-ink`}>
            Meet the team
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
