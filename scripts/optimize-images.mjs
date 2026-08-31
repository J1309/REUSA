import { readdir, mkdir, readFile } from 'node:fs/promises'
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

const rename = {
  'download (1).jpg': 'showcase/showcase-02.webp',
  'download (2).jpg': 'showcase/showcase-03.webp',
  'download (3).jpg': 'showcase/showcase-04.webp',
  'download (4).jpg': 'showcase/showcase-05.webp',
  'download (5).jpg': 'showcase/showcase-06.webp',
  'download (6).jpg': 'showcase/showcase-07.webp',
}

for (const file of await walk(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const base = file.split(/[\\/]/).pop()
  
  let target = rename[base]
  if (!target) {
    if (base.startsWith('Discover stunning')) {
      target = 'showcase/showcase-01.webp'
    } else {
      target = relative(SRC, file).replace(/\.[^.]+$/, '.webp')
    }
  }

  const out = join(OUT, target)
  await mkdir(dirname(out), { recursive: true })
  
  const buf = await readFile(file)
  const info = await sharp(buf).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  console.log(`${out}  ${Math.round(info.size / 1024)}KB`)
}
