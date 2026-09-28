// Reusable soccer-ball logomark, drawn once here and used anywhere in the
// app (currently the page header). The exact same path is the source for
// the static favicon (public/favicon.svg): both were derived from
// scripts/gen-logo.mjs: a real pentagon+hexagon panel pattern built as ONE
// path with fill-rule evenodd, so the panels are true cutouts (negative
// space), not a second layered color. Flat, single-color, no gradients or
// shadow.
//
// Because it's a genuine single-color glyph (transparent holes, not a
// second opaque color), it takes `fill="currentColor"` and adapts to
// whatever text color surrounds it: dark in light mode, light in dark
// mode: the same way any icon font glyph would.

import { svgEl } from '../engine/svg';

/** Ball outline + central pentagon + 5 hexagons, each a separate evenodd subpath. */
const LOGO_PATH = [
  'M 8 50 A 42 42 0 1 0 92 50 A 42 42 0 1 0 8 50 Z',
  'M 50 35.5 L 63.79 45.52 L 58.52 61.73 L 41.48 61.73 L 36.21 45.52 Z',
  'M 50 36.27 L 63.06 45.76 L 77.81 39.19 L 79.5 23.13 L 66.44 13.64 L 51.69 20.21 Z',
  'M 63.06 45.76 L 58.07 61.11 L 68.88 73.11 L 84.67 69.75 L 89.66 54.4 L 78.85 42.4 Z',
  'M 58.07 61.11 L 41.93 61.11 L 33.85 75.09 L 41.93 89.07 L 58.07 89.07 L 66.15 75.09 Z',
  'M 41.93 61.11 L 36.94 45.76 L 21.15 42.4 L 10.34 54.4 L 15.33 69.75 L 31.12 73.11 Z',
  'M 36.94 45.76 L 50 36.27 L 48.31 20.21 L 33.56 13.64 L 20.5 23.13 L 22.19 39.19 Z',
].join(' ');

/** Builds the logomark as a standalone SVG element, `size` CSS pixels square. */
export function createLogomark(size = 32): SVGSVGElement {
  const svg = svgEl('svg', {
    viewBox: '0 0 100 100',
    width: size,
    height: size,
    class: 'logomark',
    role: 'img',
    'aria-label': 'Into the Pitch',
  });

  svg.appendChild(svgEl('path', { d: LOGO_PATH, 'fill-rule': 'evenodd', fill: 'currentColor' }));

  return svg;
}
