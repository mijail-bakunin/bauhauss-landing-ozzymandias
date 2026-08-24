import { useEffect, useRef } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-action]'

export function ArtCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const finePointer = window.matchMedia('(pointer: fine)')
    if (!cursor || !finePointer.matches) return

    const root = document.documentElement
    let frame = 0
    let targetX = -60
    let targetY = -60
    let currentX = -60
    let currentY = -60
    let magneticTarget: HTMLElement | null = null

    const resetMagnetic = () => {
      if (!magneticTarget) return
      magneticTarget.style.removeProperty('--magnetic-x')
      magneticTarget.style.removeProperty('--magnetic-y')
      magneticTarget = null
    }

    const render = () => {
      currentX += (targetX - currentX) * 0.42
      currentY += (targetY - currentY) * 0.42
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      frame = window.requestAnimationFrame(render)
    }

    const move = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      cursor.dataset.visible = 'true'

      const target = event.target instanceof Element ? event.target : null
      cursor.dataset.mode = target?.closest(INTERACTIVE_SELECTOR) ? 'action' : 'default'
      const nextMagnetic = target?.closest<HTMLElement>('[data-magnetic]') ?? null

      if (nextMagnetic !== magneticTarget) {
        resetMagnetic()
        magneticTarget = nextMagnetic
      }

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect()
        const x = (event.clientX - (rect.left + rect.width / 2)) * 0.11
        const y = (event.clientY - (rect.top + rect.height / 2)) * 0.11
        magneticTarget.style.setProperty('--magnetic-x', `${x}px`)
        magneticTarget.style.setProperty('--magnetic-y', `${y}px`)
      }
    }

    const hide = () => {
      cursor.dataset.visible = 'false'
      resetMagnetic()
    }
    const press = () => { cursor.dataset.pressed = 'true' }
    const release = () => { cursor.dataset.pressed = 'false' }

    root.classList.add('art-cursor-enabled')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    frame = window.requestAnimationFrame(render)

    return () => {
      root.classList.remove('art-cursor-enabled')
      window.cancelAnimationFrame(frame)
      resetMagnetic()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [])

  return (
    <div className="art-cursor" ref={cursorRef} data-visible="false" data-mode="default" aria-hidden="true">
      <span className="art-cursor__tip" />
      <span className="art-cursor__echo" />
    </div>
  )
}
