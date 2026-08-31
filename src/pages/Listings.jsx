import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usd } from '../data.js'
import { useListings, useListingTypes } from '../store.js'
import { PropertyCard, Reveal, btn } from '../ui.jsx'

const bedOptions = ['Any', '2', '3', '4', '5']
const priceOptions = [
  ['Any', ''],
  ['$1M', '1000000'],
  ['$2M', '2000000'],
  ['$3M', '3000000'],
  ['$5M', '5000000'],
]

export default function Listings() {
  // The URL is the filter state — the Home search bar links straight into it.
  const [params, setParams] = useSearchParams()
  const [layout, setLayout] = useState('grid')
  const properties = useListings()
  const propertyTypes = useListingTypes()

  const q = params.get('q') ?? ''
  const type = params.get('type') ?? 'All'
  const max = params.get('max') ?? ''
  const beds = params.get('beds') ?? 'Any'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    value && value !== 'All' && value !== 'Any' ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(
    () =>
      properties.filter(
        (p) =>
          (!q || `${p.location} ${p.title} ${p.type}`.toLowerCase().includes(q.toLowerCase())) &&
          (type === 'All' || p.type === type) &&
          (!max || p.price <= Number(max)) &&
          (beds === 'Any' || p.beds >= Number(beds)),
      ),
    [properties, q, type, max, beds],
  )

  const field = 'min-h-11 rounded-full border border-stone bg-white px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-colors focus:border-accent'

  return (
    <>
      <header className="mx-auto max-w-7xl px-4 sm:px-6 pb-8 pt-24 sm:pb-12 sm:pt-32 lg:pt-36 lg:px-10">
        <p className="mb-2 text-xs font-mono uppercase tracking-[0.25em] text-sea font-semibold">/ ACTIVE PORTFOLIO</p>
        <h1 className="max-w-2xl font-modern font-bold text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.05] text-ink">
          Every residence we <span className="font-serif italic font-normal text-sea">represent.</span>
        </h1>
      </header>

      {/* Sticky Filter Bar */}
      <div className="sticky top-14 sm:top-16 z-30 border-y border-stone/80 bg-sand/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 lg:px-10">
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search location or title..."
            className={`${field} flex-1 min-w-[140px] sm:min-w-[180px]`}
            aria-label="Search location"
          />
          <select value={type} onChange={(e) => set('type', e.target.value)} className={field} aria-label="Property type">
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={beds} onChange={(e) => set('beds', e.target.value)} className={field} aria-label="Minimum bedrooms">
            {bedOptions.map((b) => (
              <option key={b} value={b}>
                {b === 'Any' ? 'Any Beds' : `${b}+ Beds`}
              </option>
            ))}
          </select>
          <select value={max} onChange={(e) => set('max', e.target.value)} className={field} aria-label="Maximum price">
            {priceOptions.map(([label, value]) => (
              <option key={label} value={value}>
                {label === 'Any' ? 'Any Price' : `Under ${label}`}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="text-xs text-muted font-medium">{results.length} residences</span>
            <div className="hidden sm:flex rounded-full border border-stone bg-white p-1">
              {['grid', 'row'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayout(mode)}
                  aria-pressed={layout === mode}
                  className={`${btn} min-h-8 px-3 text-xs ${layout === mode ? 'bg-ink text-sand' : 'text-muted'}`}
                >
                  {mode === 'grid' ? 'Grid' : 'List'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 lg:px-10">
        {results.length === 0 ? (
          <div className="rounded-3xl border border-stone/80 bg-white py-12 sm:py-16 lg:py-24 text-center px-4">
            <p className="font-display text-2xl text-ink">Nothing matches those filters.</p>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Off-market and private inventory moves fast — contact us directly to explore residences not yet listed publicly.
            </p>
            <button
              onClick={() => setParams({}, { replace: true })}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sea hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div
            key={layout + results.length}
            className={layout === 'grid' ? 'grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-6'}
          >
            {results.map((p, i) => (
              <div key={p.id} className="animate-[fadeIn_0.5s_ease_both]" style={{ animationDelay: `${i * 50}ms` }}>
                <PropertyCard p={p} layout={layout} priority={i < 2} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 sm:pb-28 lg:px-10">
        <p className="text-xs sm:text-sm text-muted">
          Prices shown are current asking prices, from {usd(Math.min(...properties.map((p) => p.price)))} to{' '}
          {usd(Math.max(...properties.map((p) => p.price)))}. Off-market acquisitions available upon confidential request.
        </p>
      </Reveal>
    </>
  )
}
