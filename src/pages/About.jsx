import { Link } from 'react-router-dom'
import { Img, Reveal, Counter, Stars, btnMoss, btnWhite, btnGhost } from '../ui.jsx'

const specialties = [
  'Residential',
  'Commercial',
  'Investment',
  'Rentals',
  'Buyers & Sellers',
]

const pillars = [
  {
    num: '01',
    title: 'Buyers & Sellers Representation',
    copy: 'Guiding clients through every milestone—from first-time home purchases to luxury residential sales with strategic pricing and thorough negotiation.',
  },
  {
    num: '02',
    title: 'Commercial Real Estate',
    copy: 'Assisting business owners and investors with commercial property acquisitions, leases, and commercial portfolio transactions across Pennsylvania.',
  },
  {
    num: '03',
    title: 'Investment Advisory',
    copy: 'Helping investors identify sound opportunities, evaluate cash flows, and build resilient, long-term real estate equity in the United States.',
  },
  {
    num: '04',
    title: 'Rentals & Landlord Services',
    copy: 'Providing end-to-end support for landlords and tenants, ensuring quality placements, seamless leases, and ongoing property performance.',
  },
]

const philosophies = [
  {
    title: 'Uncompromising Integrity',
    desc: 'Honest guidance without high-pressure tactics. A successful transaction is one that truly supports your financial well-being.',
  },
  {
    title: 'Two Decades of PA Insight',
    desc: 'Licensed since 2005, navigating bull markets, corrections, and hyper-local Pennsylvania submarkets with tested discernment.',
  },
  {
    title: 'Personalized Attention',
    desc: 'You work directly with Lijo George from initial consultation through the closing table—no handoffs to inexperienced assistants.',
  },
  {
    title: 'Long-Term Relationships',
    desc: 'Our work does not end at the closing table. We serve as trusted lifetime advisors for our clients and their families.',
  },
]

export default function About() {
  return (
    <>
      {/* 1. Profile Header */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 pt-28 sm:pt-36 lg:pt-40 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">
              / ABOUT LG REALTOR
            </span>
          </div>

          <h1 className="font-modern font-bold text-[clamp(2.5rem,6vw,4.6rem)] leading-[1.04] text-ink tracking-tight">
            Lijo George <span className="text-muted font-normal text-2xl sm:text-3xl">(Owner)</span>
            <span className="block font-serif italic font-normal text-sea text-[0.85em] mt-1">
              LG Realtor
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-muted font-normal max-w-2xl">
            Pennsylvania Real Estate Professional Since 2005
          </p>

          {/* Specialties Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-stone bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </header>

      {/* 2. Executive Bio & Story Split */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] items-start">
          {/* Left Column: Architectural Showcase & Highlight Card */}
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-stone/80 bg-stone/20 shadow-lg aspect-[4/3.5] sm:aspect-[4/3]">
              <img
                src="/images/showcase/showcase-01.webp"
                alt="Lijo George - LG Realtor Architectural Office"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

              {/* Float Stat Badge */}
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl bg-white/95 p-4 sm:p-5 backdrop-blur-md border border-white/80 shadow-md text-ink">
                <div>
                  <p className="font-modern font-bold text-2xl sm:text-3xl text-ink">$25M+</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted">Properties Sold</p>
                </div>
                <div className="h-8 w-px bg-stone" />
                <div>
                  <p className="font-modern font-bold text-2xl sm:text-3xl text-sea">20+ Yrs</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted">Licensed Experience</p>
                </div>
                <div className="h-8 w-px bg-stone hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="font-modern font-bold text-2xl sm:text-3xl text-ink">PA</p>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted">Since 2005</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="mt-6 rounded-3xl border border-stone/80 bg-white p-6 shadow-sm">
              <h3 className="font-modern font-bold text-lg text-ink">Direct Representation</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Connect directly with Lijo George for confidential residential, commercial, or investment consultations.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="tel:+12157767940"
                  className={`${btnMoss} min-h-11 px-5 text-xs font-semibold shadow-sm`}
                >
                  Call +1 (215) 776-7940
                </a>
                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center px-4 text-xs font-semibold text-ink hover:text-sea transition-colors"
                >
                  Send a Message →
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Complete Official Biography */}
          <Reveal className="space-y-6 text-base sm:text-lg leading-relaxed text-muted font-normal">
            <h2 className="font-modern font-bold text-2xl sm:text-3xl text-ink tracking-tight">
              Two Decades of Dedication, <span className="font-serif italic font-normal text-sea">One Client at a Time.</span>
            </h2>

            <p>
              <strong className="text-ink font-semibold">Lijo George</strong> has been a licensed Realtor in Pennsylvania since 2005, bringing more than two decades of experience and dedication to the real estate industry. Throughout his career, Lijo has successfully represented buyers, sellers, investors, landlords, and tenants, while also assisting clients with commercial real estate transactions and rental properties.
            </p>

            <p>
              With <strong className="text-ink font-semibold">over $25 million in properties sold</strong>, Lijo has developed a strong understanding of the Pennsylvania real estate market and the unique needs of clients at every stage of their real estate journey.
            </p>

            <div className="my-8 rounded-3xl bg-sand/60 p-6 sm:p-8 border border-stone/80">
              <p className="font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
                “Lijo migrated to the United States from India in 2003 after earning his Bachelor’s Degree in Physical Therapy. Shortly after arriving in the United States, he discovered his passion for real estate and began his career in the industry in 2005.”
              </p>
            </div>

            <p>
              What began as a career opportunity quickly became a true passion—helping people achieve their real estate goals and make sound investments in the United States. Whether buying a first home, selling a property, building an investment portfolio, finding a rental, or exploring commercial opportunities, Lijo believes that every client deserves personalized attention, honest guidance, and professional service.
            </p>

            <p>
              His approach is built on <strong className="text-ink font-semibold">trust, integrity, market knowledge, and long-term relationships</strong>. For Lijo, a successful transaction is not simply about closing a deal—it is about helping clients make informed decisions that support their financial and personal goals.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Areas of Expertise / Pillars */}
      <section className="bg-ink text-sand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal className="max-w-xl mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent font-semibold">
              / SCOPE OF PRACTICE
            </span>
            <h2 className="mt-2 font-modern font-bold text-[clamp(2rem,4vw,3.2rem)] leading-tight text-white">
              Comprehensive Real Estate Services
            </h2>
          </Reveal>

          <Reveal stagger={0.12} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="border-t border-white/15 pt-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-accent">{p.num}</span>
                  <h3 className="mt-3 font-modern font-bold text-xl text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand/70">{p.copy}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 4. Guiding Principles */}
      <section className="bg-sand/40 py-20 sm:py-28 border-b border-stone/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">
              / CORE FOUNDATION
            </span>
            <h2 className="mt-2 font-modern font-bold text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-ink">
              Built on Trust & Integrity
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {philosophies.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-stone/80 bg-white p-6 sm:p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="size-9 rounded-xl bg-sand flex items-center justify-center text-moss font-bold text-sm mb-4">
                  ✓
                </div>
                <h3 className="font-modern font-bold text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Direct Consultation Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28 lg:px-10">
        <Reveal className="rounded-[2.5rem] bg-white p-8 sm:p-14 text-center shadow-[0_30px_70px_-30px_rgba(12,31,28,0.15)] border border-stone/80 md:p-20">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">
            / GET IN TOUCH
          </span>
          <h2 className="mx-auto mt-2 max-w-2xl font-modern font-bold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ink">
            Ready to discuss your Pennsylvania real estate goals?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base text-muted leading-relaxed">
            Whether you are purchasing your first home, marketing a property, or expanding your investment portfolio, connect with Lijo George for honest, dedicated guidance.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <a
              href="tel:+12157767940"
              className={`${btnMoss} min-h-12 px-8 text-sm font-semibold shadow-md`}
            >
              Call +1 (215) 776-7940
            </a>
            <Link to="/contact" className={`${btnGhost} text-ink min-h-12 px-8 text-sm font-semibold`}>
              Contact & Inquiry Form
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
