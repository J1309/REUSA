import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usd } from '../data.js'
import { useListings, saveListing, removeListing, resetListings, nextId, fileToDataUrl } from '../store.js'
import { btnPrimary, btnGhost, btn } from '../ui.jsx'

// ponytail: client-side passphrase — it only hides the panel from casual
// visitors, it is NOT security (the value ships in the bundle and the data
// lives in the visitor's own browser). Real auth needs a backend; wire one in
// when listings must be shared across devices.
const PASSPHRASE = 'realtorlg'

const field =
  'w-full min-h-11 rounded-lg border border-stone bg-white px-3 text-sm outline-none transition-colors focus:border-accent'
const label = 'block'
const labelText = 'mb-1 block text-xs uppercase tracking-widest text-muted'

const blank = {
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
  amenities: '',
  images: [],
}

// A stored listing -> editable form shape (arrays/numbers -> strings).
const toForm = (p) => ({ ...blank, ...p, amenities: (p.amenities || []).join(', ') })

// Form shape -> stored listing (coerce numbers, split amenities).
const toListing = (f) => ({
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
  amenities: f.amenities.split(',').map((a) => a.trim()).filter(Boolean),
  images: f.images.length ? f.images : ['/images/hero/hero-01.webp'],
})

function Gate({ onPass }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (value === PASSPHRASE) {
      sessionStorage.setItem('rlg_admin', '1')
      onPass()
    } else {
      setError(true)
    }
  }
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Owner access</p>
      <h1 className="mt-3 font-display text-4xl">Sign in</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Passphrase"
          className={field}
          aria-label="Passphrase"
        />
        {error && <p className="text-sm text-red-700">That passphrase didn't match.</p>}
        <button className={`${btnPrimary} w-full`}>Enter</button>
      </form>
      <Link to="/" className="mt-6 text-sm text-muted transition-colors hover:text-ink">
        ← Back to site
      </Link>
    </div>
  )
}

function ListingForm({ initial, onDone }) {
  const [f, setF] = useState(initial)
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value })

  const addFiles = async (e) => {
    const files = [...e.target.files]
    e.target.value = '' // allow re-selecting the same file
    setBusy(true)
    try {
      const urls = await Promise.all(files.map((file) => fileToDataUrl(file)))
      setF((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } finally {
      setBusy(false)
    }
  }

  const removeImage = (i) => setF({ ...f, images: f.images.filter((_, n) => n !== i) })

  const save = (e) => {
    e.preventDefault()
    if (!f.title.trim() || !f.location.trim() || !(Number(f.price) > 0)) return
    saveListing(toListing(f))
    onDone()
  }

  const num = { type: 'number', min: '0' }

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{f.id ? 'Edit listing' : 'New listing'}</h1>
        <button type="button" onClick={onDone} className="text-sm text-muted hover:text-ink">
          Cancel
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Title *</span>
          <input value={f.title} onChange={set('title')} className={field} required />
        </label>
        <label className={label}>
          <span className={labelText}>Price (USD) *</span>
          <input {...num} value={f.price} onChange={set('price')} className={field} required />
        </label>
        <label className={label}>
          <span className={labelText}>Location *</span>
          <input value={f.location} onChange={set('location')} className={field} required />
        </label>
        <label className={label}>
          <span className={labelText}>Type</span>
          <input value={f.type} onChange={set('type')} list="rlg-types" className={field} />
          <datalist id="rlg-types">
            {['House', 'Villa', 'Townhouse', 'Condo'].map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </label>
        <label className={label}>
          <span className={labelText}>Year built</span>
          <input {...num} value={f.year} onChange={set('year')} className={field} />
        </label>
        <label className={label}>
          <span className={labelText}>Bedrooms</span>
          <input {...num} value={f.beds} onChange={set('beds')} className={field} />
        </label>
        <label className={label}>
          <span className={labelText}>Bathrooms</span>
          <input {...num} value={f.baths} onChange={set('baths')} className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Interior (sqft)</span>
          <input {...num} value={f.sqft} onChange={set('sqft')} className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Description</span>
          <textarea value={f.description} onChange={set('description')} rows={4} className={`${field} py-2`} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          <span className={labelText}>Amenities (comma separated)</span>
          <input value={f.amenities} onChange={set('amenities')} className={field} placeholder="Pool, Garden, Gym" />
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={f.featured}
            onChange={(e) => setF({ ...f, featured: e.target.checked })}
            className="size-4 accent-sea"
          />
          <span className="text-sm">Feature on the home page</span>
        </label>
      </div>

      <div>
        <span className={labelText}>Photos</span>
        <div className="flex flex-wrap gap-3">
          {f.images.map((src, i) => (
            <div key={i} className="relative size-24 overflow-hidden rounded-lg border border-stone">
              <img src={src} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink/80 text-sand"
              >
                ×
              </button>
            </div>
          ))}
          <label className="grid size-24 cursor-pointer place-items-center rounded-lg border border-dashed border-stone text-center text-xs text-muted hover:border-accent">
            {busy ? 'Processing…' : '+ Add photos'}
            <input type="file" accept="image/*" multiple onChange={addFiles} className="hidden" />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">
          Uploads are auto-resized to WebP and stored in this browser. The first photo is the cover.
        </p>
      </div>

      <div className="flex gap-3">
        <button className={btnPrimary} disabled={busy}>
          Save listing
        </button>
        <button type="button" onClick={onDone} className={`${btnGhost} text-ink`}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Dashboard({ onEdit, onLogout }) {
  const listings = useListings()
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Owner dashboard</p>
          <h1 className="mt-2 font-display text-3xl">Listings ({listings.length})</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onEdit(toForm(blank))} className={btnPrimary}>
            + Add listing
          </button>
          <button onClick={onLogout} className={`${btnGhost} text-ink`}>
            Log out
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone bg-white">
        {listings.map((p) => (
          <div key={p.id} className="flex items-center gap-4 border-b border-stone px-4 py-3 last:border-0">
            <img src={p.images[0]} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {p.title}
                {p.featured && <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-sea">Featured</span>}
              </p>
              <p className="truncate text-sm text-muted">
                {usd(p.price)} · {p.location} · {p.type}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => onEdit(toForm(p))} className={`${btn} min-h-9 border border-stone px-4 text-xs text-ink`}>
                Edit
              </button>
              <button
                onClick={() => confirm(`Delete "${p.title}"? This can't be undone.`) && removeListing(p.id)}
                className={`${btn} min-h-9 px-4 text-xs text-red-700 hover:bg-red-50`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-stone pt-6 text-sm">
        <Link to="/" className="text-muted hover:text-ink">
          ← View live site
        </Link>
        <button
          onClick={() => confirm('Reset to the original demo listings? Your changes will be lost.') && resetListings()}
          className="text-muted hover:text-red-700"
        >
          Reset to demo data
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rlg_admin') === '1')
  const [editing, setEditing] = useState(null) // form object, or null for the dashboard

  if (!authed) return <section className="pt-24">{<Gate onPass={() => setAuthed(true)} />}</section>

  const logout = () => {
    sessionStorage.removeItem('rlg_admin')
    setAuthed(false)
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:pt-32 lg:px-10">
      {editing ? (
        <ListingForm initial={editing} onDone={() => setEditing(null)} />
      ) : (
        <Dashboard onEdit={setEditing} onLogout={logout} />
      )}
    </section>
  )
}
