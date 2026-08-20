import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usd } from '../data.js'
import { useListings } from '../store.js'
import { monthlyPayment } from '../mortgage.js'
import { Img, Reveal, PropertyCard, btnPrimary, btnLight, btnGhost } from '../ui.jsx'

/* ------------------------------------------------------------------ *
 * Interactive Tour Scheduling Modal
 * ------------------------------------------------------------------ */
function TourModal({ isOpen, property, onClose }) {
  const [date, setDate] = useState('tomorrow')
  const [time, setTime] = useState('10:00 AM')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen || !property) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2400)
  }

  const dates = [
    { id: 'tomorrow', label: 'Tomorrow', sub: 'Priority' },
    { id: 'day-after', label: 'In 2 Days', sub: 'Flexible' },
    { id: 'weekend', label: 'Weekend', sub: 'Open Window' },
  ]

  const times = ['10:00 AM', '1:30 PM', '4:00 PM', '6:00 PM']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-[94vw] sm:max-w-lg overflow-hidden rounded-3xl border border-stone/50 bg-white p-5 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 sm:size-9 items-center justify-center rounded-full bg-sand text-muted hover:text-ink transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-[fadeIn_0.3s_ease]">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent/20 text-sea">
              <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-ink">Tour Request Confirmed</h3>
            <p className="mt-2 text-sm text-muted">
              Elena Marsh will confirm your private walkthrough at <strong>{property.title}</strong> shortly.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5 pr-8">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-sea">Private Walkthrough</span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl text-ink">Request a Tour</h3>
              <p className="mt-1 text-xs text-muted truncate">{property.title} · {property.location}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Date selection */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Select Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDate(d.id)}
                      className={`rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 text-left transition-all ${
                        date === d.id
                          ? 'border-sea bg-sea/5 text-ink ring-1 ring-sea'
                          : 'border-stone bg-sand/30 text-muted hover:border-accent'
                      }`}
                    >
                      <p className="text-xs font-medium text-ink">{d.label}</p>
                      <p className="text-[10px] text-muted">{d.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Preferred Window</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`rounded-xl border py-2 text-center text-xs font-medium transition-all ${
                        time === t
                          ? 'border-ink bg-ink text-sand'
                          : 'border-stone bg-white text-muted hover:border-stone hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">Your Name *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-stone bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-sea focus:ring-1 focus:ring-sea"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1">Phone or Email *</label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl border border-stone bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-sea focus:ring-1 focus:ring-sea"
                  />
                </div>
              </div>

              <button className={`${btnPrimary} w-full min-h-12 shadow-md hover:shadow-lg mt-2`}>
                Confirm Tour Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Interactive Mortgage & Payment Calculator
 * ------------------------------------------------------------------ */
function MortgageCalc({ price }) {
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const down = Math.round((price * downPct) / 100)
  const monthly = useMemo(
    () => monthlyPayment(price - down, rate, years),
    [price, down, rate, years],
  )

  return (
    <div id="financing" className="rounded-3xl border border-stone/80 bg-white p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/60 pb-5 sm:pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-sea font-semibold">Financing Studio</span>
          <h3 className="mt-1 font-display text-2xl text-ink">Estimated Monthly Investment</h3>
        </div>
        <div className="sm:text-right">
          <p className="font-display text-3xl sm:text-4xl text-ink">
            {usd(Math.round(monthly))}
            <span className="text-base font-normal text-muted">/mo</span>
          </p>
          <p className="text-xs text-muted">Principal & interest ({usd(down)} down)</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 rounded-2xl bg-sand/40 p-3.5 sm:p-4 border border-stone/60">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted">
            <span>Down Payment</span>
            <span className="font-mono text-ink">{downPct}% ({usd(down)})</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={downPct}
            onChange={(e) => setDownPct(+e.target.value)}
            className="w-full accent-sea"
          />
        </div>

        <div className="space-y-2 rounded-2xl bg-sand/40 p-3.5 sm:p-4 border border-stone/60">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted">
            <span>Interest Rate</span>
            <span className="font-mono text-ink">{rate}%</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-sea"
          />
        </div>

        <div className="space-y-2 rounded-2xl bg-sand/40 p-3.5 sm:p-4 border border-stone/60">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted">
            <span>Loan Term</span>
            <span className="font-mono text-ink">{years} Years</span>
          </div>
          <div className="flex gap-2 pt-0.5">
            {[15, 30].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYears(y)}
                className={`flex-1 rounded-xl py-1 text-xs font-medium transition-colors ${
                  years === y ? 'bg-ink text-sand' : 'border border-stone bg-white text-muted hover:text-ink'
                }`}
              >
                {y} Years
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-muted leading-relaxed">
        Estimate excludes property taxes, insurance, and local assessments. Non-binding advisory calculation.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Fullscreen Lightbox Modal
 * ------------------------------------------------------------------ */
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
      className="m-auto max-h-svh max-w-[96vw] bg-transparent backdrop:bg-ink/90 backdrop:backdrop-blur-md"
    >
      {index !== null && (
        <div className="relative p-2">
          <img src={images[index]} alt="" className="max-h-[80svh] w-auto rounded-2xl object-contain shadow-2xl mx-auto" />
          <div className="mt-4 flex items-center justify-center gap-3 text-sand">
            <button onClick={() => onIndex((index - 1 + images.length) % images.length)} className={`${btnGhost} min-h-10 px-4 text-xs`}>
              ← Prev
            </button>
            <span className="text-xs sm:text-sm font-mono tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button onClick={() => onIndex((index + 1) % images.length)} className={`${btnGhost} min-h-10 px-4 text-xs`}>
              Next →
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="absolute top-0 right-0 size-10 text-2xl text-sand hover:text-accent transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  )
}

/* ------------------------------------------------------------------ *
 * Main Property Details Page
 * ------------------------------------------------------------------ */
export default function Property() {
  const { id } = useParams()
  const list = useListings()
  const p = list.find((x) => x.id === id)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [tourOpen, setTourOpen] = useState(false)
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem(`rlg_saved_${id}`) === '1'
    } catch {
      return false
    }
  })
  const [copied, setCopied] = useState(false)

  // Reset active photo when switching properties
  useEffect(() => {
    setActivePhotoIdx(0)
  }, [id])

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-48 text-center">
        <h1 className="font-display text-3xl sm:text-4xl text-ink">That listing is no longer available.</h1>
        <p className="mt-3 text-sm text-muted">The residence may have been sold or moved off-market.</p>
        <Link to="/listings" className={`${btnPrimary} mt-8`}>
          Browse Available Residences
        </Link>
      </div>
    )
  }

  const toggleSave = () => {
    const next = !saved
    setSaved(next)
    try {
      localStorage.setItem(`rlg_saved_${id}`, next ? '1' : '0')
    } catch {}
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const estMonthly = Math.round(monthlyPayment(p.price * 0.8, 6.5, 30))
  const pricePerSqft = Math.round(p.price / (p.sqft || 1))

  const specsMatrix = [
    { label: 'Bedrooms', value: `${p.beds} Beds`, icon: '🛏️' },
    { label: 'Bathrooms', value: `${p.baths} Baths`, icon: '🚿' },
    { label: 'Living Area', value: `${p.sqft.toLocaleString('en-US')} sqft`, icon: '📐' },
    { label: 'Year Built', value: p.year, icon: '🏛️' },
    { label: 'Property Type', value: p.type, icon: '🏡' },
    { label: 'Price / SqFt', value: usd(pricePerSqft), icon: '📊' },
    { label: 'Architecture', value: 'Contemporary Luxury', icon: '✨' },
    { label: 'Status', value: 'Active Listing', icon: '🟢' },
  ]

  const similar = list.filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <>
      {/* 1. Header & Context Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-28 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone/60 pb-4 sm:pb-5">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-muted">
            <Link to="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-ink transition-colors">Listings</Link>
            <span>/</span>
            <span className="text-sea font-semibold truncate max-w-[140px] sm:max-w-xs">{p.title}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-ink transition-colors shadow-sm"
              title="Copy link to clipboard"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? 'Copied!' : 'Share'}
            </button>

            <button
              onClick={toggleSave}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium transition-all shadow-sm ${
                saved
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-stone bg-white text-muted hover:border-accent hover:text-ink'
              }`}
            >
              <svg className={`size-3.5 ${saved ? 'fill-red-600 text-red-600' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Architectural Showcase Module (Image + Elevated Dossier Card) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-5 sm:pt-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] items-start">
          {/* Left: Cinematic Image Container with Interactive Thumbnail Reel */}
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-stone/80 bg-stone/30 shadow-[0_20px_50px_-20px_rgba(12,31,28,0.15)] group">
            <div
              onClick={() => setLightboxIdx(activePhotoIdx)}
              className="relative aspect-[4/3] sm:aspect-[16/10] cursor-pointer overflow-hidden"
            >
              <img
                src={p.images[activePhotoIdx] || p.images[0]}
                alt={`${p.title} view ${activePhotoIdx + 1}`}
                fetchPriority="high"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

              {/* Tag Pills */}
              <div className="absolute left-3.5 top-3.5 sm:left-6 sm:top-6 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="rounded-full bg-sand/90 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold tracking-wide text-ink backdrop-blur-md shadow-sm">
                  {p.type}
                </span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/90 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-accent backdrop-blur-md shadow-sm">
                    ★ Featured
                  </span>
                )}
              </div>

              {/* Lightbox trigger badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIdx(activePhotoIdx)
                }}
                className="absolute right-3.5 top-3.5 sm:right-6 sm:top-6 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium text-sand backdrop-blur-md transition-transform hover:scale-105"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {p.images.length} Photos
              </button>

              {/* Bottom Quick Title on Image */}
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 text-sand">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-sand/70">Realtor LG Exclusive</p>
                <h2 className="mt-0.5 font-display text-xl sm:text-2xl truncate">{p.title}</h2>
              </div>
            </div>

            {/* Thumbnail switcher bar */}
            {p.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto bg-ink/95 p-2.5 sm:p-3.5 backdrop-blur-md">
                {p.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative aspect-[4/3] w-14 sm:w-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === activePhotoIdx ? 'border-accent scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Elevated Executive Dossier Card */}
          <div className="flex flex-col justify-between rounded-3xl sm:rounded-[2.5rem] border border-stone/80 bg-white p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(12,31,28,0.12)]">
            {/* Header: Address & Bookmark */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-sea">Prime Residence</span>
                  <h1 className="mt-1 font-display text-2xl sm:text-4xl text-ink leading-tight">{p.title}</h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted flex items-center gap-1.5">
                    <svg className="size-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {p.location}
                  </p>
                </div>

                <button
                  onClick={toggleSave}
                  className={`size-10 sm:size-11 shrink-0 rounded-2xl border flex items-center justify-center transition-all ${
                    saved ? 'border-red-300 bg-red-50 text-red-600' : 'border-stone bg-sand/40 text-muted hover:text-ink'
                  }`}
                  aria-label="Save residence"
                >
                  <svg className={`size-4 sm:size-5 ${saved ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              {/* Price & Financing Pill */}
              <div className="mt-5 sm:mt-7 flex flex-wrap items-baseline justify-between gap-3 border-y border-stone/60 py-4 sm:py-5">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted">Asking Price</span>
                  <p className="font-display text-2xl sm:text-4xl text-ink">{usd(p.price)}</p>
                </div>

                <a
                  href="#financing"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-stone bg-sand/40 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium text-ink transition-colors hover:bg-stone/60"
                >
                  <span>Est. {usd(estMonthly)}/mo</span>
                  <span className="text-sea transition-transform group-hover:translate-x-0.5">›</span>
                </a>
              </div>

              {/* Bold Architectural Spec Ticker */}
              <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 text-center rounded-2xl bg-sand/35 p-3 sm:p-4 border border-stone/50">
                <div>
                  <p className="font-display text-xl sm:text-3xl text-ink">{p.beds}</p>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted mt-0.5">Beds</p>
                </div>
                <div className="border-x border-stone/60">
                  <p className="font-display text-xl sm:text-3xl text-ink">{p.baths}</p>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted mt-0.5">Baths</p>
                </div>
                <div>
                  <p className="font-display text-xl sm:text-3xl text-ink">{p.sqft.toLocaleString('en-US')}</p>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted mt-0.5">Sq Ft</p>
                </div>
              </div>
            </div>

            {/* Bottom: Listing Agent & Primary CTA */}
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              {/* Agent card */}
              <div className="flex items-center justify-between rounded-2xl border border-stone/60 bg-white p-3 sm:p-3.5 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/hero/hero-02.webp"
                    alt="Elena Marsh"
                    className="size-10 sm:size-12 rounded-full object-cover border border-stone/80"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-ink">Elena Marsh</p>
                    <p className="text-[10px] sm:text-[11px] text-muted">Principal Broker · DRE #01998421</p>
                  </div>
                </div>

                <a
                  href="tel:+18005550142"
                  className="rounded-full border border-stone bg-sand/30 px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium text-ink hover:bg-stone/60 transition-colors"
                >
                  Contact
                </a>
              </div>

              {/* Primary Tour Button */}
              <button
                onClick={() => setTourOpen(true)}
                className="w-full rounded-2xl bg-ink py-3.5 sm:py-4 text-center text-sand shadow-lg hover:bg-sea transition-all active:scale-[0.99] group"
              >
                <span className="block text-sm sm:text-base font-medium tracking-wide">Request a Private Tour</span>
                <span className="block text-[10px] sm:text-[11px] text-sand/60 transition-colors group-hover:text-sand/80">
                  Earliest availability: Tomorrow at 10:00 AM
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Quick Spec Toolbar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-3xl border border-stone/80 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="rounded-full bg-sea/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-sea">
              Key Highlights
            </span>
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full border border-stone/70 bg-sand/30 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs text-ink">
                {a}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted">
            <span>Built in <strong>{p.year}</strong></span>
            <span>•</span>
            <span><strong>{usd(pricePerSqft)}</strong> / sqft</span>
            <span>•</span>
            <a href="#financing" className="font-semibold text-sea hover:underline">
              Financing ↓
            </a>
          </div>
        </div>
      </section>

      {/* 4. Editorial Story & Specs Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 lg:py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: Narrative & Amenities */}
          <div className="space-y-10 sm:space-y-12">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Architectural Narrative</span>
              <h2 className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl text-ink">About this residence</h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted">{p.description}</p>
            </Reveal>

            {/* Amenities Grid */}
            <Reveal>
              <h3 className="font-display text-xl sm:text-2xl text-ink">Curated Amenities & Finishes</h3>
              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3">
                {p.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 rounded-2xl border border-stone/80 bg-white p-3 sm:p-4 text-xs sm:text-sm text-ink shadow-sm"
                  >
                    <span className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sea text-xs">
                      ✓
                    </span>
                    <span className="font-medium truncate">{a}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Mortgage Calculator */}
            <Reveal>
              <MortgageCalc price={p.price} />
            </Reveal>
          </div>

          {/* Right: Comprehensive Specification Matrix */}
          <div className="space-y-8">
            <Reveal className="rounded-3xl border border-stone/80 bg-white p-5 sm:p-8 shadow-sm">
              <h3 className="font-display text-xl sm:text-2xl text-ink border-b border-stone/60 pb-4">Residence Details</h3>
              <div className="mt-4 sm:mt-6 divide-y divide-stone/60">
                {specsMatrix.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                    <span className="flex items-center gap-2 text-muted">
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                    <span className="font-medium text-ink font-mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Brokerage Trust Card */}
            <Reveal className="rounded-3xl bg-ink p-6 sm:p-8 text-sand shadow-lg">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sand/40">Exclusive Representation</span>
              <h4 className="mt-1 sm:mt-2 font-display text-xl sm:text-2xl">Bespoke Advisory</h4>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-sand/70">
                Every transaction is personally stewarded by our licensed principals with discrete private showings and fiduciary loyalty.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => setTourOpen(true)}
                  className={btnLight}
                >
                  Schedule Private Tour
                </button>
                <a href="tel:+18005550142" className={`${btnGhost} text-sand`}>
                  Call Listing Agent
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. "Latest in your area" / Similar Residences */}
      <section className="border-t border-stone/80 bg-sand/20 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-8 sm:mb-10 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Curated Portfolio</p>
              <h2 className="mt-1 font-display text-2xl sm:text-4xl text-ink">Latest in your area</h2>
            </Reveal>
            <Reveal>
              <Link
                to="/listings"
                className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-stone bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:border-accent shadow-sm transition-all"
              >
                <span>View all listings</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>

          <Reveal stagger={0.15} y={40} className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} p={s} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Lightbox & Tour Modals */}
      <Lightbox
        images={p.images}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onIndex={setLightboxIdx}
      />

      <TourModal
        isOpen={tourOpen}
        property={p}
        onClose={() => setTourOpen(false)}
      />
    </>
  )
}
