import { useId, useMemo } from 'react'

interface GeometricWordmarkProps {
  name: string
  className?: string
  density?: 1 | 2 | 3
  title?: string
}

const VIEWBOX_WIDTH = 1200
const VIEWBOX_HEIGHT = 240
const TEXT_X = 32
const TEXT_Y = 176
const TEXT_LENGTH = 1136

const outlineLanes = {
  1: [{ x: 0, y: 0, opacity: 1 }],
  2: [
    { x: -1.8, y: 0, opacity: 0.96 },
    { x: 1.8, y: 0, opacity: 0.96 },
  ],
  3: [
    { x: -2.8, y: 0, opacity: 0.9 },
    { x: 0, y: 0, opacity: 1 },
    { x: 2.8, y: 0, opacity: 0.9 },
  ],
} as const

export function GeometricWordmark({
  name,
  className = '',
  density = 3,
  title = name,
}: GeometricWordmarkProps) {
  const rawId = useId()
  const id = rawId.replace(/:/g, '')
  const sliceCount = Math.max(12, Math.min(18, name.length + 5))
  const slices = useMemo(() => Array.from({ length: sliceCount }), [sliceCount])
  const lanes = outlineLanes[density]

  const word = (
    <g className="wordmark-outline-stack" aria-hidden="true">
      {lanes.map((lane, laneIndex) => (
        <text
          className="wordmark-outline"
          data-wordmark-outline
          aria-hidden="true"
          role="presentation"
          key={laneIndex}
          x={TEXT_X}
          y={TEXT_Y}
          textLength={TEXT_LENGTH}
          lengthAdjust="spacingAndGlyphs"
          transform={`translate(${lane.x} ${lane.y})`}
          opacity={lane.opacity}
        >
          {name}
        </text>
      ))}
    </g>
  )

  return (
    <svg
      className={`geometric-wordmark ${className}`}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      <defs aria-hidden="true">
        {slices.map((_, index) => {
          const sliceWidth = VIEWBOX_WIDTH / sliceCount
          return (
            <clipPath id={`${id}-slice-${index}`} key={index}>
              <rect x={index * sliceWidth - 1} y="0" width={sliceWidth + 2} height={VIEWBOX_HEIGHT} />
            </clipPath>
          )
        })}
      </defs>

      {density > 1 && (
        <g className="wordmark-construction" aria-hidden="true">
          <line data-wordmark-guide pathLength="1" x1="10" y1="178" x2="1190" y2="178" />
          <line data-wordmark-guide pathLength="1" x1="28" y1="58" x2="1168" y2="58" />
          <line data-wordmark-guide pathLength="1" x1="78" y1="28" x2="78" y2="218" />
          <circle data-wordmark-guide pathLength="1" cx="78" cy="122" r="68" />
          <circle data-wordmark-guide pathLength="1" cx="78" cy="122" r="55" />
          <line data-wordmark-guide pathLength="1" x1="6" y1="122" x2="154" y2="122" />
          <line data-wordmark-guide pathLength="1" x1="220" y1="26" x2="345" y2="210" />
          <line data-wordmark-guide pathLength="1" x1="250" y1="20" x2="365" y2="188" />
          <line data-wordmark-guide pathLength="1" x1="466" y1="40" x2="466" y2="214" />
          <line data-wordmark-guide pathLength="1" x1="585" y1="30" x2="585" y2="210" />
          <line data-wordmark-guide pathLength="1" x1="694" y1="26" x2="694" y2="212" />
          <line data-wordmark-guide pathLength="1" x1="812" y1="35" x2="812" y2="214" />
          <line data-wordmark-guide pathLength="1" x1="928" y1="24" x2="928" y2="214" />
          <line data-wordmark-guide pathLength="1" x1="1040" y1="28" x2="1040" y2="216" />
          <path className="wordmark-guide--orange" data-wordmark-guide pathLength="1" d="M12 122 A66 66 0 0 1 80 55" />
          <path className="wordmark-guide--ochre" data-wordmark-guide pathLength="1" d="M910 176 A44 44 0 0 0 980 136" />
          <circle className="wordmark-node wordmark-node--ochre" cx="585" cy="58" r="17" />
          <circle className="wordmark-node wordmark-node--orange" cx="928" cy="178" r="10" />
        </g>
      )}

      <g aria-hidden="true">
        {slices.map((_, index) => (
          <g
            className="wordmark-slice"
            data-assembly-slice
            clipPath={`url(#${id}-slice-${index})`}
            key={index}
          >
            {word}
          </g>
        ))}
      </g>
    </svg>
  )
}
