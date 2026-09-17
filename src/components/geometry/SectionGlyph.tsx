interface SectionGlyphProps {
  variant: 'systems' | 'products' | 'experiences' | 'contact'
  className?: string
}

export function SectionGlyph({ variant, className = '' }: SectionGlyphProps) {
  return (
    <svg
      className={`section-glyph section-glyph--${variant} ${className}`}
      data-motion-reactive="self"
      data-motion-reveal="repeat"
      data-motion-sound
      data-motion-strength="5"
      viewBox="0 0 160 160"
      aria-hidden="true"
    >
      <g className="glyph-construction">
        <path d="M18 30h108v104M30 18v124M10 96h140M88 8v144" />
      </g>
      {variant === 'systems' && (
        <>
          <rect x="30" y="30" width="62" height="62" />
          <rect className="glyph-accent" x="64" y="64" width="66" height="66" />
          <circle className="glyph-fill glyph-fill--orange" cx="105" cy="48" r="22" />
          <circle className="glyph-fill glyph-fill--ochre" cx="130" cy="22" r="18" />
          <path className="glyph-heavy" d="M47 112 116 43" />
        </>
      )}
      {variant === 'products' && (
        <>
          <rect x="26" y="44" width="42" height="42" />
          <rect x="58" y="24" width="62" height="76" />
          <rect className="glyph-heavy" x="90" y="68" width="46" height="58" />
          <rect className="glyph-fill glyph-fill--orange" x="62" y="28" width="28" height="22" />
          <rect className="glyph-fill glyph-fill--ochre" x="34" y="96" width="22" height="22" />
        </>
      )}
      {variant === 'experiences' && (
        <>
          <path className="glyph-heavy" d="M28 34 132 138M130 28 30 132" />
          <path className="glyph-accent" d="M38 66a46 46 0 0 1 84 0" />
          <circle className="glyph-fill" cx="80" cy="58" r="17" />
          <path className="glyph-fill glyph-fill--orange" d="M28 46 66 88 45 110 14 74Z" />
          <circle className="glyph-fill glyph-fill--ochre" cx="94" cy="118" r="14" />
        </>
      )}
      {variant === 'contact' && (
        <>
          <circle cx="80" cy="80" r="50" />
          <circle className="glyph-accent" cx="80" cy="80" r="28" />
          <path className="glyph-heavy" d="M12 80h136M80 12v136" />
          <rect className="glyph-fill glyph-fill--orange" x="108" y="26" width="26" height="26" />
        </>
      )}
    </svg>
  )
}
