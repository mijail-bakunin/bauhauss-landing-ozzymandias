import { useEffect, type RefObject } from 'react'
import type { SoundCue } from '../lib/sound'
import { useReducedMotion } from './useReducedMotion'

type CuePlayer = (cue: SoundCue) => void

const REACTIVE_SELECTOR = '[data-motion-reactive]'
const SOUND_SELECTOR = '[data-motion-sound]'

function resetMotion(element: HTMLElement | null) {
  if (!element) return
  element.style.setProperty('--motion-x', '0px')
  element.style.setProperty('--motion-y', '0px')
  element.style.setProperty('--motion-x-inverse', '0px')
  element.style.setProperty('--motion-y-inverse', '0px')
  element.style.setProperty('--motion-rotation', '0deg')
}

export function useMotionField(scopeRef: RefObject<HTMLElement | null>, playCue: CuePlayer) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const scope = scopeRef.current
    const finePointer = window.matchMedia('(pointer: fine)')
    if (!scope || reducedMotion || !finePointer.matches) return

    let frame = 0
    let active: HTMLElement | null = null
    let pointerX = 0
    let pointerY = 0
    let lastSoundTarget: HTMLElement | null = null
    let lastSoundAt = 0

    const paint = () => {
      frame = 0
      if (!active) return
      const rect = active.getBoundingClientRect()
      const strength = Number(active.dataset.motionStrength ?? 4)
      const normalizedX = ((pointerX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2
      const normalizedY = ((pointerY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2
      const x = Math.max(-strength, Math.min(strength, normalizedX * strength))
      const y = Math.max(-strength, Math.min(strength, normalizedY * strength))

      active.style.setProperty('--motion-x', `${x.toFixed(2)}px`)
      active.style.setProperty('--motion-y', `${y.toFixed(2)}px`)
      active.style.setProperty('--motion-x-inverse', `${(-x * 0.72).toFixed(2)}px`)
      active.style.setProperty('--motion-y-inverse', `${(-y * 0.72).toFixed(2)}px`)
      active.style.setProperty('--motion-rotation', `${(x * 0.16).toFixed(2)}deg`)
    }

    const move = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(REACTIVE_SELECTOR)
        : null
      const next = target && scope.contains(target) ? target : null

      if (next !== active) {
        resetMotion(active)
        active = next
      }
      if (active && !frame) frame = window.requestAnimationFrame(paint)
    }

    const sound = (event: PointerEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(SOUND_SELECTOR)
        : null
      if (!target || !scope.contains(target) || target === lastSoundTarget) return

      const now = performance.now()
      lastSoundTarget = target
      if (now - lastSoundAt < 180) return
      lastSoundAt = now
      playCue('motion')
    }

    const clearSoundTarget = (event: PointerEvent) => {
      const related = event.relatedTarget instanceof Node ? event.relatedTarget : null
      if (!lastSoundTarget || (related && lastSoundTarget.contains(related))) return
      lastSoundTarget = null
    }

    const leave = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      resetMotion(active)
      active = null
      lastSoundTarget = null
    }

    const revealTargets = Array.from(scope.querySelectorAll<HTMLElement>('[data-motion-reveal]'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement
        if (entry.isIntersecting) {
          element.classList.add('is-motion-visible')
          if (element.dataset.motionReveal === 'once') observer.unobserve(element)
        } else if (element.dataset.motionReveal === 'repeat') {
          element.classList.remove('is-motion-visible')
        }
      })
    }, { threshold: 0.24, rootMargin: '0px 0px -8% 0px' })

    revealTargets.forEach((element) => observer.observe(element))
    scope.addEventListener('pointermove', move, { passive: true })
    scope.addEventListener('pointerover', sound, { passive: true })
    scope.addEventListener('pointerout', clearSoundTarget, { passive: true })
    scope.addEventListener('pointerleave', leave, { passive: true })

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
      resetMotion(active)
      scope.removeEventListener('pointermove', move)
      scope.removeEventListener('pointerover', sound)
      scope.removeEventListener('pointerout', clearSoundTarget)
      scope.removeEventListener('pointerleave', leave)
    }
  }, [playCue, reducedMotion, scopeRef])
}
