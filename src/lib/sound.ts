export type SoundCue = 'assemble' | 'navigate' | 'open' | 'success' | 'motion'

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
    motion: [278, 294],
  }

  const duration = cue === 'motion' ? 0.085 : 0.16
  const peak = cue === 'motion' ? 0.008 : 0.025
  oscillator.type = cue === 'assemble' ? 'triangle' : 'sine'
  oscillator.frequency.setValueAtTime(frequencies[cue][0], now)
  oscillator.frequency.exponentialRampToValueAtTime(frequencies[cue][1], now + duration)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.018)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.035)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + duration + 0.05)
}
