<script lang="ts">
  import { onDestroy } from 'svelte';
  import Timer from './Timer.svelte';
  import Settings from './Settings.svelte';
  import { playSound } from '../utils/sounds';
  import type { Status, SoundName, TimerErrors } from '../types';

  const STORAGE_KEYS = {
    min: 'timer-min',
    max: 'timer-max',
    sound: 'timer-sound',
    showCountdown: 'timer-showCountdown',
  } as const;

  const ALARM_INTERVAL_MS = 2500;
  const TICK_INTERVAL_MS = 100;

  function loadNumber(key: string, fallback: number): number {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function loadSound(key: string, fallback: SoundName): SoundName {
    const raw = localStorage.getItem(key);
    return (raw as SoundName) ?? fallback;
  }
  function loadBoolean(key: string, fallback: boolean): boolean {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === 'true';
  }

  let minMinutes = $state(loadNumber(STORAGE_KEYS.min, 5));
  let maxMinutes = $state(loadNumber(STORAGE_KEYS.max, 15));
  let sound = $state<SoundName>(loadSound(STORAGE_KEYS.sound, 'bell'));
  let showCountdown = $state(loadBoolean(STORAGE_KEYS.showCountdown, true));

  let status = $state<Status>('idle');
  let totalSeconds = $state(0);
  let remainingSeconds = $state(0);
  let chosenDuration = $state(0);

  let endTimeMs = 0;
  let pausedRemainingSeconds = 0;
  let tickIntervalId: ReturnType<typeof setInterval> | null = null;
  let alarmIntervalId: ReturnType<typeof setInterval> | null = null;

  $effect(() => { localStorage.setItem(STORAGE_KEYS.min, String(minMinutes)); });
  $effect(() => { localStorage.setItem(STORAGE_KEYS.max, String(maxMinutes)); });
  $effect(() => { localStorage.setItem(STORAGE_KEYS.sound, sound); });
  $effect(() => { localStorage.setItem(STORAGE_KEYS.showCountdown, String(showCountdown)); });

  $effect(() => {
    document.body.classList.toggle('running', status === 'running');
  });

  let errors = $derived.by<TimerErrors>(() => {
    const validationErrors: TimerErrors = {};
    if (!Number.isFinite(minMinutes) || minMinutes < 1) {
      validationErrors.min = 'Minimum must be at least 1.';
    }
    if (!Number.isFinite(maxMinutes) || maxMinutes < 1) {
      validationErrors.max = 'Maximum must be at least 1.';
    } else if (maxMinutes < minMinutes) {
      validationErrors.max = 'Maximum must be ≥ minimum.';
    }
    return validationErrors;
  });

  let canStart = $derived(!errors.min && !errors.max);

  function clearTick(): void {
    if (tickIntervalId !== null) {
      clearInterval(tickIntervalId);
      tickIntervalId = null;
    }
  }

  function stopAlarm(): void {
    if (alarmIntervalId !== null) {
      clearInterval(alarmIntervalId);
      alarmIntervalId = null;
    }
  }

  function tick(): void {
    const remaining = Math.ceil((endTimeMs - Date.now()) / 1000);
    if (remaining <= 0) {
      remainingSeconds = 0;
      status = 'finished';
      clearTick();
      startAlarm();
    } else {
      remainingSeconds = remaining;
    }
  }

  function startAlarm(): void {
    if (sound === 'none') return;
    playSound(sound);
    alarmIntervalId = setInterval(() => playSound(sound), ALARM_INTERVAL_MS);
  }

  function startTimer(): void {
    if (!canStart) return;
    stopAlarm();
    clearTick();
    const lowerBound = Math.floor(minMinutes);
    const upperBound = Math.floor(maxMinutes);
    chosenDuration = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    totalSeconds = chosenDuration * 60;
    remainingSeconds = totalSeconds;
    endTimeMs = Date.now() + totalSeconds * 1000;
    status = 'running';
    tickIntervalId = setInterval(tick, TICK_INTERVAL_MS);
  }

  function pauseTimer(): void {
    if (status !== 'running') return;
    pausedRemainingSeconds = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
    remainingSeconds = pausedRemainingSeconds;
    clearTick();
    status = 'paused';
  }

  function resumeTimer(): void {
    if (status !== 'paused') return;
    endTimeMs = Date.now() + pausedRemainingSeconds * 1000;
    status = 'running';
    tickIntervalId = setInterval(tick, TICK_INTERVAL_MS);
  }

  function resetTimer(): void {
    clearTick();
    stopAlarm();
    status = 'idle';
    totalSeconds = 0;
    remainingSeconds = 0;
    chosenDuration = 0;
    pausedRemainingSeconds = 0;
    endTimeMs = 0;
  }

  function testSound(): void {
    playSound(sound);
  }

  onDestroy(() => {
    clearTick();
    stopAlarm();
    document.body.classList.remove('running');
  });
</script>

<style>
  .app {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--foreground);
  }

  .title {
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    color: var(--foreground);
  }

  @media (min-width: 768px) {
    .title {
      font-size: 1.875rem;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 3.5rem;
  }
</style>

<div class="app">
  <header class="header">
    <h1 class="title">Random Timer</h1>
  </header>

  <main class="main">
    <Timer
      {status}
      {totalSeconds}
      {remainingSeconds}
      {chosenDuration}
      {showCountdown}
      {canStart}
      onStart={startTimer}
      onPause={pauseTimer}
      onResume={resumeTimer}
      onReset={resetTimer}
    />

    <Settings
      bind:minMinutes
      bind:maxMinutes
      bind:sound
      bind:showCountdown
      {errors}
      onTestSound={testSound}
    />
  </main>
</div>
