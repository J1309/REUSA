import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { properties, propertyTypes, usd } from '../data.js'
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
    [q, type, max, beds],
  )

  const field = 'min-h-11 rounded-full border border-stone bg-white px-4 text-sm outline-none transition-colors focus:border-accent'

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pb-12 pt-36 lg:px-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Portfolio</p>
        <h1 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4rem)] leading-[1.05]">
          Every home we're representing right now.
        </h1>
      </header>

      <div className="sticky top-16 z-30 border-y border-stone bg-sand/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4 lg:px-10">
          <input
            value={q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search city or state"
            className={`${field} flex-1 min-w-45`}
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
                {b === 'Any' ? 'Any beds' : `${b}+ beds`}
              </option>
            ))}
          </select>
          <select value={max} onChange={(e) => set('max', e.target.value)} className={field} aria-label="Maximum price">
            {priceOptions.map(([label, value]) => (
              <option key={label} value={value}>
                {label === 'Any' ? 'Any price' : `Under ${label}`}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{results.length} homes</span>
            <div className="flex rounded-full border border-stone bg-white p-1">
              {['grid', 'row'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayout(mode)}
                  aria-pressed={layout === mode}
                  className={`${btn} min-h-9 px-4 text-xs ${layout === mode ? 'bg-ink text-sand' : 'text-muted'}`}
                >
                  {mode === 'grid' ? 'Grid' : 'List'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {results.length === 0 ? (
          <div className="rounded-2xl bg-white py-24 text-center">
            <p className="font-display text-2xl">Nothing matches those filters.</p>
            <p className="mt-2 text-sm text-muted">
              Off-market inventory moves fast — call us and we'll check what isn't listed yet.
            </p>
            <button onClick={() => setParams({}, { replace: true })} className="mt-6 text-sm font-medium text-sea">
              Clear filters
            </button>
          </div>
        ) : (
          <div
            key={layout + results.length}
            className={layout === 'grid' ? 'grid gap-7 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-6'}
          >
            {results.map((p, i) => (
              <div key={p.id} className="animate-[fadeIn_0.6s_ease_both]" style={{ animationDelay: `${i * 60}ms` }}>
                <PropertyCard p={p} layout={layout} priority={i < 2} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Reveal className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <p className="text-sm text-muted">
          Prices shown are current asking prices, from {usd(Math.min(...properties.map((p) => p.price)))} to{' '}
          {usd(Math.max(...properties.map((p) => p.price)))}. Off-market inventory available on request.
        </p>
      </Reveal>
    </>
  )
}
