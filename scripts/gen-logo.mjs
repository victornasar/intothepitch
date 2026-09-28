// One-off generator: computes a flat, single-color soccer-ball mark — a
// real pentagon+hexagon panel pattern (not an abstract badge) — as ONE path
// with fill-rule evenodd, so the panels are true cutouts (negative space)
// rather than a second layered color. No gradients, no shadow. Writes a
// standalone preview SVG. Not part of the shipped app — output gets
// transcribed into src/render/logo.ts / public/favicon.svg once approved.
//
// Geometry notes:
// - The pentagon is regular, and each hexagon is a true regular hexagon
//   sharing one edge with it (this is what a real truncated icosahedron —
//   an actual soccer ball — looks like, not an approximation).
// - Regular hexagons attached to a pentagon that size are bigger than the
//   ball's radius, so each hexagon is uniformly scaled toward the ball's
//   center until it fits. Scaling uniformly (rather than clipping each
//   out-of-bounds vertex independently) keeps every hexagon convex and
//   simple, which matters: fill-rule evenodd breaks (wrong regions toggle)
//   if a "hole" subpath self-intersects or overlaps another hole.

const cx = 50, cy = 50;
const R = 42;      // outer ball radius
const rp = 14.5;   // central pentagon circumradius
const hexFit = R * 0.95; // hexagons scale to fit just inside the rim

const deg = (d) => (d * Math.PI) / 180;
const pt = (r, angleDeg, ox = cx, oy = cy) => [ox + r * Math.cos(deg(angleDeg)), oy + r * Math.sin(deg(angleDeg))];
const f = (n) => Math.round(n * 100) / 100;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const angles = [-90, -18, 54, 126, 198];
const pentagon = angles.map((a) => pt(rp, a));

/** Builds the regular hexagon that shares edge (A, B), bulging away from the pentagon center. */
function hexagonOnEdge(A, B) {
  const phi = Math.atan2(B[1] - A[1], B[0] - A[0]);
  const s = dist(A, B);

  function walk(turnSign) {
    const verts = [A, B];
    let angle = phi;
    let p = B;
    for (let i = 0; i < 4; i++) {
      angle += turnSign * deg(60);
      p = [p[0] + s * Math.cos(angle), p[1] + s * Math.sin(angle)];
      verts.push(p);
    }
    return verts;
  }

  const optionA = walk(1);
  const optionB = walk(-1);
  const centroid = (verts) => [
    verts.reduce((sum, v) => sum + v[0], 0) / verts.length,
    verts.reduce((sum, v) => sum + v[1], 0) / verts.length,
  ];
  return dist(centroid(optionA), [cx, cy]) > dist(centroid(optionB), [cx, cy]) ? optionA : optionB;
}

/** Uniformly scales a polygon toward the ball's center until its farthest vertex fits within `targetR`. */
function scaleToFit(verts, targetR) {
  const maxD = Math.max(...verts.map((v) => dist(v, [cx, cy])));
  const k = maxD > targetR ? targetR / maxD : 1;
  return verts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
}

function circlePath(r, x = cx, y = cy) {
  return `M ${f(x - r)} ${f(y)} A ${r} ${r} 0 1 0 ${f(x + r)} ${f(y)} A ${r} ${r} 0 1 0 ${f(x - r)} ${f(y)} Z`;
}

function polygonPath(verts) {
  return `M ${verts.map((v) => `${f(v[0])} ${f(v[1])}`).join(' L ')} Z`;
}

const pentagonPath = polygonPath(pentagon);
const hexagonPaths = pentagon.map((A, i) => {
  const B = pentagon[(i + 1) % 5];
  return polygonPath(scaleToFit(hexagonOnEdge(A, B), hexFit));
});
const ball = circlePath(R);

const singlePath = [ball, pentagonPath, ...hexagonPaths].join(' ');
console.log('single path (fill-rule evenodd):\n', singlePath);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="256" height="256">
  <rect width="100" height="100" fill="white"/>
  <path d="${singlePath}" fill="black" fill-rule="evenodd"/>
</svg>`;

import { writeFileSync } from 'fs';
writeFileSync(new URL('./preview.svg', import.meta.url), svg);
console.log('\nwrote scripts/preview.svg');
