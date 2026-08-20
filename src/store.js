// Live listings store.
//
// The site is a static SPA with no backend, so listings are persisted in
// IndexedDB (not localStorage — property photos stored as data URLs would blow
// the ~5MB localStorage quota). `data.js` only SEEDS the store on first load;
// after that IndexedDB is the source of truth and the owner manages listings
// through /admin.
//
// ponytail: per-browser storage — the owner's listings only show on their own
// browser. Swap this module for a real backend (Supabase/Firebase) when the
// site needs shared, multi-device inventory. Pages just call useListings().
import { useSyncExternalStore } from 'react'
import { properties as seed } from './data.js'

const DB = 'realtorlg'
const STORE = 'kv'
const KEY = 'listings'

let listings = seed // synchronous default until IndexedDB resolves
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const rq = db.transaction(STORE).objectStore(STORE).get(KEY)
    rq.onsuccess = () => resolve(rq.result)
    rq.onerror = () => reject(rq.error)
  })
}

async function idbSet(value) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Boot: load saved listings, or seed the store on first ever visit.
;(async () => {
  try {
    const saved = await idbGet()
    if (Array.isArray(saved) && saved.length) {
      listings = saved
      emit()
    } else {
      await idbSet(seed)
    }
  } catch {
    /* IndexedDB unavailable (private mode, etc.) — fall back to the seed in memory. */
  }
})()

function persist(next) {
  listings = next
  emit()
  idbSet(next).catch(() => {})
}

export function useListings() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => listings,
    () => listings,
  )
}

export function useListing(id) {
  return useListings().find((p) => p.id === id)
}

export function useListingTypes() {
  return ['All', ...new Set(useListings().map((p) => p.type))]
}

/** Insert or replace a listing (matched by id). */
export function saveListing(listing) {
  const exists = listings.some((p) => p.id === listing.id)
  persist(exists ? listings.map((p) => (p.id === listing.id ? listing : p)) : [listing, ...listings])
}

export function removeListing(id) {
  persist(listings.filter((p) => p.id !== id))
}

/** Restore the built-in demo listings, discarding owner edits. */
export function resetListings() {
  persist(seed)
}

/** Next zero-padded id, one past the highest numeric id in the store. */
export function nextId() {
  const max = listings.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0)
  return String(max + 1).padStart(3, '0')
}

/**
 * Read an uploaded image File and return a downscaled WebP data URL — keeps
 * IndexedDB small and images fast, without a build step or upload server.
 */
export function fileToDataUrl(file, maxW = 1400, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxW / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/webp', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}
