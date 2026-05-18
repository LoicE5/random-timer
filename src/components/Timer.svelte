<script lang="ts">
  import type { TimerProps } from '../types';

  let {
    status,
    totalSeconds,
    remainingSeconds,
    chosenDuration,
    showCountdown,
    canStart,
    onStart,
    onPause,
    onResume,
    onReset,
  }: TimerProps = $props();

  const RADIUS = 120;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let progress = $derived(
    totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0,
  );
  let dashOffset = $derived(CIRCUMFERENCE - progress * CIRCUMFERENCE);

  let timeText = $derived.by(() => {
    if (status === 'idle') return '--:--';
    const safeRemaining = Math.max(0, remainingSeconds);
    const minutes = Math.floor(safeRemaining / 60).toString().padStart(2, '0');
    const seconds = (safeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  let message = $derived.by(() => {
    if (status === 'paused') return 'Paused';
    if (status === 'finished') return "Time's up!";
    return '';
  });
</script>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chosen {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--muted-foreground);
    font-size: 1rem;
  }

  .chosen-val {
    color: var(--primary);
    font-weight: 600;
  }

  .circle {
    position: relative;
    width: 16rem;
    height: 16rem;
    padding: 1.5rem 0;
  }

  @media (min-width: 768px) {
    .circle {
      width: 20rem;
      height: 20rem;
    }
  }

  .ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  .bg {
    stroke: var(--muted);
  }

  .progress {
    stroke: var(--primary);
    transition: stroke-dashoffset 0.2s ease, stroke 0.2s ease;
  }

  .progress.finished {
    stroke: var(--destructive);
  }

  .center {
    position: absolute;
    inset: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .time {
    font-size: 3.25rem;
    font-weight: 300;
    letter-spacing: -0.05em;
    color: var(--foreground);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .time.finished {
    color: var(--destructive);
  }

  @media (min-width: 768px) {
    .time {
      font-size: 4.75rem;
    }
  }

  .msg {
    margin-top: 0.75rem;
    font-size: 1.125rem;
    font-weight: 500;
  }

  .msg.paused {
    color: var(--accent);
  }

  .msg.finished {
    color: var(--destructive);
  }

  .hidden-mode {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
  }

  .hidden-label {
    font-size: 1.125rem;
    color: var(--muted-foreground);
  }

  .bar-track {
    width: 8rem;
    height: 0.25rem;
    background: var(--muted);
    border-radius: 9999px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.2s ease;
  }

  .instruction {
    margin-top: 1rem;
    color: var(--muted-foreground);
    font-size: 1.125rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.75rem;
    font-family: inherit;
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .btn:hover:not(:disabled) {
    transform: scale(1.05);
  }

  .btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    background: var(--primary);
    color: var(--primary-foreground);
    box-shadow: 0 10px 15px -3px hsla(185, 55%, 35%, 0.25);
  }

  .primary:hover:not(:disabled) {
    box-shadow: 0 20px 25px -5px hsla(185, 55%, 35%, 0.35);
  }

  .accent {
    background: var(--accent);
    color: var(--accent-foreground);
    box-shadow: 0 10px 15px -3px hsla(25, 75%, 45%, 0.25);
  }

  .accent:hover:not(:disabled) {
    box-shadow: 0 20px 25px -5px hsla(25, 75%, 45%, 0.35);
  }

  .secondary {
    background: var(--secondary);
    color: var(--foreground);
  }

  .secondary:hover:not(:disabled) {
    background: #e6e2da;
  }
</style>

<div class="wrap">
  {#if status !== 'idle' && showCountdown}
    <p class="chosen">
      Random timer duration: <span class="chosen-val">{chosenDuration} {chosenDuration === 1 ? 'minute' : 'minutes'}</span>
    </p>
  {/if}

  <div class="circle">
    {#if showCountdown}
      <svg viewBox="0 0 260 260" class="ring">
        <circle cx="130" cy="130" r={RADIUS} class="bg" stroke-width="8" fill="none" />
        <circle
          cx="130"
          cy="130"
          r={RADIUS}
          class="progress"
          class:finished={status === 'finished'}
          stroke-width="8"
          stroke-linecap="round"
          fill="none"
          stroke-dasharray={CIRCUMFERENCE}
          stroke-dashoffset={dashOffset}
        />
      </svg>
      <div class="center">
        <div class="time" class:finished={status === 'finished'}>{timeText}</div>
        {#if message}
          <div class="msg" class:paused={status === 'paused'} class:finished={status === 'finished'}>
            {message}
          </div>
        {/if}
      </div>
    {:else}
      <div class="hidden-mode">
        <div class="hidden-label">
          {#if status === 'running'}Timer running…
          {:else if status === 'paused'}Paused
          {:else if status === 'finished'}Time's up!
          {:else}Timer hidden{/if}
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: {Math.min(100, progress * 100)}%"></div>
        </div>
      </div>
    {/if}
  </div>

  {#if status === 'idle'}
    <p class="instruction">Set your random timer and press Start</p>
  {/if}

  <div class="controls">
    {#if status === 'idle'}
      <button class="btn primary" disabled={!canStart} onclick={onStart}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        Start
      </button>
    {/if}
    {#if status === 'running'}
      <button class="btn accent" onclick={onPause}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        Pause
      </button>
    {/if}
    {#if status === 'paused'}
      <button class="btn primary" onclick={onResume}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        Resume
      </button>
    {/if}
    {#if status === 'paused' || status === 'finished'}
      <button class="btn secondary" onclick={onReset}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
        Reset
      </button>
    {/if}
    {#if status === 'finished'}
      <button class="btn primary" disabled={!canStart} onclick={onStart}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        Start again
      </button>
    {/if}
  </div>
</div>
