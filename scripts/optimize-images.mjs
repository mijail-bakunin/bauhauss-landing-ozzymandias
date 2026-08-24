import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imageDirectory = path.resolve('public/images')
const sourceImages = (await readdir(imageDirectory)).filter((file) =>
  file.endsWith('.png'),
)

await Promise.all(
  sourceImages.map(async (file) => {
    const source = path.join(imageDirectory, file)
    const destination = path.join(
      imageDirectory,
      file.replace(/\.png$/i, '.webp'),
    )

    await sharp(source)
      .resize({ width: 1440, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(destination)
  }),
)

console.log(`Optimized ${sourceImages.length} portfolio images.`)
