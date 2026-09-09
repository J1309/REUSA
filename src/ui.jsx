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

/* ------------------------------------------------------------------ *
 * GSAP's ticker is requestAnimationFrame-driven, so it stalls whenever the
 * page isn't painting — a hidden tab, a preview pane that isn't displayed,
 * a backgrounded window. Every `gsap.from` below starts from opacity 0, so
 * a stalled ticker leaves that start state applied forever: content that is
 * invisible but still laid out and still clickable.
 *
 * Probe rAF once for the whole app. If it never fires, skip the entrance
 * animations entirely and render everything in its natural state. Doubles as
 * the reduced-motion opt-out.
 * ------------------------------------------------------------------ */
let motionProbe
const canAnimate = () =>
  (motionProbe ??= new Promise((resolve) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return resolve(false)
    // Already painting: decide now. Waiting even one frame would show the
    // hero headline unanimated before the start state lands — a visible flash.
    if (document.visibilityState === 'visible') return resolve(true)
    // Hidden at load. It may still come to the front, so give rAF a moment;
    // if no frame arrives, the ticker is frozen and animating would hide things.
    const timer = setTimeout(() => resolve(false), 1000)
    requestAnimationFrame(() => {
      clearTimeout(timer)
      resolve(true)
    })
  }))

/* Runs `build` inside a gsap.context, but only if animation can actually
   play. Attach the returned ref to the element that scopes the animation. */
export function useGsap(build, deps) {
  const ref = useRef(null)
  useEffect(() => {
    let ctx
    let cancelled = false
    canAnimate().then((ok) => {
      if (ok && !cancelled) ctx = gsap.context(() => build(ref.current), ref.current)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/* Fire `cb(el)` once, the first time the element scrolls into view.
   IntersectionObserver runs off layout, not the paint loop, and where it's
   missing we fire immediately — callers always keep a visible default, so a
   no-op here never hides anything. */
function useInView(cb) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return void cb?.(el)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          cb?.(el)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/* Reveal — fade/slide in on scroll. `stagger` animates direct children.
   Deliberately NOT ScrollTrigger: the reveal is a CSS transition toggled by an
   IntersectionObserver, so a stalled GSAP ticker or a mis-timed ScrollTrigger
   refresh can't strand content off-screen. The `reveal` class only hides
   things once `<html>` has `js-reveal` (see index.css), and a 2.5s safety
   timeout force-reveals no matter what. */
export function Reveal({ children, className = '', y = 40, delay = 0, stagger = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = stagger ? [...el.children] : [el]
    targets.forEach((t) => {
      t.style.setProperty('--rv-y', `${y}px`)
      t.classList.add('reveal')
    })

    // Stagger/delay is applied by WHEN we add `reveal-in`, not via CSS
    // transition-delay: a delayed transition can freeze mid-fade if the
    // compositor pauses, but a delay-free transition to a resting opacity:1
    // always settles. Track the timers so unmount can cancel them.
    const timers = []
    let done = false
    const reveal = () => {
      if (done) return
      done = true
      targets.forEach((t, i) => {
        const wait = (delay + i * stagger) * 1000
        timers.push(setTimeout(() => t.classList.add('reveal-in'), wait))
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((t) => t.classList.add('reveal-in'))
      return
    }
    // Safety net: content is never left hidden, even if the observer never fires.
    timers.push(setTimeout(reveal, 2500))
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reveal()
            io.disconnect()
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
      io.observe(el)
    } else {
      reveal()
    }
    return () => {
      timers.forEach(clearTimeout)
      io?.disconnect()
    }
  }, [y, delay, stagger])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* Counter — counts up the first time it scrolls into view. The final figure is
   the rendered default, so if the count-up never runs (reduced motion, hidden
   tab, no observer) it shows the real number rather than a stranded zero. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useInView((el) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obj = { n: 0 }
    el.textContent = '0' + suffix
    gsap.to(obj, {
      n: to,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.n).toLocaleString('en-US') + suffix
      },
    })
  })
  return (
    <span ref={ref} className={className}>
      {to.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

/* Split headline — words rise in on mount. */
export function SplitText({ text, className = '', delay = 0 }) {
  const ref = useGsap(
    () => {
      gsap.from('.word > span', {
        yPercent: 110,
        duration: 1.1,
        delay,
        stagger: 0.06,
        ease: 'power4.out',
      })
    },
    [delay],
  )
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

export const btn =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-7 min-h-11 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-100'
export const btnPrimary = `${btn} bg-moss text-white hover:bg-forest shadow-sm`
export const btnMoss = `${btn} bg-moss text-white hover:bg-forest shadow-sm`
export const btnWhite = `${btn} bg-white text-ink hover:bg-sand shadow-sm`
export const btnLight = `${btn} bg-sand text-ink hover:bg-accent shadow-md`
export const btnGhost = `${btn} border border-current/25 text-current hover:bg-current/10`

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
  { to: '/', label: 'Overview' },
  { to: '/listings', label: 'Residences' },
  { to: '/about', label: 'Philosophy & Team' },
]

/* ------------------------------------------------------------------ *
 * Bespoke Architectural Brand Identity Logo
 * Concept: The Isometric Pavilion / Sharp Hexagonal Prism (L & G)
 * ------------------------------------------------------------------ */
export function BrandLogo({ className = '', variant = 'auto', overHero = false }) {
  const isLight = variant === 'light' || (variant === 'auto' && overHero)

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact Isometric Pavilion Gold Emblem */}
      <img
        src="/images/logo/logo-isometric-gold.png"
        alt="Realtor LG Isometric Pavilion Logo"
        className="h-9 w-auto sm:h-10 shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:scale-105"
      />

      {/* Refined Brand Wordmark & Metadata */}
      <div className="flex flex-col text-left">
        <span
          className={`font-modern text-sm sm:text-[15px] font-bold tracking-[0.22em] uppercase leading-tight transition-colors ${
            isLight ? 'text-white' : 'text-ink'
          }`}
        >
          Realtor LG
        </span>
        <span
          className={`text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.28em] uppercase transition-colors mt-0.5 ${
            isLight ? 'text-[#e5cba4]' : 'text-sea'
          }`}
        >
          Private Residences
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Main Navigation
 * ------------------------------------------------------------------ */
export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname])

  const overHero = loc.pathname === '/' && !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 lg:px-10">
        {/* Bespoke Architectural Brand Logo */}
        <Link to="/" className="group focus:outline-none">
          <BrandLogo overHero={overHero} />
        </Link>

        {/* Center Desktop Links */}
        <div className={`hidden items-center gap-8 md:flex ${overHero ? 'text-white/90' : 'text-ink/80'}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.15em] font-medium transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100 font-semibold' : 'opacity-70'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative py-1">
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-current rounded-full" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/listings"
            className={`${btnMoss} min-h-10 px-5 text-xs font-semibold uppercase tracking-wider shadow-sm`}
          >
            Explore Residences
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`grid size-11 place-items-center md:hidden rounded-full transition-colors ${
            overHero ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-stone/40'
          }`}
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

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-stone/80 bg-white/98 px-6 pb-8 pt-4 md:hidden shadow-2xl animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col divide-y divide-stone/50">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex min-h-14 items-center justify-between font-modern text-lg font-medium transition-colors ${
                    isActive ? 'text-moss font-semibold' : 'text-ink'
                  }`
                }
              >
                <span>{l.label}</span>
                <span className="text-sm text-muted">→</span>
              </NavLink>
            ))}
          </div>
          <Link
            to="/listings"
            onClick={() => setOpen(false)}
            className={`${btnMoss} mt-6 w-full min-h-12 text-sm font-semibold uppercase tracking-wider shadow-md`}
          >
            Explore Residences
          </Link>
        </div>
      )}
    </header>
  )
}

export function PropertyCard({ p, priority = false, layout = 'grid' }) {
  const row = layout === 'row'
  return (
    <Link
      to={`/listings/${p.id}`}
      className={`group block overflow-hidden rounded-[2rem] border border-stone/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
        row ? 'sm:flex' : ''
      }`}
    >
      <div className={`relative ${row ? 'sm:w-2/5 sm:shrink-0' : ''}`}>
        <Img
          src={p.images[0]}
          alt={p.title}
          priority={priority}
          wrapClass={row ? 'aspect-[4/3] sm:h-full' : 'aspect-[16/11]'}
          className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-ink backdrop-blur-md shadow-sm">
          {p.type}
        </span>
        {/* Amenities slide up on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-ink/90 to-transparent p-4 pt-10 transition-transform duration-500 group-hover:translate-y-0 md:block">
          <div className="flex flex-wrap gap-1.5">
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full border border-white/30 px-2.5 py-1 text-[11px] text-white">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-6 ${row ? 'sm:flex sm:flex-col sm:justify-center' : ''}`}>
        <div className="flex items-baseline justify-between">
          <p className="font-modern font-bold text-2xl text-ink">{usd(p.price)}</p>
          <span className="text-xs font-mono text-muted uppercase tracking-wider">{p.type}</span>
        </div>
        <h3 className="mt-1 font-modern text-lg font-semibold text-ink truncate">{p.title}</h3>
        <p className="mt-0.5 text-xs text-muted truncate">{p.location}</p>
        <div className="mt-4 flex gap-4 border-t border-stone/60 pt-4 text-xs font-medium text-muted">
          <span>{p.beds} Beds</span>
          <span>•</span>
          <span>{p.baths} Baths</span>
          <span>•</span>
          <span>{p.sqft.toLocaleString('en-US')} sqft</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-moss group-hover:text-sea transition-colors">
            View Details
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-sand text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-moss group-hover:text-white">
            →
          </span>
        </div>
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
            <BrandLogo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand/60">
              A bespoke architectural brokerage representing private residences and luxury estates. Licensed in CA, TX, FL, SC, OR and CO.
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
            <a href="mailto:hello@realtorlg.com" className="flex min-h-11 items-center text-sand/70 transition-colors hover:text-sand">
              hello@realtorlg.com
            </a>
            <p className="flex min-h-11 items-center text-sand/70">Mon–Sat, 8am–7pm PT</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-sand/10 pt-6 text-xs text-sand/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Realtor LG. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Equal Housing Opportunity</span>
            <Link to="/admin" className="transition-colors hover:text-sand">
              Owner
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
