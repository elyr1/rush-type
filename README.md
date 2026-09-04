# Rush Type

A dependency-free WebGL1 demo. Type a passage, submit it, and it plays back one word at a time with a rush/streak animation. Hover or focus the stage to hold a word at its peak.

## Run

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. The compiled JS is already in `dist/`, so no build step is required to just view it.

## Rebuild

```bash
npm install
npm run build
```

`npm run check` type-checks without touching `dist/`.

## Source

- `src/params.ts` — words, timing, and visual tuning constants.
- `src/engine.ts` — WebGL renderer and animation engine.
- `src/main.ts` — page wiring: input, submission, hover/focus holds, lifecycle.
