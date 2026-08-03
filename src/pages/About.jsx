import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats, testimonials } from '../data.js'
import { Img, Reveal, Counter, Stars, useGsap, btnPrimary, btnGhost } from '../ui.jsx'

gsap.registerPlugin(ScrollTrigger)

// No agent-*.jpg assets exist yet — these stand in. Drop real headshots at
// /public/images/agents/agent-elena-marsh.webp etc. and swap the paths here.
const team = [
  { name: 'Elena Marsh', role: 'Principal Broker', img: '/images/hero/hero-02.webp' },
  { name: 'Daniel Okafor', role: 'Buyer Representation', img: '/images/lifestyle/lifestyle-cafe-01.webp' },
  { name: 'Ruth Vance', role: 'Listings & Staging', img: '/images/lifestyle/lifestyle-park-01.webp' },
]

const services = [
  {
    title: 'Buying',
    copy: 'We tour ahead of you, and we say no on your behalf. You see the three houses worth a Saturday, not thirty.',
  },
  {
    title: 'Selling',
    copy: 'Staging, photography and pricing handled in-house. Our listings average eleven days on market against a regional twenty-nine.',
  },
  {
    title: 'Consulting',
    copy: 'Hourly advisory for owners who want a read on timing, renovation payback or an off-market approach — no listing agreement required.',
  },
]

/* Story copy fades in line by line as it scrolls through the viewport. */
function Story() {
  const ref = useGsap((el) => {
    gsap.from('p', {
      opacity: 0.15,
      y: 24,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
    })
  }, [])

  return (
    <div ref={ref} className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted">
      <p>
        Realtor LG started in 2008, in the worst year anyone in this business can remember. That timing turned out to be the
        whole education: we learned to price honestly because nothing else sold.
      </p>
      <p>
        Eighteen years later we still run the same way. Six agents, all licensed principals, no junior handoffs. We cap
        the number of listings we take because we walk each one repeatedly before it goes live.
      </p>
      <p>
        We work in six states, and we'll tell you plainly when a market isn't ours — then hand you to someone we'd use
        ourselves.
      </p>
    </div>
  )
}

export default function About() {
  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:pt-32 lg:pt-36 lg:px-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">About</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02]">
          Six agents who'd rather lose a listing than oversell one.
        </h1>
      </header>

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <Img
            src="/images/hero/hero-01.webp"
            alt="Realtor LG office"
            priority
            wrapClass="aspect-[16/9] rounded-3xl md:aspect-[21/9]"
            className="size-full object-cover"
          />
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-14 sm:py-20 lg:py-28 lg:grid-cols-[1fr_1.3fr] lg:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">How we got here</h2>
        </Reveal>
        <Story />
      </section>

      <section className="bg-ink text-sand">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-28 lg:px-10">
          <Reveal className="mb-8 sm:mb-12 lg:mb-16 max-w-xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-sand/40">What we do</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">Three ways to work with us</h2>
          </Reveal>
          <Reveal stagger={0.15} className="grid gap-10 md:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} className="border-t border-sand/15 pt-6">
                <p className="text-xs tabular-nums text-accent">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-sand/60">{s.copy}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-28 lg:px-10">
        <Reveal className="mb-8 sm:mb-12 lg:mb-16 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">The team</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">People, not a call centre</h2>
        </Reveal>
        <Reveal stagger={0.15} y={50} className="grid gap-8 sm:grid-cols-3">
          {team.map((m) => (
            <figure key={m.name} className="group">
              <Img
                src={m.img}
                alt={m.name}
                wrapClass="aspect-[4/5] rounded-2xl"
                className="size-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
              <figcaption className="pt-5">
                <h3 className="font-display text-xl">{m.name}</h3>
                <p className="mt-1 text-sm text-muted">{m.role}</p>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      <section className="border-y border-stone bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-24 lg:px-10">
          <Reveal stagger={0.12} className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <Counter to={s.value} suffix={s.suffix} className="font-display text-[clamp(2.4rem,5vw,3.6rem)]" />
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20 lg:py-28 lg:px-10">
        <Reveal className="mb-8 sm:mb-12 lg:mb-16 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Clients</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">In their words</h2>
        </Reveal>
        <Reveal stagger={0.15} y={50} className="grid gap-7 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="rounded-2xl bg-white p-8">
              <Stars n={t.stars} />
              <p className="mt-5 leading-relaxed text-muted">“{t.quote}”</p>
              <footer className="mt-6 text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted"> — {t.place}</span>
              </footer>
            </blockquote>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <Reveal className="rounded-3xl bg-deep p-10 text-center text-sand md:p-20">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-tight">
            Start with a conversation.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sand/60">
            Twenty minutes, no obligation, and you'll leave knowing what your options actually are.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="tel:+18005550142" className={`${btnPrimary} bg-sand text-ink hover:bg-accent`}>
              Call +1 (800) 555-0142
            </a>
            <Link to="/listings" className={`${btnGhost} text-sand`}>
              See the portfolio
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
