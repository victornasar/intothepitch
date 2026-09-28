// Easing functions for the animator. Ball carriers use easeOutQuad (quick
// getaway, settle at the end); off-ball runners use easeInOutCubic (or a
// distance blend toward linear for short hops). Passes/shots also use
// easeOutQuad when the ball travels independently of a player.

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Blend toward ease-in-out as run length grows. Short hops stay nearly
 * linear (weight shifts / small adjustments); longer runs get the full
 * accelerate–decelerate curve. `distance` is in pitch metres.
 */
export function easeByDistance(t: number, distance: number): number {
  // Below ~8m → mostly linear; by ~22m → full easeInOutCubic.
  const mix = Math.min(1, Math.max(0, (distance - 8) / 14));
  const eased = easeInOutCubic(t);
  return t + (eased - t) * mix;
}
