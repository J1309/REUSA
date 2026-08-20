import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { usd } from '../data.js'
import { useListings, saveListing, removeListing, resetListings, nextId, fileToDataUrl } from '../store.js'
import { btnPrimary, btnGhost } from '../ui.jsx'

// Client-side passphrase gate. Preserved for local browser admin demonstration.
const PASSPHRASE = 'realtorlg'

const AMENITY_SUGGESTIONS = [
  'Private Garden',
  'Chef Kitchen',
  'Heated Pool',
  'Wine Cellar',
  'Solar Array',
  'Two-Car Garage',
  'Ocean Front',
  'Infinity Pool',
  'Private Dock',
  'Smart Home',
  'Home Office',
  'EV Charger',
  'Courtyard',
  'Roof Deck',
  'Gym',
  'Fireplace',
]

const PROPERTY_TYPES = ['House', 'Villa', 'Townhouse', 'Condo', 'Estate', 'Loft']

const blankListing = {
  id: '',
  title: '',
  price: '',
  location: '',
  type: 'House',
  beds: '',
  baths: '',
  sqft: '',
  year: new Date().getFullYear(),
  featured: false,
  description: '',
  amenities: [],
  images: [],
}

const toFormState = (p) => ({
  ...blankListing,
  ...p,
  amenities: Array.isArray(p.amenities) ? [...p.amenities] : [],
  images: Array.isArray(p.images) ? [...p.images] : [],
})

const toSavedListing = (f) => ({
  id: f.id || nextId(),
  title: f.title.trim(),
  price: Number(f.price) || 0,
  location: f.location.trim(),
  type: f.type.trim() || 'House',
  beds: Number(f.beds) || 0,
  baths: Number(f.baths) || 0,
  sqft: Number(f.sqft) || 0,
  year: Number(f.year) || new Date().getFullYear(),
  featured: !!f.featured,
  description: f.description.trim(),
  amenities: f.amenities.filter(Boolean),
  images: f.images.length ? f.images : ['/images/hero/hero-01.webp'],
})

/* ------------------------------------------------------------------ *
 * Custom Luxury Confirmation Modal
 * ------------------------------------------------------------------ */
function ConfirmDialog({ isOpen, title, message, confirmText = 'Confirm', isDestructive = false, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/75 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone/50 bg-white p-7 shadow-2xl transition-all sm:p-8">
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-sand text-ink">
          {isDestructive ? (
            <svg className="size-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="size-6 text-sea" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>
        <h3 className="font-display text-2xl tracking-tight text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-sand/60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 text-sm font-medium text-sand transition-all ${
              isDestructive ? 'bg-red-700 hover:bg-red-800' : 'bg-ink hover:bg-sea'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Executive Passphrase Gate
 * ------------------------------------------------------------------ */
function Gate({ onPass }) {
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (value === PASSPHRASE) {
      sessionStorage.setItem('rlg_admin', '1')
      onPass()
    } else {
      setError(true)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const useDemoKey = () => {
    setValue(PASSPHRASE)
    setError(false)
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div
        className={`w-full max-w-md rounded-3xl border border-stone/80 bg-white/95 p-8 shadow-[0_25px_60px_-15px_rgba(12,31,28,0.12)] backdrop-blur-md sm:p-10 transition-transform ${
          isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-ink text-accent shadow-sm">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sea">Realtor LG Studio</span>
          <h1 className="mt-1 font-display text-3xl text-ink">Broker Sign In</h1>
          <p className="mt-2 text-sm text-muted">Enter your executive passphrase to manage properties and curate the portfolio.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  setError(false)
                }}
                placeholder="Enter passphrase"
                className={`w-full rounded-xl border bg-sand/30 px-4 py-3.5 pr-11 text-sm outline-none transition-all placeholder:text-muted/60 focus:bg-white ${
                  error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-stone focus:border-sea focus:ring-2 focus:ring-sea/20'
                }`}
                aria-label="Passphrase"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs font-medium text-red-700 flex items-center gap-1.5">
                <svg className="size-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Incorrect passphrase. Please try again.
              </p>
            )}
          </div>

          <button className={`${btnPrimary} w-full shadow-md hover:shadow-lg`}>
            Unlock Studio
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-stone/60 pt-5 text-center">
          <button
            type="button"
            onClick={useDemoKey}
            className="group inline-flex items-center gap-1.5 rounded-full bg-sand/70 px-3 py-1 text-xs text-muted transition-colors hover:bg-stone/80 hover:text-ink"
          >
            <span>Demo Key: <strong className="font-mono text-ink">realtorlg</strong></span>
            <span className="text-[10px] text-sea opacity-0 transition-opacity group-hover:opacity-100">(fill)</span>
          </button>

          <Link to="/" className="text-xs text-muted transition-colors hover:text-ink">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Real-time Live Property Card Preview
 * ------------------------------------------------------------------ */
function PreviewCard({ listing }) {
  const displayPrice = listing.price ? usd(Number(listing.price) || 0) : '$0'
  const displayTitle = listing.title || 'Untitled Property'
  const displayLocation = listing.location || 'Location Pending'
  const coverImage = listing.images?.[0] || '/images/hero/hero-01.webp'

  return (
    <div className="overflow-hidden rounded-3xl border border-stone/80 bg-white shadow-[0_20px_45px_-15px_rgba(12,31,28,0.15)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone/40">
        <img
          src={coverImage}
          alt={displayTitle}
          className="size-full object-cover transition-transform duration-700"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-sand/90 px-3 py-1 text-xs font-medium tracking-wide text-ink backdrop-blur-md shadow-sm">
            {listing.type || 'House'}
          </span>
          {listing.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/90 px-3 py-1 text-xs font-medium text-accent backdrop-blur-md shadow-sm">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="font-display text-2xl text-ink">{displayPrice}</p>
        <h3 className="mt-1 font-medium text-ink line-clamp-1">{displayTitle}</h3>
        <p className="mt-0.5 text-xs text-muted line-clamp-1">{displayLocation}</p>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-stone/60 pt-4 text-xs text-muted">
          <span><strong>{listing.beds || 0}</strong> bd</span>
          <span><strong>{listing.baths || 0}</strong> ba</span>
          <span><strong>{listing.sqft ? Number(listing.sqft).toLocaleString('en-US') : 0}</strong> sqft</span>
          <span>Yr <strong>{listing.year || 2024}</strong></span>
        </div>

        {listing.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {listing.amenities.slice(0, 4).map((a) => (
              <span key={a} className="rounded-full border border-stone/80 bg-sand/40 px-2.5 py-0.5 text-[10px] text-muted">
                {a}
              </span>
            ))}
            {listing.amenities.length > 4 && (
              <span className="rounded-full bg-sand/60 px-2 py-0.5 text-[10px] text-muted">
                +{listing.amenities.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Listing Studio Form (Create & Edit)
 * ------------------------------------------------------------------ */
function ListingForm({ initial, onDone }) {
  const [f, setF] = useState(() => toFormState(initial))
  const [amenityInput, setAmenityInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const isEditing = Boolean(f.id)

  const setField = (key) => (e) => setF((prev) => ({ ...prev, [key]: e.target.value }))

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    setBusy(true)
    try {
      const urls = await Promise.all(Array.from(files).map((file) => fileToDataUrl(file)))
      setF((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch {
      alert('Could not process some of the uploaded images.')
    } finally {
      setBusy(false)
    }
  }

  const onFileInputChange = (e) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeImage = (indexToRemove) => {
    setF((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }))
  }

  const makeCoverImage = (indexToCover) => {
    if (indexToCover === 0) return
    setF((prev) => {
      const selected = prev.images[indexToCover]
      const rest = prev.images.filter((_, i) => i !== indexToCover)
      return { ...prev, images: [selected, ...rest] }
    })
  }

  const addAmenity = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!f.amenities.includes(trimmed)) {
      setF((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }))
    }
    setAmenityInput('')
  }

  const removeAmenity = (nameToRemove) => {
    setF((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== nameToRemove),
    }))
  }

  const handleAmenityKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addAmenity(amenityInput)
    }
  }

  const save = (e) => {
    e.preventDefault()
    if (!f.title.trim() || !f.location.trim() || !(Number(f.price) > 0)) {
      alert('Please fill in a valid title, location, and price.')
      return
    }
    saveListing(toSavedListing(f))
    onDone()
  }

  const inputClass =
    'w-full rounded-xl border border-stone bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/60 focus:border-sea focus:ring-2 focus:ring-sea/15'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5'

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease]">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sea font-medium">
            <span>Portfolio Studio</span>
            <span>/</span>
            <span>{isEditing ? `ID: #${f.id}` : 'New Property'}</span>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-ink">
            {isEditing ? `Edit: ${f.title || 'Untitled'}` : 'Add New Listing'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={onDone} className={`${btnGhost} text-ink`}>
            Cancel
          </button>
          <button onClick={save} disabled={busy} className={`${btnPrimary} shadow-md`}>
            {busy ? 'Processing Media…' : isEditing ? 'Save Changes' : 'Publish Listing'}
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column: Comprehensive Form */}
        <form onSubmit={save} className="space-y-8">
          {/* 1. Core Property Profile */}
          <div className="rounded-3xl border border-stone/80 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl text-ink flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              General Details
            </h2>
            <p className="mt-1 text-xs text-muted">Primary identification and listing classification.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Property Title *</label>
                <input
                  value={f.title}
                  onChange={setField('title')}
                  placeholder="e.g. The Garden House"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Asking Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={f.price}
                    onChange={setField('price')}
                    placeholder="2450000"
                    className={`${inputClass} pl-8 font-mono`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Location / Address *</label>
                <input
                  value={f.location}
                  onChange={setField('location')}
                  placeholder="e.g. Montecito, California"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Property Type</label>
                <select value={f.type} onChange={setField('type')} className={inputClass}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Year Built</label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear() + 2}
                  value={f.year}
                  onChange={setField('year')}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </div>

          {/* 2. Specifications & Floorplan */}
          <div className="rounded-3xl border border-stone/80 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl text-ink flex items-center gap-2">
              <span className="size-2 rounded-full bg-sea" />
              Specifications
            </h2>
            <p className="mt-1 text-xs text-muted">Architectural dimensions and room count.</p>

            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={f.beds}
                  onChange={setField('beds')}
                  className={`${inputClass} font-mono`}
                  placeholder="4"
                />
              </div>

              <div>
                <label className={labelClass}>Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={f.baths}
                  onChange={setField('baths')}
                  className={`${inputClass} font-mono`}
                  placeholder="3.5"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Interior (sqft)</label>
                <input
                  type="number"
                  min="0"
                  value={f.sqft}
                  onChange={setField('sqft')}
                  className={`${inputClass} font-mono`}
                  placeholder="3200"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-sand/50 p-4 border border-stone/60">
              <div>
                <p className="text-sm font-medium text-ink">Featured Showcase</p>
                <p className="text-xs text-muted">Display this property in the curated hero section on the homepage.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={f.featured}
                  onChange={(e) => setF((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-stone transition-colors peer-checked:bg-sea peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sea/20 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>

          {/* 3. Description & Amenities */}
          <div className="rounded-3xl border border-stone/80 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl text-ink flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              Story & Amenities
            </h2>
            <p className="mt-1 text-xs text-muted">Editorial copy and notable feature highlights.</p>

            <div className="mt-6 space-y-6">
              <div>
                <label className={labelClass}>Editorial Description</label>
                <textarea
                  rows={4}
                  value={f.description}
                  onChange={setField('description')}
                  placeholder="Describe the architectural highlights, natural light, and lifestyle qualities of this home..."
                  className={`${inputClass} leading-relaxed`}
                />
              </div>

              <div>
                <label className={labelClass}>Amenities & Features</label>
                <div className="flex gap-2">
                  <input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={handleAmenityKeyDown}
                    placeholder="Type an amenity and press Enter or comma..."
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => addAmenity(amenityInput)}
                    className="rounded-xl border border-stone px-4 py-2.5 text-xs font-medium text-ink hover:bg-sand transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>

                {/* Active tags */}
                {f.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {f.amenities.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/5 px-3 py-1 text-xs font-medium text-sea"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => removeAmenity(a)}
                          className="size-4 rounded-full text-sea/70 hover:bg-sea/10 hover:text-sea flex items-center justify-center text-xs"
                          aria-label={`Remove ${a}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="mt-4 pt-3 border-t border-stone/50">
                  <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">Quick suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AMENITY_SUGGESTIONS.filter((s) => !f.amenities.includes(s)).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addAmenity(s)}
                        className="rounded-full border border-stone/70 bg-sand/30 px-2.5 py-1 text-xs text-muted hover:border-accent hover:bg-sand hover:text-ink transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Photo Gallery Studio */}
          <div className="rounded-3xl border border-stone/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl text-ink flex items-center gap-2">
                  <span className="size-2 rounded-full bg-sea" />
                  Media Studio ({f.images.length})
                </h2>
                <p className="mt-1 text-xs text-muted">First photo is used as the primary cover shot.</p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-stone/60 transition-colors"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Photos
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                dragOver
                  ? 'border-sea bg-sea/5'
                  : 'border-stone/80 bg-sand/20 hover:border-accent hover:bg-sand/40'
              }`}
            >
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <svg className="size-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                {busy ? 'Compressing to WebP...' : 'Click to select or drag & drop property photos'}
              </p>
              <p className="mt-1 text-xs text-muted">
                Images are automatically converted to optimized WebP format on client-side.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileInputChange}
                className="hidden"
              />
            </div>

            {/* Thumbnail Grid */}
            {f.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
                {f.images.map((src, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-stone bg-sand/40 shadow-sm"
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                    
                    {/* Cover badge */}
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent shadow">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeCoverImage(idx)}
                        className="absolute left-2 top-2 rounded-md bg-ink/75 px-1.5 py-0.5 text-[10px] text-sand opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ink"
                      >
                        Set Cover
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-ink/80 text-sm text-sand shadow transition-all hover:bg-red-700"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={busy} className={`${btnPrimary} min-h-12 px-8 shadow-md`}>
              {busy ? 'Processing...' : isEditing ? 'Save Changes' : 'Publish Listing'}
            </button>
            <button type="button" onClick={onDone} className={`${btnGhost} text-ink min-h-12`}>
              Cancel
            </button>
          </div>
        </form>

        {/* Right Column: Sticky Real-time Live Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              Live Site Preview
            </span>
            <span className="text-[11px] text-muted">Updates as you type</span>
          </div>

          <PreviewCard listing={f} />

          <div className="mt-6 rounded-2xl bg-white p-5 border border-stone/70 shadow-sm text-xs text-muted space-y-2">
            <p className="font-medium text-ink">💡 Quick Tip for Curators:</p>
            <p>High quality photography and descriptive architectural details significantly elevate buyer inquiry rates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Executive Management Dashboard
 * ------------------------------------------------------------------ */
function Dashboard({ onEdit, onLogout }) {
  const listings = useListings()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterFeatured, setFilterFeatured] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, type: null, targetId: null, title: '' })

  // KPI Calculations
  const stats = useMemo(() => {
    const totalValue = listings.reduce((acc, p) => acc + (Number(p.price) || 0), 0)
    const featuredCount = listings.filter((p) => p.featured).length
    const validSqftList = listings.filter((p) => Number(p.sqft) > 0 && Number(p.price) > 0)
    const avgPriceSqft =
      validSqftList.length > 0
        ? Math.round(validSqftList.reduce((acc, p) => acc + p.price / p.sqft, 0) / validSqftList.length)
        : 0

    return {
      totalValue,
      count: listings.length,
      featuredCount,
      avgPriceSqft,
    }
  }, [listings])

  // Filtered Listings
  const filtered = useMemo(() => {
    return listings.filter((p) => {
      const matchesSearch =
        !search ||
        `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(search.toLowerCase())
      const matchesType = filterType === 'All' || p.type === filterType
      const matchesFeatured = !filterFeatured || p.featured
      return matchesSearch && matchesType && matchesFeatured
    })
  }, [listings, search, filterType, filterFeatured])

  const propertyTypes = useMemo(() => {
    return ['All', ...new Set(listings.map((p) => p.type))]
  }, [listings])

  const handleDeletePrompt = (id, title) => {
    setModalState({
      isOpen: true,
      type: 'delete',
      targetId: id,
      title: title,
    })
  }

  const handleResetPrompt = () => {
    setModalState({
      isOpen: true,
      type: 'reset',
      targetId: null,
      title: 'Reset Demo Catalog',
    })
  }

  const handleConfirmModal = () => {
    if (modalState.type === 'delete' && modalState.targetId) {
      removeListing(modalState.targetId)
    } else if (modalState.type === 'reset') {
      resetListings()
    }
    setModalState({ isOpen: false, type: null, targetId: null, title: '' })
  }

  return (
    <div className="space-y-10 animate-[fadeIn_0.4s_ease]">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone/60 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-accent animate-ping" />
            <p className="text-xs uppercase tracking-[0.25em] text-sea font-semibold">Realtor LG Portfolio Studio</p>
          </div>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl text-ink">Property Directory</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(toFormState(blankListing))}
            className={`${btnPrimary} shadow-md flex items-center gap-2`}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </button>
          <button onClick={onLogout} className={`${btnGhost} text-ink`}>
            Sign Out
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Portfolio Value</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl text-ink">{usd(stats.totalValue)}</p>
          <p className="mt-1 text-xs text-muted">Cumulative active list price</p>
        </div>

        <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Active Properties</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl text-ink">{stats.count}</p>
          <p className="mt-1 text-xs text-muted">Current inventory units</p>
        </div>

        <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Featured Homes</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl text-accent">{stats.featuredCount}</p>
          <p className="mt-1 text-xs text-muted">Front-page showcased</p>
        </div>

        <div className="rounded-3xl border border-stone/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Avg Price / SqFt</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl text-ink">{usd(stats.avgPriceSqft)}</p>
          <p className="mt-1 text-xs text-muted">Overall portfolio benchmark</p>
        </div>
      </div>

      {/* 3. Search & Filters Control Bar */}
      <div className="rounded-3xl border border-stone/80 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, city, or state..."
              className="w-full rounded-2xl border border-stone/80 bg-sand/30 pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/60 focus:bg-white focus:border-sea focus:ring-2 focus:ring-sea/15"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-2xl border border-stone bg-sand/40 p-1">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    filterType === type ? 'bg-ink text-sand shadow-sm' : 'text-muted hover:text-ink'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterFeatured(!filterFeatured)}
              className={`rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all ${
                filterFeatured
                  ? 'border-accent bg-accent/20 text-sea font-semibold'
                  : 'border-stone text-muted hover:text-ink'
              }`}
            >
              ★ Featured Only
            </button>
          </div>
        </div>
      </div>

      {/* 4. Listings Cards Table/Grid */}
      <div className="overflow-hidden rounded-3xl border border-stone/80 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-sand text-muted">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="font-display text-xl text-ink">No properties found</p>
            <p className="mt-1 text-sm text-muted">No listings match your active filters or search terms.</p>
            <button
              onClick={() => {
                setSearch('')
                setFilterType('All')
                setFilterFeatured(false)
              }}
              className="mt-4 text-xs font-semibold uppercase tracking-wider text-sea hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone/60">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col gap-4 p-4 transition-colors hover:bg-sand/30 sm:flex-row sm:items-center sm:p-5"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-stone/40 sm:w-36">
                  <img
                    src={p.images?.[0] || '/images/hero/hero-01.webp'}
                    alt={p.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-sand backdrop-blur">
                    {p.type}
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-lg text-ink group-hover:text-sea transition-colors">
                      {p.title}
                    </h3>
                    {p.featured && (
                      <span className="shrink-0 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sea">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-sm font-medium text-ink/80">{usd(p.price)}</p>
                  <p className="text-xs text-muted">{p.location}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span>{p.beds} bd</span>
                    <span>•</span>
                    <span>{p.baths} ba</span>
                    <span>•</span>
                    <span>{p.sqft.toLocaleString('en-US')} sqft</span>
                    <span>•</span>
                    <span>Built {p.year}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                  <Link
                    to={`/listings/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-xl border border-stone bg-white text-muted hover:border-accent hover:text-ink transition-colors"
                    title="View on live website"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>

                  <button
                    onClick={() => onEdit(toFormState(p))}
                    className="rounded-xl border border-stone bg-white px-3.5 py-2 text-xs font-medium text-ink hover:bg-sand transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeletePrompt(p.id, p.title)}
                    className="rounded-xl px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Footer Utility Bar */}
      <div className="flex flex-col gap-4 border-t border-stone/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-ink hover:text-sea transition-colors">
            <span>←</span> Back to Public Site
          </Link>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5 text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            IndexedDB Local Client Store
          </span>
        </div>

        <button
          onClick={handleResetPrompt}
          className="text-left text-xs text-muted hover:text-red-700 transition-colors"
        >
          Reset to Factory Demo Catalog
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={modalState.isOpen}
        isDestructive={modalState.type === 'delete'}
        title={modalState.type === 'delete' ? 'Delete Property Listing?' : 'Reset Catalog to Demo Data?'}
        message={
          modalState.type === 'delete'
            ? `Are you sure you want to permanently delete "${modalState.title}"? This action cannot be undone.`
            : 'This will erase all custom listings and revert back to the 6 default demo properties.'
        }
        confirmText={modalState.type === 'delete' ? 'Delete Listing' : 'Reset Data'}
        onConfirm={handleConfirmModal}
        onCancel={() => setModalState({ isOpen: false, type: null, targetId: null, title: '' })}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Main Admin View Component
 * ------------------------------------------------------------------ */
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rlg_admin') === '1')
  const [editing, setEditing] = useState(null)

  if (!authed) {
    return (
      <section className="mx-auto max-w-7xl px-6 pt-24">
        <Gate onPass={() => setAuthed(true)} />
      </section>
    )
  }

  const logout = () => {
    sessionStorage.removeItem('rlg_admin')
    setAuthed(false)
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:pt-32 lg:px-10">
      {editing ? (
        <ListingForm initial={editing} onDone={() => setEditing(null)} />
      ) : (
        <Dashboard onEdit={setEditing} onLogout={logout} />
      )}
    </section>
  )
}
