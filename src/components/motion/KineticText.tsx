import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface KineticTextProps {
  text: string
  className?: string
  drift?: boolean
}

export function KineticText({ text, className = '', drift = true }: KineticTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const element = rootRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setActive(true)
      observer.disconnect()
    }, { threshold: 0.28, rootMargin: '0px 0px -7% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <span
      ref={rootRef}
      className={`kinetic-text ${active || reducedMotion ? 'is-active' : ''} ${className}`}
      data-drift={drift ? 'true' : 'false'}
      data-kinetic-heading
      aria-label={text}
    >
      <span aria-hidden="true">
        {text.split(' ').map((word, index) => (
          <span className="kinetic-word-clip" key={`${word}-${index}`}>
            <span className="kinetic-word" style={{ '--word-index': index } as CSSProperties}>
              {word}
            </span>
            {index < text.split(' ').length - 1 && <>&nbsp;</>}
          </span>
        ))}
      </span>
    </span>
  )
}
