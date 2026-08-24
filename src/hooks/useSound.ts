import { useCallback, useState } from 'react'
import { playSound, type SoundCue } from '../lib/sound'
import { track } from '../lib/analytics'

const SOUND_KEY = 'ozzy-sound'

export function useSound() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(SOUND_KEY) === 'true')

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current
      localStorage.setItem(SOUND_KEY, String(next))
      track('audio_enable', { enabled: next })
      if (next) window.setTimeout(() => playSound('assemble', true), 20)
      return next
    })
  }, [])

  const cue = useCallback((name: SoundCue) => playSound(name, enabled), [enabled])

  return { soundEnabled: enabled, toggleSound: toggle, cue }
}

