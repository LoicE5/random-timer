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

  let progress = $derived(
    totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0,
  );

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
    align-items: stretch;
  }

  .chosen {
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted-foreground);
    margin-bottom: 1rem;
  }

  .chosen-val {
    color: var(--foreground);
    font-weight: 700;
  }

  .time {
    font-size: 5rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--foreground);
    font-variant-numeric: tabular-nums;
    line-height: 0.95;
  }

  @media (min-width: 768px) {
    .time {
      font-size: 8rem;
    }
  }

  .msg {
    margin-top: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--foreground);
  }

  .hidden-label {
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-foreground);
    padding: 1.5rem 0;
  }

  .bar {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 0.5rem;
    margin-top: 2rem;
    border: none;
    background: var(--muted);
    overflow: hidden;
  }

  .bar::-webkit-progress-bar {
    background: var(--muted);
  }

  .bar::-webkit-progress-value {
    background: var(--foreground);
    transition: width 0.2s linear;
  }

  .bar::-moz-progress-bar {
    background: var(--foreground);
  }

  .instruction {
    margin-top: 1.25rem;
    color: var(--muted-foreground);
    font-size: 1rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2.5rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border: 2px solid var(--foreground);
    border-radius: 0;
    font-family: inherit;
    font-weight: 700;
    font-size: 0.9375rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .primary {
    background: var(--foreground);
    color: var(--primary-foreground);
  }

  .primary:hover:not(:disabled) {
    background: var(--background);
    color: var(--foreground);
  }

  .accent,
  .secondary {
    background: var(--background);
    color: var(--foreground);
  }

  .accent:hover:not(:disabled),
  .secondary:hover:not(:disabled) {
    background: var(--foreground);
    color: var(--primary-foreground);
  }
</style>

<div class="wrap">
  {#if status !== 'idle' && showCountdown}
    <p class="chosen">
      Random duration — <span class="chosen-val">{chosenDuration} {chosenDuration === 1 ? 'minute' : 'minutes'}</span>
    </p>
  {/if}

  {#if showCountdown}
    <output class="time">{timeText}</output>
    {#if message}
      <p class="msg">{message}</p>
    {/if}
  {:else}
    <p class="hidden-label">
      {#if status === 'running'}Timer running…
      {:else if status === 'paused'}Paused
      {:else if status === 'finished'}Time's up!
      {:else}Timer hidden{/if}
    </p>
  {/if}

  <progress class="bar" value={progress} max="1" aria-label="Timer progress"></progress>

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
