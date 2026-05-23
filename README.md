# Random Timer

A minimalist web timer that counts down a **random** duration between a minimum
and maximum you choose. Built with Svelte 5, TypeScript and Vite.

## Features

- Random duration between a configurable min and max (in minutes)
- Start, pause, resume and reset controls
- Progress bar and large countdown display
- Five alarm sounds (Bell, Gong, Digital Beep, Soft Chime, None) with a test button
- Option to hide the countdown for blind/focus sessions
- Settings persisted in `localStorage`

## Development

Requires [Bun](https://bun.sh).

```bash
bun install      # install dependencies
bun run dev      # start the dev server
bun run build    # build to dist/
```

## Docker

The app ships as a static site served on port `3000`.

```bash
bun run docker-build   # build the image
bun run compose        # run via docker compose
```

Published images: [`loice5/random-timer`](https://hub.docker.com/r/loice5/random-timer)
(`linux/amd64` + `linux/arm64`).

## Releases

Pushing to `main` runs two workflows: **Release** tags and publishes a GitHub
Release from the top entry of [`CHANGELOG.md`](CHANGELOG.md), and on success
**Docker** builds and pushes the multi-arch image to Docker Hub.

## License

[MIT](LICENSE)
