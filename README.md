# Aurelia Estates

React + Vite. Lenis smooth scroll, GSAP ScrollTrigger animations, a Three.js ambient
layer in the hero, Tailwind v4 for styling.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run images   # /images/*.jpg  ->  /public/images/*.webp
```

## Where things live

| Path | What |
|---|---|
| `src/data.js` | All listing/testimonial/stat content. Edit this, not the pages. |
| `src/ui.jsx` | Shared pieces: `Img` (skeleton + lazy), `Reveal`, `Counter`, `PropertyCard`, nav, footer. |
| `src/pages/` | Home, Listings, Property detail, About. |
| `src/ThreeAmbient.jsx` | Hero WebGL layer. Lazy-loaded, and off entirely under `prefers-reduced-motion`. |
| `images/` | Source photos (originals). Not served. |
| `public/images/` | Generated WebP the site actually loads. |

## Adding photos

Drop originals in `images/properties/` named `property-<id>-<view>.jpg`, run
`npm run images`, then add the `.webp` paths to the listing's `images` array in
`src/data.js`. Hero and lifestyle files get renamed by the `rename` map in
`scripts/optimize-images.mjs` — add an entry there if the source filename is messy.

## Known placeholders

- Listings 003–006 reuse hero/lifestyle photos; only 001 and 002 have real photo sets.
- `About.jsx` team headshots are stand-ins — no `agent-*.jpg` assets exist yet.
- Phone, email and DRE numbers are fake.
