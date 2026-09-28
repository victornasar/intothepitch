// Attacking support AI: every unlocked teammate keeps adjusting around the
// ball — offering angles, holding width, pinning defenders, compacting rest
// defence. Scripted movers stay locked; everyone else is never frozen.

import { PITCH_LENGTH, PITCH_WIDTH } from '../data/types';
import type { PlayerId, Point } from '../data/types';
import { clamp, distance, lerp } from '../engine/geometry';
import { SPEED, moveToward } from '../engine/motion';

type AttackRole = 'gk' | 'back' | 'mid' | 'fwd';
type Side = 'left' | 'right' | 'central';

const BACK_SET = new Set(['LB', 'LCB', 'CB', 'RCB', 'RB', 'LWB', 'RWB']);
const MID_SET = new Set([
  'LM', 'LCM', 'CM', 'RCM', 'RM', 'LDM', 'RDM', 'CDM', 'LAM', 'RAM', 'CAM',
]);
const FWD_SET = new Set(['LW', 'RW', 'ST', 'LST', 'RST', 'CF', 'LCF', 'RCF']);
const WIDE_LEFT = new Set(['LB', 'LWB', 'LM', 'LW', 'LAM', 'LCF', 'LST']);
const WIDE_RIGHT = new Set(['RB', 'RWB', 'RM', 'RW', 'RAM', 'RCF', 'RST']);

const Y_MARGIN = 3;
/** Hard minimum gap between any two attackers (meters). */
const MIN_SEPARATION = 8.5;
/** Soft floor: unlocked players may sit slightly behind home, not deep. */
const HOME_RETREAT = 3;
/**
 * Support may nudge unlocked players off their scripted frame, but never so
 * far that locking them next step teleports them back (solo CF run syndrome).
 */
const MAX_SCRIPT_DRIFT = 5.5;
const GOAL_CENTER_Y = PITCH_WIDTH / 2;

function attackRole(id: PlayerId): AttackRole {
  if (id === 'GK') return 'gk';
  if (BACK_SET.has(id)) return 'back';
  if (MID_SET.has(id)) return 'mid';
  if (FWD_SET.has(id)) return 'fwd';
  return 'fwd';
}

/** Keep support within a leash of the timeline so scripted steps stay continuous. */
function leashToScript(pos: Point, script: Point, maxDist: number): Point {
  const d = distance(pos, script);
  if (d <= maxDist || d < 1e-6) return pos;
  const t = maxDist / d;
  return [script[0] + (pos[0] - script[0]) * t, script[1] + (pos[1] - script[1]) * t];
}

function sideOf(id: PlayerId, y: number): Side {
  if (WIDE_LEFT.has(id)) return 'left';
  if (WIDE_RIGHT.has(id)) return 'right';
  const third = PITCH_WIDTH / 3;
  if (y < third) return 'left';
  if (y > PITCH_WIDTH - third) return 'right';
  return 'central';
}

/** Commit factor from ball advance past kickoff — smoothstep. */
function attackPushT(ballX: number, kickoffBallX: number): number {
  const advance = Math.max(0, ballX - kickoffBallX);
  const t = clamp(advance / 48, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Possession phase from ball depth — build-up stays patient and compact. */
function attackPhase(ballX: number): 'build' | 'progress' | 'final' {
  if (ballX < 40) return 'build';
  if (ballX < 75) return 'progress';
  return 'final';
}

function speedFor(role: AttackRole, distToTarget: number): number {
  // Close the last few meters at a jog so support doesn't overshoot and jitter.
  const close = distToTarget < 4 ? 0.65 : distToTarget < 8 ? 0.85 : 1;
  if (role === 'back') return ((SPEED.jog + SPEED.shuffle) / 2) * close;
  if (role === 'mid') return SPEED.jog * close;
  if (role === 'fwd') return SPEED.sprint * 0.85 * close;
  return SPEED.keeper * close;
}

/**
 * Push overlapping units apart. Locked ids stay fixed; unlocked slide away.
 * Several passes so chains of overlaps resolve.
 */
function separateUnits(
  result: Record<PlayerId, Point>,
  lockedIds: ReadonlySet<PlayerId>,
  minDist: number,
): void {
  const ids = Object.keys(result);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        const pa = result[a];
        const pb = result[b];
        const d = distance(pa, pb);
        if (d >= minDist || d < 1e-6) continue;

        const push = (minDist - d) / 2;
        let ux = (pa[0] - pb[0]) / d;
        let uy = (pa[1] - pb[1]) / d;
        if (d < 0.4) {
          ux = 0;
          uy = pa[1] >= pb[1] ? 1 : -1;
        }

        const aLocked = lockedIds.has(a);
        const bLocked = lockedIds.has(b);
        if (!aLocked && !bLocked) {
          result[a] = [
            clamp(pa[0] + ux * push, 0, PITCH_LENGTH),
            clamp(pa[1] + uy * push, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
          ];
          result[b] = [
            clamp(pb[0] - ux * push, 0, PITCH_LENGTH),
            clamp(pb[1] - uy * push, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
          ];
        } else if (!aLocked && bLocked) {
          result[a] = [
            clamp(pa[0] + ux * (minDist - d), 0, PITCH_LENGTH),
            clamp(pa[1] + uy * (minDist - d), Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
          ];
        } else if (aLocked && !bLocked) {
          result[b] = [
            clamp(pb[0] - ux * (minDist - d), 0, PITCH_LENGTH),
            clamp(pb[1] - uy * (minDist - d), Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
          ];
        }
      }
    }
  }
}

export interface AttackSupportAI {
  update(
    ball: Point,
    players: Record<PlayerId, Point>,
    lockedIds: ReadonlySet<PlayerId>,
    dtMs: number,
  ): Record<PlayerId, Point>;
  snap(
    ball: Point,
    players: Record<PlayerId, Point>,
    lockedIds: ReadonlySet<PlayerId>,
  ): Record<PlayerId, Point>;
  reset(startPositions: Record<PlayerId, Point>, kickoffBall?: Point): void;
}

export function createAttackSupportAI(): AttackSupportAI {
  const home = new Map<PlayerId, Point>();
  const positions = new Map<PlayerId, Point>();
  let kickoffBallX = PITCH_LENGTH / 2;
  let homeCentroid: Point = [30, PITCH_WIDTH / 2];
  let prevBall: Point | null = null;
  let ballVel: Point = [0, 0];
  let clockMs = 0;

  function recomputeHomeCentroid(): void {
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const [id, pos] of home) {
      if (id === 'GK') continue;
      sx += pos[0];
      sy += pos[1];
      n += 1;
    }
    homeCentroid = n > 0 ? [sx / n, sy / n] : [30, PITCH_WIDTH / 2];
  }

  /**
   * Living support target: translate the kickoff shape with the ball, then
   * bias each role toward a useful football action (pocket, width, pin, rest
   * defence). Always engaged — even at kickoff the block breathes with the ball.
   */
  function supportTarget(id: PlayerId, ball: Point, pushT: number, timeMs: number): Point {
    const homePos = home.get(id);
    if (!homePos) return ball;

    const role = attackRole(id);
    const phase = attackPhase(ball[0]);
    const mySide = sideOf(id, homePos[1]);
    const ballSide: Side =
      ball[1] < PITCH_WIDTH / 3 ? 'left' : ball[1] > (2 * PITCH_WIDTH) / 3 ? 'right' : 'central';
    const nearBall =
      mySide === ballSide || (mySide === 'central' && ballSide === 'central') || ballSide === 'central';

    // Anticipate where the ball is going so support leads the play.
    const leadX = ball[0] + ballVel[0] * 0.35;
    const leadY = ball[1] + ballVel[1] * 0.35;
    const lead: Point = [
      clamp(leadX, 0, PITCH_LENGTH),
      clamp(leadY, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
    ];

    // Per-player micro-breath so the unit never looks locked to a grid.
    const breathPhase = ((id.charCodeAt(0) * 17 + id.length * 13) % 100) / 100;
    const breathX = Math.sin(timeMs / 1000 * 0.55 + breathPhase * 6.28) * 0.35;
    const breathY = Math.cos(timeMs / 1000 * 0.42 + breathPhase * 4.1) * 0.45;

    if (id === 'GK') {
      // Build-up: GK stays on the ball line; later they can edge up.
      const offLine = phase === 'build' ? homePos[0] + 2 : Math.min(lead[0] * 0.12 + 6, 26);
      const x = lerp(homePos[0], offLine, phase === 'build' ? 0.4 : Math.max(0.25, pushT * 0.9));
      const y = lerp(homePos[1], lead[1], phase === 'build' ? 0.2 : 0.08);
      return [clamp(x, 0, PITCH_LENGTH), clamp(y + breathY * 0.3, Y_MARGIN + 8, PITCH_WIDTH - Y_MARGIN - 8)];
    }

    // Shape centroid trails the ball. Build-up: stay closer to home / compact.
    const trail = phase === 'build' ? 14 : lerp(20, 12, pushT);
    const engage =
      phase === 'build' ? 0.35 : Math.max(0.22, pushT);
    const desiredCentroidX = lead[0] - trail;
    const desiredCentroidY = lerp(homeCentroid[1], lead[1], (phase === 'build' ? 0.1 : 0.18) * engage);

    const ox = homePos[0] - homeCentroid[0];
    const oy = homePos[1] - homeCentroid[1];
    const depthScale = phase === 'build' ? 1 : lerp(1, 0.9, pushT);
    const widthScale = nearBall ? lerp(1, 0.94, engage) : lerp(1, 1.06, engage);

    let x = lerp(homePos[0], desiredCentroidX + ox * depthScale, engage);
    let y = lerp(homePos[1], desiredCentroidY + oy * widthScale, engage);

    // Role-specific football by phase.
    if (role === 'mid') {
      if (phase === 'build') {
        // Short options for the keeper / CB — triangles, not a high press break.
        if (nearBall) {
          x = lerp(homePos[0], lead[0] + 8, 0.45);
          y = lerp(homePos[1], lead[1], 0.3);
        } else {
          x = lerp(x, homePos[0] + 4, 0.3);
        }
      } else if (nearBall) {
        const pocketX = lead[0] - 11;
        const pocketY = lerp(y, lead[1], 0.35);
        x = lerp(x, pocketX, 0.45 * engage);
        y = lerp(y, pocketY, 0.4 * engage);
      } else {
        x = lerp(x, Math.min(x, lead[0] - 16), 0.25);
        y = lerp(y, homePos[1], 0.15);
      }
      if (id === 'CDM' || id === 'LDM' || id === 'RDM') {
        x = Math.min(x, lead[0] - (phase === 'build' ? 6 : 16));
      }
    } else if (role === 'fwd') {
      if (phase === 'build') {
        // Stay high as an outlet / pin — don't drop into the build-up mess.
        x = lerp(homePos[0], Math.max(homePos[0], 50), 0.25);
        y = lerp(y, homePos[1], 0.2);
      } else if (id === 'ST' || id === 'CF' || id === 'LST' || id === 'RST' || id === 'LCF' || id === 'RCF') {
        const pinX = Math.max(homePos[0], lead[0] - 4);
        const pinY = lerp(y, lead[1] + (mySide === 'left' ? -4 : mySide === 'right' ? 4 : 0), 0.3);
        x = lerp(x, pinX, 0.5 * engage);
        y = lerp(y, pinY, 0.35 * engage);
      } else if (nearBall) {
        x = lerp(x, lead[0] - 2, 0.25 * engage);
        y = lerp(y, lerp(homePos[1], lead[1], 0.4), 0.3);
      } else {
        const wideY = mySide === 'left' ? Math.min(homePos[1], 10) : Math.max(homePos[1], PITCH_WIDTH - 10);
        x = lerp(x, Math.max(homePos[0], lead[0] - 8), 0.35 * engage);
        y = lerp(y, wideY, 0.4);
      }
    } else if (role === 'back') {
      if (phase === 'build') {
        // Split wide for the GK; CBs stagger for the first pass.
        if (id === 'LB' || id === 'LWB') {
          x = lerp(homePos[0], Math.max(homePos[0], lead[0] + 10), 0.4);
          y = lerp(y, Math.min(homePos[1], 8), 0.35);
        } else if (id === 'RB' || id === 'RWB') {
          x = lerp(homePos[0], Math.max(homePos[0], lead[0] + 10), 0.4);
          y = lerp(y, Math.max(homePos[1], PITCH_WIDTH - 8), 0.35);
        } else {
          x = lerp(homePos[0], lead[0] + 12, 0.35);
          y = lerp(y, homePos[1], 0.15);
        }
      } else {
        const restX = clamp(lead[0] - lerp(28, 22, pushT), homePos[0] - HOME_RETREAT, lead[0] - 18);
        x = lerp(homePos[0], restX, Math.max(0.3, pushT));
        if ((id === 'LB' || id === 'LWB') && ballSide === 'left') {
          y = lerp(y, Math.min(y, 10), 0.35 * engage);
          x = lerp(x, lead[0] - 14, 0.2 * engage);
        } else if ((id === 'RB' || id === 'RWB') && ballSide === 'right') {
          y = lerp(y, Math.max(y, PITCH_WIDTH - 10), 0.35 * engage);
          x = lerp(x, lead[0] - 14, 0.2 * engage);
        } else {
          y = lerp(y, GOAL_CENTER_Y + (homePos[1] - GOAL_CENTER_Y) * 0.85, 0.12 * engage);
        }
      }
    }

    x += breathX;
    y += breathY;

    // During build-up, receivers may sit ahead of a deep ball (GK/CB).
    const maxX =
      phase === 'build'
        ? PITCH_LENGTH - 5
        : Math.min(lead[0] - 0.5, PITCH_LENGTH);

    return [
      clamp(Math.max(homePos[0] - HOME_RETREAT, x), 0, maxX),
      clamp(y, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
    ];
  }

  function trackBall(ball: Point, dtSec: number): void {
    if (prevBall && dtSec > 0) {
      const vx = (ball[0] - prevBall[0]) / dtSec;
      const vy = (ball[1] - prevBall[1]) / dtSec;
      // Smooth velocity so one-frame jumps don't whip the whole shape.
      ballVel = [
        lerp(ballVel[0], clamp(vx, -18, 18), 0.35),
        lerp(ballVel[1], clamp(vy, -18, 18), 0.35),
      ];
    }
    prevBall = [ball[0], ball[1]];
  }

  function computeAllTargets(
    ball: Point,
    players: Record<PlayerId, Point>,
    lockedIds: ReadonlySet<PlayerId>,
  ): Record<PlayerId, Point> {
    const pushT = attackPushT(ball[0], kickoffBallX);
    const result: Record<PlayerId, Point> = {};

    for (const [id, inputPos] of Object.entries(players)) {
      if (lockedIds.has(id)) {
        result[id] = inputPos;
        continue;
      }
      if (!home.has(id)) home.set(id, inputPos);
      // Blend support toward the scripted frame so the unit moves as one —
      // never park the timeline while one runner flies solo.
      const ideal = supportTarget(id, ball, pushT, clockMs);
      const blended: Point = [
        lerp(inputPos[0], ideal[0], 0.55),
        lerp(inputPos[1], ideal[1], 0.55),
      ];
      result[id] = leashToScript(blended, inputPos, MAX_SCRIPT_DRIFT);
    }

    separateUnits(result, lockedIds, MIN_SEPARATION);
    return result;
  }

  return {
    reset(startPositions, kickoffBall) {
      home.clear();
      positions.clear();
      prevBall = null;
      ballVel = [0, 0];
      clockMs = 0;
      for (const [id, pos] of Object.entries(startPositions)) {
        home.set(id, pos);
        positions.set(id, pos);
      }
      recomputeHomeCentroid();
      if (kickoffBall) {
        kickoffBallX = kickoffBall[0];
        prevBall = [kickoffBall[0], kickoffBall[1]];
      } else {
        kickoffBallX = homeCentroid[0];
      }
    },

    update(ball, players, lockedIds, dtMs) {
      const dt = Math.max(0, dtMs) / 1000;
      clockMs += Math.max(0, dtMs);
      trackBall(ball, dt);

      const targets = computeAllTargets(ball, players, lockedIds);
      const result: Record<PlayerId, Point> = {};

      for (const [id, inputPos] of Object.entries(players)) {
        if (lockedIds.has(id)) {
          positions.set(id, inputPos);
          result[id] = inputPos;
          continue;
        }

        if (dt === 0) {
          const held = positions.get(id) ?? inputPos;
          positions.set(id, held);
          result[id] = held;
          continue;
        }

        const current = positions.get(id) ?? inputPos;
        // Soft-reset toward the script each frame so drift can't compound.
        const anchored: Point = [
          lerp(current[0], inputPos[0], 0.12),
          lerp(current[1], inputPos[1], 0.12),
        ];
        const target = targets[id];
        const next = moveToward(
          anchored,
          target,
          dt,
          speedFor(attackRole(id), distance(anchored, target)),
        );
        const leashed = leashToScript(next, inputPos, MAX_SCRIPT_DRIFT);
        positions.set(id, leashed);
        result[id] = leashed;
      }

      separateUnits(result, lockedIds, MIN_SEPARATION);
      for (const [id, pos] of Object.entries(result)) {
        if (!lockedIds.has(id)) positions.set(id, pos);
      }
      return result;
    },

    snap(ball, players, lockedIds) {
      trackBall(ball, 0);
      const targets = computeAllTargets(ball, players, lockedIds);
      const result: Record<PlayerId, Point> = {};
      for (const [id, pos] of Object.entries(targets)) {
        const script = players[id] ?? pos;
        const held = lockedIds.has(id) ? script : leashToScript(pos, script, MAX_SCRIPT_DRIFT);
        positions.set(id, held);
        result[id] = held;
      }
      return result;
    },
  };
}
