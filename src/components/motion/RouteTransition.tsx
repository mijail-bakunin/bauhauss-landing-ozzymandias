import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

let routeMotionInitialized = false

export function RouteTransition() {
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    if (!routeMotionInitialized) {
      routeMotionInitialized = true
      gsap.set(root, { display: 'none' })
      return
    }

    const panels = gsap.utils.toArray<HTMLElement>('.route-transition__panel', root)
    const timeline = gsap.timeline()
    timeline
      .set(root, { display: 'grid' })
      .set(panels, { scaleY: 1, transformOrigin: 'top' })
      .fromTo('.route-transition__code', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.18 }, 0)
      .to(panels, {
        scaleY: 0,
        duration: 0.68,
        stagger: 0.045,
        ease: 'expo.inOut',
        transformOrigin: 'bottom',
      }, 0.08)
      .to('.route-transition__code', { opacity: 0, duration: 0.16 }, 0.26)
      .set(root, { display: 'none' })
  }, { scope: rootRef, dependencies: [location.pathname, reducedMotion] })

  return (
    <div className="route-transition" ref={rootRef} aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => <i className="route-transition__panel" key={index} />)}
      <span className="route-transition__code">OZ / {location.pathname || '00'}</span>
    </div>
  )
}
