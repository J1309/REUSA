import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { byId, properties, usd } from '../data.js'
import { Img, Reveal, PropertyCard, btnPrimary, btnGhost } from '../ui.jsx'

/* Lightbox on the native <dialog> — free backdrop, focus trap and Esc key. */
function Lightbox({ images, index, onClose, onIndex }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    index === null ? d.close() : !d.open && d.showModal()
  }, [index])

  useEffect(() => {
    const onKey = (e) => {
      if (index === null) return
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [index, images.length, onIndex])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-svh max-w-[95vw] bg-transparent backdrop:bg-ink/90 backdrop:backdrop-blur-sm"
    >
      {index !== null && (
        <div className="relative">
          <img src={images[index]} alt="" className="max-h-[85svh] w-auto rounded-lg object-contain" />
          <div className="mt-4 flex items-center justify-center gap-4 text-sand">
            <button onClick={() => onIndex((index - 1 + images.length) % images.length)} className={`${btnGhost} min-h-11`}>
              ← Prev
            </button>
            <span className="text-sm tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button onClick={() => onIndex((index + 1) % images.length)} className={`${btnGhost} min-h-11`}>
              Next →
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute -top-2 right-0 size-11 -translate-y-full text-2xl text-sand"
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  )
}

export default function Property() {
  const { id } = useParams()
  const p = byId(id)
  const [light, setLight] = useState(null)

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-48 text-center">
        <h1 className="font-display text-4xl">That listing is no longer available.</h1>
        <Link to="/listings" className={`${btnPrimary} mt-8`}>
          Back to listings
        </Link>
      </div>
    )
  }

  const specs = [
    ['Bedrooms', p.beds],
    ['Bathrooms', p.baths],
    ['Interior', `${p.sqft.toLocaleString('en-US')} sqft`],
    ['Built', p.year],
    ['Type', p.type],
    ['Price / sqft', usd(Math.round(p.price / p.sqft))],
  ]

  const similar = properties.filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pb-10 pt-36 lg:px-10">
        <Link to="/listings" className="text-sm text-muted transition-colors hover:text-ink">
          ← All listings
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="max-w-2xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05]">{p.title}</h1>
            <p className="mt-3 text-muted">{p.location}</p>
          </div>
          <p className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)]">{usd(p.price)}</p>
        </div>
      </header>

      {/* Gallery — first image large, the rest in a column beside it. */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <button onClick={() => setLight(0)} className="group overflow-hidden rounded-2xl">
            <Img
              src={p.images[0]}
              alt={`${p.title} — main view`}
              priority
              wrapClass="aspect-[4/3] md:aspect-[3/2]"
              className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
            />
          </button>
          <div className="grid gap-3">
            {p.images.slice(1, 4).map((src, i) => (
              <button key={src} onClick={() => setLight(i + 1)} className="group overflow-hidden rounded-2xl">
                <Img
                  src={src}
                  alt={`${p.title} — view ${i + 2}`}
                  wrapClass="aspect-[4/3] md:aspect-auto md:h-full"
                  className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">Click any photo to open the full gallery · {p.images.length} images</p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.6fr_1fr] lg:px-10">
        <div>
          <Reveal>
            <h2 className="font-display text-3xl">About this home</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{p.description}</p>
          </Reveal>

          <Reveal stagger={0.08} className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            {specs.map(([label, value]) => (
              <div key={label} className="border-t border-stone pt-4">
                <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
                <p className="mt-1 font-display text-2xl">{value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-14">
            <h3 className="font-display text-2xl">Amenities</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.amenities.map((a) => (
                <span key={a} className="rounded-full border border-stone bg-white px-4 py-2 text-sm">
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Agent card sticks alongside the copy on desktop. */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-ink p-8 text-sand">
            <p className="text-xs uppercase tracking-[0.3em] text-sand/40">Listing agent</p>
            <p className="mt-4 font-display text-2xl">Elena Marsh</p>
            <p className="mt-1 text-sm text-sand/50">Principal Broker · DRE #01998421</p>
            <p className="mt-6 text-sm leading-relaxed text-sand/70">
              I've walked this house four times. Ask me anything about it — including what I'd want fixed before I made an
              offer.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <a href="tel:+18005550142" className={`${btnPrimary} bg-sand text-ink hover:bg-accent`}>
                Call about this home
              </a>
              <a href={`mailto:hello@aurelia.re?subject=${encodeURIComponent(`${p.title} — ${p.location}`)}`} className={`${btnGhost} text-sand`}>
                Request a tour
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-stone">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal className="mb-12">
            <h2 className="font-display text-3xl">Similar homes</h2>
          </Reveal>
          <Reveal stagger={0.15} y={50} className="grid gap-7 md:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} p={s} />
            ))}
          </Reveal>
        </div>
      </section>

      <Lightbox images={p.images} index={light} onClose={() => setLight(null)} onIndex={setLight} />
    </>
  )
}
