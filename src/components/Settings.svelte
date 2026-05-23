<script lang="ts">
  import type { SettingsProps, SoundName } from '../types';
  import { SOUND_OPTIONS } from '../utils/sounds';

  let {
    minMinutes = $bindable(),
    maxMinutes = $bindable(),
    sound = $bindable(),
    showCountdown = $bindable(),
    errors,
    onTestSound,
  }: SettingsProps = $props();

  function toggleShowCountdown(): void {
    showCountdown = !showCountdown;
  }
</script>

<style>
  .panel {
    background: var(--secondary);
    border: none;
    border-top: 2px solid var(--foreground);
    border-radius: 0;
    padding: 1.5rem 0 0;
    margin-top: 3.5rem;
  }

  .title {
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 1.5rem;
  }

  .grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .input {
    background: var(--input);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    color: var(--foreground);
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.15s ease;
    width: 100%;
  }

  .input:focus {
    outline: none;
    border-color: var(--foreground);
    box-shadow: inset 0 0 0 1px var(--foreground);
  }

  .input.error {
    border-width: 2px;
    border-color: var(--foreground);
  }

  .err {
    color: var(--foreground);
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .row {
    display: flex;
    gap: 0.5rem;
  }

  .select {
    flex: 1;
  }

  .test {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0 1rem;
    height: 2.75rem;
    border: 1px solid var(--foreground);
    border-radius: 0;
    background: var(--background);
    color: var(--foreground);
    font-family: inherit;
    font-weight: 700;
    font-size: 0.8125rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .test:hover:not(:disabled) {
    background: var(--foreground);
    color: var(--primary-foreground);
  }

  .test:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--input);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    font-size: 1rem;
  }

  .toggle {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: 0;
    border: 1px solid var(--foreground);
    background: var(--background);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s ease;
  }

  .toggle.on {
    background: var(--foreground);
  }

  .thumb {
    position: absolute;
    top: 0.1875rem;
    left: 0.1875rem;
    width: 0.875rem;
    height: 0.875rem;
    background: var(--foreground);
    border-radius: 0;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .thumb.on {
    transform: translateX(1.25rem);
    background: var(--primary-foreground);
  }
</style>

<section class="panel">
  <h2 class="title">Settings</h2>

  <div class="grid">
    <div class="cell">
      <h3 class="label">Minimum</h3>
      <input
        class="input"
        class:error={errors.min}
        type="number"
        min="1"
        bind:value={minMinutes}
        aria-label="Minimum minutes"
      />
      {#if errors.min}<p class="err">{errors.min}</p>{/if}
    </div>

    <div class="cell">
      <h3 class="label">Sound</h3>
      <div class="row">
        <select class="input select" bind:value={sound} aria-label="End sound">
          {#each SOUND_OPTIONS as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <button class="test" disabled={sound === ('none' satisfies SoundName)} onclick={onTestSound}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          Test
        </button>
      </div>
    </div>

    <div class="cell">
      <h3 class="label">Maximum</h3>
      <input
        class="input"
        class:error={errors.max}
        type="number"
        min="1"
        bind:value={maxMinutes}
        aria-label="Maximum minutes"
      />
      {#if errors.max}<p class="err">{errors.max}</p>{/if}
    </div>

    <div class="cell">
      <h3 class="label">Display</h3>
      <div class="toggle-row">
        <span>Show countdown</span>
        <button
          class="toggle"
          class:on={showCountdown}
          role="switch"
          aria-checked={showCountdown}
          aria-label="Toggle show countdown"
          onclick={toggleShowCountdown}
        >
          <span class="thumb" class:on={showCountdown}></span>
        </button>
      </div>
    </div>
  </div>
</section>
