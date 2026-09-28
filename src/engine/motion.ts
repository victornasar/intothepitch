// Shared locomotion helpers: realistic pitch speeds (m/s) and capped steps.

import type { Point } from '../data/types';

/** Elite sprint ~8–9 m/s; sustained jog ~4.5–5.5. */
export const SPEED = { sprint: 8.2, jog: 5.0, shuffle: 3.2, keeper: 4.0 } as const;

/** Move `current` toward `target` by at most maxMps * dtSec. */
export function moveToward(
  current: Point,
  target: Point,
  dtSec: number,
  maxMps: number,
): Point {
  if (dtSec <= 0 || maxMps <= 0) return current;
  const dx = target[0] - current[0];
  const dy = target[1] - current[1];
  const dist = Math.hypot(dx, dy);
  if (dist < 1e-9) return current;
  const maxStep = maxMps * dtSec;
  if (dist <= maxStep) return [target[0], target[1]];
  const s = maxStep / dist;
  return [current[0] + dx * s, current[1] + dy * s];
}
