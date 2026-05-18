# Project rules

## Directory layout

- Svelte components live in `src/components/`. This includes `App.svelte` — it is a component too.
- Shared TypeScript types and interfaces live in `src/types/`. Group related types in a single file (e.g. `src/types/index.ts`) rather than one file per type.
- Framework-agnostic helpers live in `src/utils/`.
- Global / shared stylesheets live in `src/styles/`. Component-scoped styles stay inside the component's `<style>` block.
- The HTML entry point is `src/index.html` — not the project root. Vite is configured with `root: 'src'` and writes its build output to `dist/` at the project root.

## Naming

- Use full names. No abbreviations.
  - `context`, not `ctx`. `oscillator`, not `osc`. `gainNode`, not `gain`. `frequency`, not `freq`. `index`, not `i`.
  - Multi-letter all-caps constants are fine when the term itself is short and complete (`RADIUS`, `CIRCUMFERENCE`), but not as a compression of a longer word (`CIRC` is banned).

## TypeScript

- No anonymous inline object types in function signatures, variable declarations, or generic arguments. Define a named `type` / `interface` and reference it.
  - Banned: `function f(): { a: string; b: number }` or `const x: { foo: string } = ...`.
  - OK: `interface Result { a: string; b: number } function f(): Result`.
- No "loophole" double-casts that invent properties on global objects.
  - Banned: `(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext`.
  - If you really need a global augmentation, use `declare global` once. Otherwise drop the fallback path.

## Data structures

- For a static, hand-written collection of unique values (lookup tables, enum-like option lists), prefer `Set` / `ReadonlySet` over `Array`. Svelte's `{#each}` accepts any iterable, so iteration order is still deterministic (insertion order).
  - `WeakSet` does not apply here — its members must be objects held by reference and it is not iterable. Skip it.

## Svelte files

- Tag order inside every `.svelte` file: `<script>` first, then `<style>`, then the template markup. No exceptions.
- Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`).
- Prefer `bind:` and `$bindable()` over passing setter callbacks down to children.

## Tooling

- Package manager + script runner: **Bun** (`bun install`, `bun run dev`, `bun run build`).
- Build / dev server: **Vite** + `@sveltejs/vite-plugin-svelte`.
  - Vite is required because Bun does not natively compile `.svelte` files — the official Svelte tooling (HMR, preprocessing, the language-server-compatible compiler hook) lives in the Vite plugin. Bun runs Vite faster than Node would, so the combo is Bun-as-runner + Vite-as-bundler.

## Comments and prose

- Default to no comments. Write a one-liner only when the *why* is non-obvious.
- No multi-line comment blocks or docstrings explaining what well-named code already says.
