# Rush Type — standalone WebGL1 demo

This package turns the supplied `rush-type` implementation into a dependency-free browser demo. Type or paste a passage, submit it, and the animation plays its words one at a time.

## Run

From this directory:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

The compiled JavaScript is already included under `dist/`, so no npm install is required.

## Use

Enter text in the text box and select **Submit**. The submitted words replace the current sequence, play in order, and loop from the beginning. Empty submissions leave the current sequence unchanged.

Pointing at, focusing, or pressing the animation keeps its existing hold interaction, pausing the current word near the largest part of the effect.

## Rebuild

Install the local build dependency once, then compile the TypeScript sources:

```bash
npm install
npm run build
```

Run `npm run check` to type-check without replacing the compiled files in `dist/`. TypeScript is a development-only dependency; the browser runtime remains dependency-free.

## Source

- `src/params.ts` — default words, timing, shutter ratios, orbit, CRT/glow/hold constants.
- `src/engine.ts` — WebGL1 renderer and animation engine.
- `src/main.ts` — standalone lifecycle, input, submission, and event wiring.

The demo intentionally preserves the supplied visual invariants: white/sharp at rest, channel separation from different shutter lengths, vertical-only scale sweep, fixed-duration shutter, peak word swapping, orbit/perspective, pointer holds, auto-holds, scroll-rate coupling, and reduced-motion still rendering.
