// One-off: /images/**.jpg (originals) -> /public/images/**.webp (served).
// Re-run after dropping new source photos in /images. `npm run images`
import { readdir, mkdir } from 'node:fs/promises'
import { join, relative, dirname } from 'node:path'
import sharp from 'sharp'

const SRC = 'images'
const OUT = 'public/images'

const walk = async (dir) =>
  (await Promise.all(
    (await readdir(dir, { withFileTypes: true })).map((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name),
    ),
  )).flat()

// Source filenames are messy generator output; the site expects clean ones.
const rename = {
  'watermark-removed-Elegant_modern_real_estate_building_202608032313.jpg': 'hero/hero-01.webp',
  'watermark-removed-Modern_coastal_villa_ocean_views_202608032313.jpg': 'hero/hero-02.webp',
  'watermark-removed-Elementary_school_building_USA_2K_202608040013.jpg': 'lifestyle/lifestyle-school-01.webp',
  'watermark-removed-Neighborhood_park_with_families_____202608040013.jpg': 'lifestyle/lifestyle-park-01.webp',
  'watermark-removed-Streetfront_neighborhood_cafe_USA_2K_202608040013.jpg': 'lifestyle/lifestyle-cafe-01.webp',
}

for (const file of await walk(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const base = file.split(/[\\/]/).pop()
  const out = join(OUT, rename[base] ?? relative(SRC, file).replace(/\.[^.]+$/, '.webp'))
  await mkdir(dirname(out), { recursive: true })
  // 1600px covers the widest slot (full-bleed hero) on a 2x display without
  // going silly; q72 is where these photos stop shrinking without visible loss.
  // ponytail: single size for every slot — add a srcset pipeline if mobile
  // data cost ever shows up in the numbers.
  const info = await sharp(file).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out)
  console.log(`${out}  ${Math.round(info.size / 1024)}KB`)
}
