import path from 'node:path'
import sharp from 'sharp'

const source = path.resolve('assets-source/og-card.png')
const destination = path.resolve('public/og.png')

await sharp(source)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(destination)

console.log('Created public/og.png at 1200 × 630.')
