import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface AmbientCanvasProps {
  intensity?: number
}

export function AmbientCanvas({ intensity = 1 }: AmbientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let frame = 0
    let previousFrame = 0
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const handlePointer = (event: PointerEvent) => {
      pointer.targetX = event.clientX / Math.max(width, 1)
      pointer.targetY = event.clientY / Math.max(height, 1)
    }

    const draw = (time = 0) => {
      if (!reducedMotion && time - previousFrame < 30) {
        frame = requestAnimationFrame(draw)
        return
      }
      previousFrame = time
      pointer.x += (pointer.targetX - pointer.x) * 0.045
      pointer.y += (pointer.targetY - pointer.y) * 0.045

      const styles = getComputedStyle(document.documentElement)
      const ink = styles.getPropertyValue('--ink-rgb').trim() || '14, 14, 12'
      const orange = styles.getPropertyValue('--orange').trim() || '#e96f2b'
      const ochre = styles.getPropertyValue('--ochre').trim() || '#b78618'
      context.clearRect(0, 0, width, height)

      const driftX = (pointer.x - 0.5) * 28 * intensity
      const driftY = (pointer.y - 0.5) * 22 * intensity
      context.lineCap = 'square'

      for (let index = 0; index < 9; index += 1) {
        const baseX = ((index * 0.173 + 0.08) % 1) * width
        const baseY = ((index * 0.287 + 0.12) % 1) * height
        const phase = reducedMotion ? 0 : Math.sin(time * 0.00022 + index) * 9
        context.beginPath()
        context.moveTo(baseX - 100 + driftX * (index % 3) * 0.16, baseY + phase)
        context.lineTo(baseX + 140 + driftX, baseY - 80 + driftY + phase)
        context.strokeStyle = `rgba(${ink}, ${index % 3 === 0 ? 0.1 : 0.055})`
        context.lineWidth = index % 4 === 0 ? 2.5 : 1
        context.stroke()
      }

      const circles = [
        { x: 0.16, y: 0.26, r: 34, color: orange, width: 12 },
        { x: 0.74, y: 0.18, r: 23, color: ochre, width: 8 },
        { x: 0.82, y: 0.7, r: 52, color: `rgba(${ink}, .13)`, width: 1 },
      ]
      circles.forEach((circle, index) => {
        context.beginPath()
        context.arc(
          circle.x * width + driftX * (index + 1) * 0.2,
          circle.y * height + driftY * (index + 1) * 0.15,
          circle.r,
          Math.PI * (0.15 + index * 0.2),
          Math.PI * (1.55 + index * 0.16),
        )
        context.strokeStyle = circle.color
        context.globalAlpha = 0.26
        context.lineWidth = circle.width
        context.stroke()
      })
      context.globalAlpha = 1

      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', handlePointer, { passive: true })
    draw()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointer)
    }
  }, [intensity, reducedMotion])

  return <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />
}

