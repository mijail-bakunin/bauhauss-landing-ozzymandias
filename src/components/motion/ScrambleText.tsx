import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789△○□◇/—'

interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
  replayOnHover?: boolean
}

export function ScrambleText({
  text,
  className = '',
  duration = 820,
  delay = 0,
  replayOnHover = true,
}: ScrambleTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const animationRef = useRef(0)
  const timeoutRef = useRef(0)
  const hasPlayedRef = useRef(false)
  const reducedMotion = useReducedMotion()
  const target = useMemo(() => Array.from(text), [text])
  const [displayState, setDisplayState] = useState(() => ({ source: text, characters: target }))
  const displayed = displayState.source === text ? displayState.characters : target
  const words = useMemo(() => text.split(' ').map((word, index, allWords) => ({
    word,
    start: index === 0 ? 0 : Array.from(`${allWords.slice(0, index).join(' ')} `).length,
  })), [text])

  const run = useCallback(() => {
    window.cancelAnimationFrame(animationRef.current)
    window.clearTimeout(timeoutRef.current)

    if (reducedMotion) {
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      const startedAt = performance.now()
      let lastPaint = 0

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const resolved = Math.floor(eased * target.length)

        if (now - lastPaint > 34 || progress === 1) {
          lastPaint = now
          setDisplayState({
            source: text,
            characters: target.map((character, index) => {
              if (/\s/.test(character) || index < resolved || progress === 1) return character
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            }),
          })
        }

        if (progress < 1) animationRef.current = window.requestAnimationFrame(tick)
      }

      animationRef.current = window.requestAnimationFrame(tick)
    }, delay)
  }, [delay, duration, reducedMotion, target, text])

  useEffect(() => {
    hasPlayedRef.current = false
    const element = rootRef.current
    if (!element || reducedMotion) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasPlayedRef.current) return
      hasPlayedRef.current = true
      run()
      observer.disconnect()
    }, { threshold: 0.45, rootMargin: '0px 0px -8% 0px' })

    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(animationRef.current)
      window.clearTimeout(timeoutRef.current)
    }
  }, [reducedMotion, run, target])

  return (
    <span
      ref={rootRef}
      className={`scramble-text ${className}`}
      aria-label={text}
      onPointerEnter={() => replayOnHover && hasPlayedRef.current && run()}
    >
      <span aria-hidden="true">
        {words.map(({ word, start }, wordIndex) => {
          return (
            <span className="scramble-word" key={`${word}-${wordIndex}`}>
              {Array.from(word).map((character, characterIndex) => {
                const index = start + characterIndex
                return (
                  <span className="scramble-character" key={`${character}-${characterIndex}`}>
                    <span className="scramble-character__measure">{character}</span>
                    <span className="scramble-character__visual">{displayed[index] ?? character}</span>
                  </span>
                )
              })}
              {wordIndex < words.length - 1 && <span className="scramble-space">&nbsp;</span>}
            </span>
          )
        })}
      </span>
    </span>
  )
}
