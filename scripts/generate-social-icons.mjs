import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('public/images/social')
const paper = '#f1efe7'
const ink = '#0d0e0c'
const orange = '#e96f2b'
const ochre = '#b58417'

const construction = `
  <path d="M8 48H184M48 8V184" stroke="${ink}" stroke-opacity=".13" stroke-width="2"/>
  <path d="M144 8V184M8 144H184" stroke="${ink}" stroke-opacity=".08" stroke-width="2"/>
  <circle cx="144" cy="48" r="23" fill="none" stroke="${ink}" stroke-opacity=".16" stroke-width="2"/>
`

const frame = (content) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
    <rect x="7" y="7" width="178" height="178" fill="${paper}" stroke="${ink}" stroke-width="2"/>
    ${construction}
    ${content}
    <rect x="14" y="164" width="72" height="8" fill="${orange}"/>
    <circle cx="164" cy="28" r="13" fill="${ochre}"/>
  </svg>
`

const icons = {
  youtube: frame(`
    <rect x="37" y="58" width="118" height="78" rx="19" fill="${ink}"/>
    <path d="M83 78L119 97L83 118Z" fill="${orange}"/>
    <path d="M27 47H69M27 47V89" fill="none" stroke="${ink}" stroke-width="4"/>
  `),
  instagram: frame(`
    <rect x="43" y="43" width="106" height="106" rx="28" fill="none" stroke="${ink}" stroke-width="10"/>
    <circle cx="96" cy="96" r="25" fill="none" stroke="${ink}" stroke-width="10"/>
    <circle cx="128" cy="64" r="8" fill="${orange}"/>
    <path d="M29 129H62M29 129V96" fill="none" stroke="${ochre}" stroke-width="5"/>
  `),
  twitter: frame(`
    <g transform="translate(28 28) scale(8.5)" fill="${ink}">
      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q0-.211-.009-.423A6.7 6.7 0 0 0 16 3.542a6.6 6.6 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.084.797A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15"/>
    </g>
    <circle cx="54" cy="132" r="10" fill="${orange}"/>
  `),
}

await mkdir(outputDirectory, { recursive: true })
await Promise.all(Object.entries(icons).map(([name, svg]) => (
  sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(outputDirectory, `${name}.png`))
)))

console.log(`Generated ${Object.keys(icons).length} social icons in ${outputDirectory}`)
