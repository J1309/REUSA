import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usd } from './data.js'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ *
 * Img — skeleton while loading, fades in once decoded.
 *
 * No loading="lazy". The whole site is 12 images at 81–320KB, so deferring
 * them saves almost nothing, while every lazy mechanism (native lazy and
 * IntersectionObserver alike) is driven by the rendering loop and stalls
 * whenever the tab isn't painting — leaving permanent empty skeletons.
 * `priority` still drives fetchPriority so the LCP image wins the race.
 *
 * ponytail: reinstate lazy loading if the listings grid ever grows past
 * ~20 properties, at which point deferring actually buys something.
 * ------------------------------------------------------------------ */
export function Img({ src, alt, className = '', wrapClass = '', priority = false, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${loaded ? '' : 'skeleton'} ${wrapClass}`}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...rest}
      />
    </div>
  )
}

/* Reveal — scroll-triggered fade/slide. `stagger` animates direct children. */
export function Reveal({ children, className = '', y = 40, delay = 0, stagger = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const targets = stagger ? el.children : el
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.9,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [y, delay, stagger])
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* Counter — counts up once when scrolled into view. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const obj = { n: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: to,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.n).toLocaleString('en-US') + suffix
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [to, suffix])
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

/* Split headline — words rise in on mount. */
export function SplitText({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.word > span', {
        yPercent: 110,
        duration: 1.1,
        delay,
        stagger: 0.06,
        ease: 'power4.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [delay])
  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word inline-block overflow-hidden align-bottom">
          <span className="inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

export function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-current" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  )
}

/* Shared button styles — one place, two variants. */
export const btn =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 min-h-11 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-100'
export const btnPrimary = `${btn} bg-ink text-sand hover:bg-sea`
export const btnGhost = `${btn} border border-current/30 text-current hover:bg-current/10`

/* ScrollProgress — fixed bar driven by Lenis/native scroll. */
export function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/about', label: 'About' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // Home has a dark full-bleed hero; other pages start on the light background.
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? 'bg-sand/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          to="/"
          className={`flex min-h-11 items-center font-display text-xl tracking-tight transition-colors ${overHero ? 'text-sand' : 'text-ink'}`}
        >
          Aurelia<span className="text-accent">.</span>
        </Link>

        <div className={`hidden items-center gap-9 md:flex ${overHero ? 'text-sand' : 'text-ink'}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative text-sm tracking-wide transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
          <a href="#contact" className={overHero ? btnGhost : btnPrimary}>
            Book a call
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`grid size-11 place-items-center md:hidden ${overHero ? 'text-sand' : 'text-ink'}`}
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute inset-x-0 top-0 h-px bg-current transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone bg-sand px-6 pb-6 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="flex min-h-14 items-center font-display text-2xl">
              {l.label}
            </NavLink>
          ))}
          <a href="#contact" className={`${btnPrimary} mt-2 w-full`}>
            Book a call
          </a>
        </div>
      )}
    </header>
  )
}

/* PropertyCard — used on Home, Listings and the "similar homes" rail. */
export function PropertyCard({ p, priority = false, layout = 'grid' }) {
  const row = layout === 'row'
  return (
    <Link
      to={`/listings/${p.id}`}
      className={`group block overflow-hidden rounded-2xl bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(12,31,28,0.35)] ${
        row ? 'sm:flex' : ''
      }`}
    >
      <div className={`relative ${row ? 'sm:w-2/5 sm:shrink-0' : ''}`}>
        <Img
          src={p.images[0]}
          alt={p.title}
          priority={priority}
          wrapClass={row ? 'aspect-[4/3] sm:h-full' : 'aspect-[4/3]'}
          className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-sand/90 px-3 py-1 text-xs tracking-wide backdrop-blur">
          {p.type}
        </span>
        {/* Amenities slide up on hover (desktop only — no hover on touch). */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-4 pt-10 transition-transform duration-500 group-hover:translate-y-0 md:block">
          <div className="flex flex-wrap gap-1.5">
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full border border-sand/30 px-2.5 py-1 text-[11px] text-sand">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-6 ${row ? 'sm:flex sm:flex-col sm:justify-center' : ''}`}>
        <p className="font-display text-2xl">{usd(p.price)}</p>
        <h3 className="mt-1 text-base font-medium">{p.title}</h3>
        <p className="mt-0.5 text-sm text-muted">{p.location}</p>
        <div className="mt-4 flex gap-5 border-t border-stone pt-4 text-sm text-muted">
          <span>{p.beds} bd</span>
          <span>{p.baths} ba</span>
          <span>{p.sqft.toLocaleString('en-US')} sqft</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sea">
          View details
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}

/* Card-shaped skeleton, shown while a lazy page chunk resolves. */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-6">
        <div className="skeleton h-7 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="bg-ink text-sand">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl">
              Aurelia<span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand/60">
              A small brokerage that takes few listings and answers the phone. Licensed in CA, TX, FL, SC, OR and CO.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-4 text-xs uppercase tracking-widest text-sand/40">Explore</p>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="flex min-h-11 items-center text-sand/70 transition-colors hover:text-sand">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="text-sm">
            <p className="mb-4 text-xs uppercase tracking-widest text-sand/40">Contact</p>
            <a href="tel:+18005550142" className="flex min-h-11 items-center text-sand/70 transition-colors hover:text-sand">
              +1 (800) 555-0142
            </a>
            <a href="mailto:hello@aurelia.re" className="flex min-h-11 items-center text-sand/70 transition-colors hover:text-sand">
              hello@aurelia.re
            </a>
            <p className="flex min-h-11 items-center text-sand/70">Mon–Sat, 8am–7pm PT</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-sand/10 pt-6 text-xs text-sand/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Aurelia Estates. All rights reserved.</p>
          <p>Equal Housing Opportunity</p>
        </div>
      </div>
    </footer>
  )
}
