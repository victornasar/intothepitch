// Automatic GK build-up prelude. Teaching plays often open mid-pitch with the
// ball already at the focus player — that reads as a vacuum. This module
// prepends formation-aware pass steps (GK → centre-back → mid → target) so
// every play starts from the keeper. Kickoff is on the GK; step 1 is the
// first pass (no redundant "GK holds the ball" beat).

import type { Play, PlayerId, Point, Step } from '../data/types';
import { PITCH_WIDTH } from '../data/types';
import { distance } from '../engine/geometry';

const CB_CANDIDATES: PlayerId[] = ['LCB', 'CB', 'RCB'];
const MID_CANDIDATES: PlayerId[] = [
  'CDM', 'LDM', 'RDM', 'CM', 'LCM', 'RCM', 'CAM', 'LAM', 'RAM',
];

function sideOfY(y: number): 'left' | 'right' | 'central' {
  if (y < PITCH_WIDTH / 3) return 'left';
  if (y > (2 * PITCH_WIDTH) / 3) return 'right';
  return 'central';
}

/** Who should be on the ball when the authored teaching steps begin. */
export function resolveTeachingCarrier(play: Play): PlayerId | null {
  if (typeof play.startBall === 'string' && play.startBall !== 'GK') {
    return play.startBall;
  }
  const first = play.steps[0];
  if (!first) return null;
  if (typeof first.ball === 'string') return first.ball;

  const origin =
    typeof play.startBall === 'object' && play.startBall
      ? play.startBall
      : first.ball;
  let best: PlayerId | null = null;
  let bestDist = Infinity;
  for (const [id, pos] of Object.entries(play.startPositions)) {
    if (id === 'GK') continue;
    const d = distance(pos, origin as Point);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

function pickCentreBack(positions: Record<PlayerId, Point>, target: Point): PlayerId | null {
  const available = CB_CANDIDATES.filter((id) => positions[id]);
  if (available.length === 0) return null;
  const side = sideOfY(target[1]);
  if (side === 'left' && positions.LCB) return 'LCB';
  if (side === 'right' && positions.RCB) return 'RCB';
  return available.reduce((best, id) =>
    distance(positions[id], target) < distance(positions[best], target) ? id : best,
  );
}

function pickPivot(positions: Record<PlayerId, Point>, target: Point, avoid: Set<PlayerId>): PlayerId | null {
  const available = MID_CANDIDATES.filter((id) => positions[id] && !avoid.has(id));
  if (available.length === 0) return null;
  return available.reduce((best, id) =>
    distance(positions[id], target) < distance(positions[best], target) ? id : best,
  );
}

/**
 * Progressive possession chain ending at `target`.
 * Always starts with GK; skips redundant hops when the target is already deep.
 */
export function buildPossessionChain(
  positions: Record<PlayerId, Point>,
  target: PlayerId,
): PlayerId[] {
  if (target === 'GK') return ['GK'];
  if (!positions.GK || !positions[target]) return ['GK', target].filter((id) => positions[id]);

  const targetPos = positions[target];
  const chain: PlayerId[] = ['GK'];
  const used = new Set<PlayerId>(['GK']);

  if (CB_CANDIDATES.includes(target)) {
    chain.push(target);
    return chain;
  }

  const cb = pickCentreBack(positions, targetPos);
  if (cb && !used.has(cb)) {
    chain.push(cb);
    used.add(cb);
  }

  if (!MID_CANDIDATES.includes(target)) {
    const mid = pickPivot(positions, targetPos, used);
    if (mid) {
      chain.push(mid);
      used.add(mid);
    }
  }

  if (!used.has(target)) chain.push(target);
  return chain;
}

function offerAngle(to: Point, lateral = 3): Point {
  const openY = to[1] + (to[1] < PITCH_WIDTH / 2 ? lateral : -lateral);
  return [to[0], Math.max(4, Math.min(PITCH_WIDTH - 4, openY))];
}

function captionForHop(from: PlayerId, to: PlayerId, index: number, total: number): string {
  if (index === 0) {
    return `The goalkeeper plays out to ${to}. Look up, pick the free man, and break the first press.`;
  }
  if (index === total - 1) {
    return `The ball arrives at ${to} — teammates are already providing options around him.`;
  }
  if (CB_CANDIDATES.includes(to)) {
    return `${from} finds ${to}. Progress with a calm first touch — don't force it into a press.`;
  }
  return `${from} plays into ${to}, who opens their body to continue the attack.`;
}

function inputForHop(index: number, total: number): string {
  if (index === 0) return 'Build-up pass (A / Cross)';
  if (index === total - 1) return 'Find the free man (A / Cross)';
  return 'Progressive pass (A / Cross)';
}

/**
 * Copy of `play` that always kickstarts from the GK and prepends pass hops.
 * Passes use Point ball targets so the ball flies from the previous carrier
 * instead of teleporting onto the receiver.
 */
export function withBuildUp(play: Play): Play {
  const positions = play.startPositions;
  const teachingSteps = play.steps.map((s) => ({
    ...s,
    positions: { ...s.positions },
  }));

  if (!positions.GK) {
    return { ...play, steps: teachingSteps };
  }

  const target = resolveTeachingCarrier(play);
  if (!target || target === 'GK') {
    return {
      ...play,
      startBall: 'GK',
      steps: teachingSteps,
    };
  }

  const chain = buildPossessionChain(positions, target);
  if (chain.length < 2) {
    return { ...play, startBall: 'GK', steps: teachingSteps };
  }

  const buildSteps: Step[] = [];
  const hopCount = chain.length - 1;

  for (let i = 0; i < hopCount; i++) {
    const from = chain[i];
    const to = chain[i + 1];
    const toHome = positions[to];
    const fromHome = positions[from];
    const receiveAt =
      i === hopCount - 1 ? toHome : offerAngle(toHome, i === 0 ? 2 : 4);

    const hopPositions: Step['positions'] = { [to]: receiveAt };
    if (from === 'GK') {
      hopPositions.GK = [Math.min(fromHome[0] + 3, 12), fromHome[1]];
    }

    // Always a Point: ball travels from previous state → receiveAt.
    buildSteps.push({
      positions: hopPositions,
      ball: receiveAt,
      focus: from,
      input: inputForHop(i, hopCount),
      caption: captionForHop(from, to, i, hopCount),
    });
  }

  return {
    ...play,
    startBall: 'GK',
    steps: [...buildSteps, ...teachingSteps],
  };
}
