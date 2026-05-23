# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-23

### Added
- Random-duration timer: picks a random length between a configurable minimum
  and maximum number of minutes.
- Timer controls: start, pause, resume, and reset.
- Visual progress bar showing elapsed time, with a large countdown display.
- Five alarm options powered by the Web Audio API: Bell, Gong, Digital Beep,
  Soft Chime, and None (silent), plus an inline button to test the selected sound.
- Option to hide the countdown for blind/focus sessions while the timer runs.
- Persistent settings (min/max duration, sound choice, display toggle) saved to
  `localStorage`.
- Status messages: "Paused", "Time's up!", and the running duration.
- Input validation (minimum >= 1, maximum >= minimum) with inline error messages.
- Responsive, mobile-first monochrome UI built with semantic HTML
  (`<progress>`, `<output>`, `<section>`) for accessibility.
- Docker support: multi-stage build (Bun build -> static-web-server runtime) and
  a `docker-compose` setup serving the SPA on port 3000.
