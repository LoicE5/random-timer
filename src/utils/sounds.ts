import type { SoundName, SoundOption } from '../types';

export const SOUND_OPTIONS: ReadonlySet<SoundOption> = new Set([
  { value: 'bell', label: 'Bell' },
  { value: 'gong', label: 'Gong' },
  { value: 'beep', label: 'Digital Beep' },
  { value: 'chime', label: 'Soft Chime' },
  { value: 'none', label: 'None' },
]);

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  attack = 0.01,
  peakGain = 0.5,
): void {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.connect(gainNode).connect(context.destination);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, context.currentTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration);
}

function playBell(): void {
  const frequencies = [523.25, 659.25, 783.99];
  frequencies.forEach((frequency, index) => {
    setTimeout(() => playTone(frequency, 1.5, 'sine', 0.01), index * 100);
  });
}

function playGong(): void {
  const context = getAudioContext();

  const fundamental = context.createOscillator();
  const fundamentalGain = context.createGain();
  fundamental.connect(fundamentalGain).connect(context.destination);
  fundamental.type = 'sine';
  fundamental.frequency.setValueAtTime(150, context.currentTime);
  fundamental.frequency.exponentialRampToValueAtTime(80, context.currentTime + 2);
  fundamentalGain.gain.setValueAtTime(0, context.currentTime);
  fundamentalGain.gain.linearRampToValueAtTime(0.6, context.currentTime + 0.05);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 2.5);
  fundamental.start(context.currentTime);
  fundamental.stop(context.currentTime + 2.5);

  const harmonic = context.createOscillator();
  const harmonicGain = context.createGain();
  harmonic.connect(harmonicGain).connect(context.destination);
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(300, context.currentTime);
  harmonic.frequency.exponentialRampToValueAtTime(160, context.currentTime + 1.5);
  harmonicGain.gain.setValueAtTime(0, context.currentTime);
  harmonicGain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.02);
  harmonicGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1.5);
  harmonic.start(context.currentTime);
  harmonic.stop(context.currentTime + 1.5);
}

function playBeep(): void {
  const delaysMs = [0, 200, 400];
  delaysMs.forEach((delayMs) => {
    setTimeout(() => playTone(880, 0.15, 'square'), delayMs);
  });
}

function playChime(): void {
  const frequencies = [523.25, 587.33, 659.25, 783.99];
  frequencies.forEach((frequency, index) => {
    setTimeout(() => playTone(frequency, 0.8, 'sine', 0.02), index * 200);
  });
}

export function playSound(name: SoundName): void {
  switch (name) {
    case 'bell': return playBell();
    case 'gong': return playGong();
    case 'beep': return playBeep();
    case 'chime': return playChime();
    case 'none': return;
  }
}
