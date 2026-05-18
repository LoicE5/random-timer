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
    background: var(--glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-border);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-top: 2rem;
    box-shadow: 0 24px 40px -24px rgba(20, 30, 40, 0.25);
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
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
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .input {
    background: var(--input);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    color: var(--foreground);
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
  }
  .input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px hsla(185, 55%, 35%, 0.2);
  }
  .input.error {
    border-color: var(--destructive);
  }
  .input.error:focus {
    box-shadow: 0 0 0 3px hsla(5, 70%, 50%, 0.2);
  }

  .err {
    color: var(--destructive);
    font-size: 0.85rem;
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
    padding: 0 0.9rem;
    height: 2.75rem;
    border: none;
    border-radius: 0.5rem;
    background: var(--secondary);
    color: var(--foreground);
    font-family: inherit;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .test:hover:not(:disabled) {
    background: #e6e2da;
  }
  .test:active:not(:disabled) {
    transform: scale(0.97);
  }
  .test:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--input);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.625rem 1rem;
    height: 2.75rem;
    font-size: 1rem;
  }

  .toggle {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: 9999px;
    border: none;
    background: var(--muted);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s ease;
  }
  .toggle.on {
    background: var(--primary);
  }
  .thumb {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1rem;
    height: 1rem;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }
  .thumb.on {
    transform: translateX(1.25rem);
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
