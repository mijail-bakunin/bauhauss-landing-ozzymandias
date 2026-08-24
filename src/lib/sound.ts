export type SoundCue = 'assemble' | 'navigate' | 'open' | 'success'

let audioContext: AudioContext | null = null

function context() {
  if (!audioContext) audioContext = new AudioContext()
  return audioContext
}

export function playSound(cue: SoundCue, enabled: boolean) {
  if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const ctx = context()
  const now = ctx.currentTime
  const gain = ctx.createGain()
  const oscillator = ctx.createOscillator()
  const frequencies: Record<SoundCue, [number, number]> = {
    assemble: [164, 246],
    navigate: [220, 196],
    open: [196, 293],
    success: [220, 330],
  }

  oscillator.type = cue === 'assemble' ? 'triangle' : 'sine'
  oscillator.frequency.setValueAtTime(frequencies[cue][0], now)
  oscillator.frequency.exponentialRampToValueAtTime(frequencies[cue][1], now + 0.16)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.025, now + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.22)
}

