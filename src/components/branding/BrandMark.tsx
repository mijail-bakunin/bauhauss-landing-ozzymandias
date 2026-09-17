interface BrandMarkProps {
  className?: string
  label?: string
  decorative?: boolean
}

export function BrandMark({
  className = '',
  label = 'Ozzymandias',
  decorative = false,
}: BrandMarkProps) {
  return (
    <svg
      className={`brand-mark ${className}`}
      data-motion-reactive="self"
      data-motion-strength="3"
      viewBox="0 0 64 64"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      {!decorative && <title>{label}</title>}
      <circle className="mark-ring mark-ring--outer" cx="26" cy="32" r="17" />
      <circle className="mark-ring mark-ring--inner" cx="26" cy="32" r="9" />
      <path className="mark-line" d="M4 32h44M26 8v48M14 50 48 16" />
      <rect className="mark-block" x="43" y="25" width="13" height="13" />
      <circle className="mark-dot" cx="50" cy="15" r="5" />
    </svg>
  )
}
