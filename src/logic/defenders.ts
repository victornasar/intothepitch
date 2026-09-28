// Defensive block AI: holds a zonal shape that slides and steps with the
// ball, then each outfield player blends toward a role-aware mark. The
// nearest eligible defender presses the ball; a teammate covers the gap.
// Line height (deep / balanced / high) controls how high the block sits
// and how early it presses. Difficulty only tunes reaction speed/tightness.

import { PITCH_LENGTH, PITCH_WIDTH } from '../data/types';
import type { PlayerId, Point } from '../data/types';
import { clamp, distance, lerp, lerpPoint } from '../engine/geometry';
import { SPEED, moveToward } from '../engine/motion';

export type Difficulty = 'easy' | 'normal' | 'hard';
export type DefensiveLine = 'deep' | 'balanced' | 'high';

type LineRole = 'back' | 'mid' | 'fwd';
type Channel = 'left' | 'central' | 'right';

interface DifficultyProfile {
  /** Cap on outfield closing speed in m/s (role multipliers applied on top). */
  maxSpeed: number;
  /** How strongly a nearby attacker pulls a defender off shape, 0-1. */
  markingStrength: number;
  /** Goal-side cushion to the marked attacker, in meters (smaller = tighter). */
  markTightness: number;
  /** How far the presser steps out to close the ball, 0-1. */
  pressAggression: number;
  /** How strongly cover fills the presser's gap, 0-1. */
  coverStrength: number;
}

/** Preferred back-line x range and press timing for a defensive line setting. */
interface LineHeightProfile {
  /** Back line x when the ball is deep in the attacking half (stepped up). */
  highX: number;
  /** Back line x when the ball is near the defended goal. */
  deepX: number;
  /**
   * Depth curve exponent on ball progress. >1 stays deeper longer (slow step-up);
   * <1 steps up earlier.
   */
  depthCurve: number;
  /** Minimum meters goal-side of the ball the back line prefers to sit. */
  ballCushion: number;
  /** Blend 0-1 when stepping the line UP toward deepest attacker + trapCushion. */
  offsideBlend: number;
  /** Extra meters goal-side of the deepest attacker when trapping. */
  trapCushion: number;
  /** Press trigger radius in meters (high line presses from farther out). */
  pressRadius: number;
  /** Multiplier on difficulty pressAggression. */
  pressMult: number;
}

const PROFILES: Record<Difficulty, DifficultyProfile> = {
  easy: { maxSpeed: 4.5, markingStrength: 0.35, markTightness: 5, pressAggression: 0.3, coverStrength: 0.2 },
  normal: { maxSpeed: 5.8, markingStrength: 0.65, markTightness: 3, pressAggression: 0.6, coverStrength: 0.45 },
  hard: { maxSpeed: 7.0, markingStrength: 0.9, markTightness: 1.5, pressAggression: 1, coverStrength: 0.75 },
};

/** Hard-mode presser can hit ~elite sprint; others stay under profile.maxSpeed. */
const HARD_PRESS_SPEED = 7.5;

const LINE_PROFILES: Record<DefensiveLine, LineHeightProfile> = {
  // Slow to step up; sits deeper; bigger cushion; presses late.
  deep: {
    highX: 78,
    deepX: 102,
    depthCurve: 1.35,
    ballCushion: 14,
    offsideBlend: 0.35,
    trapCushion: 8,
    pressRadius: 12,
    pressMult: 0.75,
  },
  balanced: {
    highX: 68,
    deepX: 98,
    depthCurve: 1,
    ballCushion: 10,
    offsideBlend: 0.5,
    trapCushion: 6,
    pressRadius: 16,
    pressMult: 1,
  },
  // Aggressive push; presses early; leaves more space in behind.
  high: {
    highX: 55,
    deepX: 90,
    depthCurve: 0.7,
    ballCushion: 6,
    offsideBlend: 0.65,
    trapCushion: 4,
    pressRadius: 22,
    pressMult: 1.25,
  },
};

const BACK_IDS: PlayerId[] = ['LB', 'LCB', 'RCB', 'RB'];
const BACK_Y = [8, 24, 44, 60];
const MID_IDS: PlayerId[] = ['LM', 'LCM', 'RCM', 'RM'];
const MID_Y = [7, 23, 45, 61];
const FWD_IDS: PlayerId[] = ['LST', 'RST'];
const FWD_Y = [22, 46];
const OUTFIELD_IDS: PlayerId[] = [...BACK_IDS, ...MID_IDS, ...FWD_IDS];

const LINE_GAP = 13;
const MAX_SIDEWAYS_SHIFT = 9;
const Y_MARGIN = 3;
const MARK_RADIUS = 22;
const GOAL_CENTER_Y = PITCH_WIDTH / 2;
/** Hard minimum gap between any two defenders (meters). */
const MIN_SEPARATION = 8;

const BACK_SET = new Set([
  'LB', 'LCB', 'CB', 'RCB', 'RB', 'LWB', 'RWB',
]);
const MID_SET = new Set([
  'LM', 'LCM', 'CM', 'RCM', 'RM', 'LDM', 'RDM', 'CDM', 'LAM', 'RAM', 'CAM',
]);
const FWD_SET = new Set([
  'LST', 'RST', 'ST', 'LCF', 'RCF', 'CF', 'LW', 'RW',
]);
const WIDE_LEFT = new Set(['LB', 'LWB', 'LM', 'LW', 'LAM', 'LCF', 'LST']);
const WIDE_RIGHT = new Set(['RB', 'RWB', 'RM', 'RW', 'RAM', 'RCF', 'RST']);
const CENTRAL_IDS = new Set([
  'LCB', 'CB', 'RCB', 'LCM', 'CM', 'RCM', 'LDM', 'RDM', 'CDM', 'CAM', 'ST', 'CF',
]);
const CENTRAL_BACK = new Set(['LCB', 'CB', 'RCB']);
const FULLBACK = new Set(['LB', 'RB', 'LWB', 'RWB']);

function lineRole(id: PlayerId): LineRole {
  if (BACK_SET.has(id)) return 'back';
  if (FWD_SET.has(id)) return 'fwd';
  if (MID_SET.has(id)) return 'mid';
  return 'mid';
}

function channelOf(id: PlayerId, y: number): Channel {
  if (WIDE_LEFT.has(id)) return 'left';
  if (WIDE_RIGHT.has(id)) return 'right';
  if (CENTRAL_IDS.has(id)) return 'central';
  const third = PITCH_WIDTH / 3;
  if (y < third) return 'left';
  if (y > PITCH_WIDTH - third) return 'right';
  return 'central';
}

/** Role + channel affinity: higher = better match for this defender to mark that attacker. */
function markAffinity(
  defenderId: PlayerId,
  defenderY: number,
  attackerId: PlayerId,
  attacker: Point,
): number {
  const dRole = lineRole(defenderId);
  const aRole = lineRole(attackerId);
  const dChan = channelOf(defenderId, defenderY);
  const aChan = channelOf(attackerId, attacker[1]);
  let score = 0;

  // Prefer same vertical channel.
  if (dChan === aChan) score += 3;
  else if (dChan === 'central' || aChan === 'central') score += 1;
  else score -= 2;

  // CBs prefer central strikers / cams; avoid chasing wide wingers.
  if (CENTRAL_BACK.has(defenderId)) {
    if (aChan === 'central' && (aRole === 'fwd' || attackerId === 'CAM' || attackerId === 'LAM' || attackerId === 'RAM')) {
      score += 4;
    }
    if (aChan !== 'central' && aRole === 'fwd') score -= 3;
    if (aRole === 'back') score -= 2;
  }

  // Fullbacks / wingbacks prioritize wide attackers on their side.
  if (FULLBACK.has(defenderId)) {
    if (aChan === dChan) score += 4;
    if (aChan === 'central') score -= 1;
    if (aChan !== dChan && aChan !== 'central') score -= 3;
  }

  // Midfielders mark midfielders / cams.
  if (dRole === 'mid') {
    if (aRole === 'mid') score += 3;
    if (aRole === 'fwd') score += 1;
    if (aRole === 'back') score -= 1;
  }

  // Forwards press ball-side half-spaces (scored later with ball); prefer fwd/mid.
  if (dRole === 'fwd') {
    if (aRole === 'fwd' || aRole === 'mid') score += 2;
    if (aRole === 'back') score -= 2;
  }

  return score;
}

/** Goal-side of the attacker, but keep the defender's zonal lane (don't stack on the mark's Y). */
function goalSideMark(attacker: Point, zonalY: number, cushion: number, yBlend: number): Point {
  return [
    clamp(attacker[0] + cushion, 0, PITCH_LENGTH),
    lerp(zonalY, attacker[1], yBlend),
  ];
}

/** Push overlapping defenders apart so CMs / STs never occupy the same spot. */
function separateDefenders(targets: Record<PlayerId, Point>, minDist: number): void {
  const ids = Object.keys(targets);
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        if (a === 'GK' || b === 'GK') continue;
        const pa = targets[a];
        const pb = targets[b];
        const d = distance(pa, pb);
        if (d >= minDist || d < 1e-6) continue;

        const push = (minDist - d) / 2;
        let ux = (pa[0] - pb[0]) / d;
        let uy = (pa[1] - pb[1]) / d;
        if (d < 0.4) {
          // Prefer lateral split when fully overlapping.
          ux = 0;
          uy = pa[1] >= pb[1] ? 1 : -1;
        }

        targets[a] = [
          clamp(pa[0] + ux * push, 0, PITCH_LENGTH),
          clamp(pa[1] + uy * push, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
        ];
        targets[b] = [
          clamp(pb[0] - ux * push, 0, PITCH_LENGTH),
          clamp(pb[1] - uy * push, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
        ];
      }
    }
  }
}

function deepestAttackerX(attackers: Record<PlayerId, Point>): number {
  let maxX = 0;
  for (const pos of Object.values(attackers)) {
    if (pos[0] > maxX) maxX = pos[0];
  }
  return maxX;
}

/**
 * Back-line x from ball depth, line profile, and an offside-trap step-up toward
 * the deepest attacker so the line doesn't sit 40m behind the last man.
 *
 * depthCurve: ease ball progress with `1 - (1 - t)^curve` so >1 stays deeper
 * longer and <1 steps up earlier (matches LineHeightProfile docs).
 */
function backLineDepth(ball: Point, attackers: Record<PlayerId, Point>, line: LineHeightProfile): number {
  const ballT = clamp(ball[0] / PITCH_LENGTH, 0, 1);
  // >1 keeps curvedT above ballT mid-range (deeper longer); <1 pulls toward highX sooner.
  const curvedT = 1 - Math.pow(1 - ballT, line.depthCurve);
  const fromBall = lerp(line.highX, line.deepX, curvedT);

  // Stay goal-side of the ball by at least ballCushion when the ball is advanced.
  const cushioned = Math.max(fromBall, ball[0] + line.ballCushion);

  // Offside trap: only step UP (lower x) toward lastMan + trapCushion.
  // Never drop the block deeper via this blend — that fought high lines whenever
  // a runner got ahead of the ball-based depth.
  const lastMan = deepestAttackerX(attackers);
  const fromTrap = lastMan > 0 ? lastMan + line.trapCushion : cushioned;
  const blended =
    fromTrap < cushioned
      ? lerp(cushioned, fromTrap, line.offsideBlend)
      : cushioned;

  return clamp(blended, line.highX, line.deepX);
}

function zonalTargets(
  ball: Point,
  attackers: Record<PlayerId, Point>,
  line: LineHeightProfile,
  /** Anticipated ball position (leads the slide so the block doesn't trail). */
  leadBall: Point,
  timeMs: number,
): Record<PlayerId, Point> {
  const backLineX = backLineDepth(leadBall, attackers, line);
  const midLineX = backLineX - LINE_GAP;
  const fwdLineX = midLineX - (LINE_GAP - 1);

  // GK depth tracks the block lightly; y is set on the ball–goal angle below.
  const gkX = clamp(backLineX + 8, 96, 102);

  const slideT = clamp((leadBall[1] - GOAL_CENTER_Y) / (PITCH_WIDTH / 2), -1, 1);
  const shiftY = slideT * MAX_SIDEWAYS_SHIFT;

  // High lines squeeze a touch narrower; deep lines stay wider.
  const widthScale = line.highX <= 60 ? 0.92 : line.highX >= 75 ? 1.05 : 1;

  const place = (ids: PlayerId[], baseYs: number[], x: number, out: Record<PlayerId, Point>) => {
    ids.forEach((id, i) => {
      // Tiny per-player breath so the block never looks glued to a grid.
      const phase = ((id.charCodeAt(0) * 19 + i * 7) % 100) / 100;
      const breathY = Math.sin(timeMs / 1000 * 0.5 + phase * 6.28) * 0.4;
      const yFromCenter = (baseYs[i] - GOAL_CENTER_Y) * widthScale;
      out[id] = [
        x,
        clamp(GOAL_CENTER_Y + yFromCenter + shiftY + breathY, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
      ];
    });
  };

  // Stagger: fullbacks a meter ahead of CBs when the line is high (push/squeeze).
  const fbLead = line.highX <= 60 ? 2 : line.highX >= 75 ? 0 : 1;
  const targets: Record<PlayerId, Point> = { GK: [gkX, GOAL_CENTER_Y] };
  place(['LCB', 'RCB'], [BACK_Y[1], BACK_Y[2]], backLineX, targets);
  place(['LB', 'RB'], [BACK_Y[0], BACK_Y[3]], backLineX - fbLead, targets);
  place(MID_IDS, MID_Y, midLineX, targets);
  place(FWD_IDS, FWD_Y, fwdLineX, targets);

  // Near-side mid steps a touch higher toward the ball; far mid drops to cover.
  const ballHalf = leadBall[1] < GOAL_CENTER_Y ? 'left' : 'right';
  for (const id of MID_IDS) {
    const chan = channelOf(id, targets[id][1]);
    if (chan === ballHalf || (chan === 'central' && Math.abs(leadBall[1] - GOAL_CENTER_Y) < 12)) {
      targets[id] = [targets[id][0] - 2.5, lerp(targets[id][1], leadBall[1], 0.18)];
    } else if (chan !== 'central') {
      targets[id] = [targets[id][0] + 1.5, targets[id][1]];
    }
  }

  // Front two: near forward presses the lane; far forward tucks inside.
  for (const id of FWD_IDS) {
    const chan = channelOf(id, targets[id][1]);
    if (chan === ballHalf) {
      targets[id] = [
        lerp(targets[id][0], leadBall[0] + 4, 0.35),
        lerp(targets[id][1], leadBall[1], 0.28),
      ];
    } else {
      targets[id] = [targets[id][0] + 1, lerp(targets[id][1], GOAL_CENTER_Y, 0.12)];
    }
  }

  // GK on the angle between ball and goal center.
  const dx = PITCH_LENGTH - ball[0];
  if (Math.abs(dx) > 0.5) {
    const t = (gkX - ball[0]) / dx;
    const gkY = ball[1] + (GOAL_CENTER_Y - ball[1]) * t;
    targets.GK = [gkX, clamp(gkY, Y_MARGIN + 8, PITCH_WIDTH - Y_MARGIN - 8)];
  }

  return targets;
}

/** Pick the best unmarked attacker for this defender's role / channel. */
function pickMarkTarget(
  defenderId: PlayerId,
  zonalPos: Point,
  attackers: Record<PlayerId, Point>,
  claimed: Set<PlayerId>,
  ball: Point,
): { id: PlayerId; pos: Point; dist: number } | null {
  let best: { id: PlayerId; pos: Point; dist: number; cost: number } | null = null;

  for (const [id, pos] of Object.entries(attackers)) {
    if (claimed.has(id)) continue;
    const dist = distance(zonalPos, pos);
    if (dist > MARK_RADIUS) continue;

    const yGap = Math.abs(zonalPos[1] - pos[1]);
    const affinity = markAffinity(defenderId, zonalPos[1], id, pos);
    // Forwards: prefer attackers on the ball-side half of the pitch.
    let ballSide = 0;
    if (lineRole(defenderId) === 'fwd') {
      const ballHalf = ball[1] < GOAL_CENTER_Y ? 'left' : 'right';
      const aChan = channelOf(id, pos[1]);
      if (aChan === ballHalf || aChan === 'central') ballSide = 2;
    }

    // Lower cost = better: distance + channel gap, minus role affinity.
    const cost = dist + yGap * 0.45 - affinity * 2.5 - ballSide * 2;
    if (!best || cost < best.cost) {
      best = { id, pos, dist, cost };
    }
  }

  return best ? { id: best.id, pos: best.pos, dist: best.dist } : null;
}

function maxSpeedFor(id: PlayerId, base: number, difficulty: Difficulty, isPresser: boolean): number {
  if (id === 'GK') return SPEED.keeper;
  if (isPresser && difficulty === 'hard') return HARD_PRESS_SPEED;
  const role = lineRole(id);
  let mult = 1;
  if (role === 'back') mult = 0.85;
  else if (role === 'fwd') mult = 1.1;
  if (isPresser) mult *= 1.1;
  return Math.min(base * mult, difficulty === 'hard' ? HARD_PRESS_SPEED : base * 1.15);
}

/** Nearest attacker to the ball — treated as the carrier for press assignment. */
function findCarrier(
  ball: Point,
  attackers: Record<PlayerId, Point>,
): { id: PlayerId; pos: Point } | null {
  let best: { id: PlayerId; pos: Point; dist: number } | null = null;
  for (const [id, pos] of Object.entries(attackers)) {
    const d = distance(pos, ball);
    if (!best || d < best.dist) best = { id, pos, dist: d };
  }
  return best ? { id: best.id, pos: best.pos } : null;
}

/**
 * Who should close the ball: prefer role/channel match over raw nearest.
 * Fullbacks press wide carriers on their side; mids press central; forwards
 * press only when the ball is high enough for a front press.
 */
function pickPresser(
  lead: Point,
  carrier: { id: PlayerId; pos: Point } | null,
  targets: Record<PlayerId, Point>,
  ballDepth: 'build' | 'mid' | 'final',
): { id: PlayerId; dist: number } | null {
  let best: { id: PlayerId; dist: number; cost: number } | null = null;
  for (const id of OUTFIELD_IDS) {
    const pos = targets[id];
    const dist = distance(pos, lead);
    const role = lineRole(id);

    // Build-up (ball deep in our half): only front two / near mid close — backs hold.
    if (ballDepth === 'build' && role === 'back') continue;

    let affinity = 0;
    if (carrier) {
      affinity = markAffinity(id, pos[1], carrier.id, carrier.pos);
    } else {
      const chan = channelOf(id, pos[1]);
      const ballChan: Channel =
        lead[1] < PITCH_WIDTH / 3 ? 'left' : lead[1] > (2 * PITCH_WIDTH) / 3 ? 'right' : 'central';
      if (chan === ballChan) affinity += 3;
      else if (chan === 'central' || ballChan === 'central') affinity += 1;
    }

    // Prefer the natural unit for this phase.
    if (ballDepth === 'build' && role === 'fwd') affinity += 3;
    if (ballDepth === 'mid' && role === 'mid') affinity += 2;
    if (ballDepth === 'final' && role === 'back') affinity += 1;

    const cost = dist - affinity * 3.5;
    if (!best || cost < best.cost) best = { id, dist, cost };
  }
  return best ? { id: best.id, dist: best.dist } : null;
}

function ballDepthPhase(ballX: number): 'build' | 'mid' | 'final' {
  if (ballX < 42) return 'build';
  if (ballX < 72) return 'mid';
  return 'final';
}

export interface DefenderAI {
  /** Advances the simulation by `dtMs` toward this instant's targets. */
  update(ball: Point, attackers: Record<PlayerId, Point>, dtMs: number): Record<PlayerId, Point>;
  /** Instantly places every defender at this instant's targets, no smoothing. */
  snap(ball: Point, attackers: Record<PlayerId, Point>): Record<PlayerId, Point>;
  setDifficulty(difficulty: Difficulty): void;
  setDefensiveLine(line: DefensiveLine): void;
}

export function createDefenderAI(
  initialDifficulty: Difficulty = 'normal',
  initialLine: DefensiveLine = 'balanced',
): DefenderAI {
  let difficulty = initialDifficulty;
  let profile = PROFILES[initialDifficulty];
  let lineProfile = LINE_PROFILES[initialLine];
  const positions = new Map<PlayerId, Point>();
  let prevBall: Point | null = null;
  let ballVel: Point = [0, 0];
  let clockMs = 0;

  function trackBall(ball: Point, dtSec: number): void {
    if (prevBall && dtSec > 0) {
      const vx = (ball[0] - prevBall[0]) / dtSec;
      const vy = (ball[1] - prevBall[1]) / dtSec;
      ballVel = [
        lerp(ballVel[0], clamp(vx, -18, 18), 0.4),
        lerp(ballVel[1], clamp(vy, -18, 18), 0.4),
      ];
    }
    prevBall = [ball[0], ball[1]];
  }

  function leadBall(ball: Point): Point {
    return [
      clamp(ball[0] + ballVel[0] * 0.4, 0, PITCH_LENGTH),
      clamp(ball[1] + ballVel[1] * 0.4, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
    ];
  }

  function computeTargets(ball: Point, attackers: Record<PlayerId, Point>): {
    targets: Record<PlayerId, Point>;
    presser: PlayerId | null;
  } {
    const lead = leadBall(ball);
    const phase = ballDepthPhase(ball[0]);
    const zonal = zonalTargets(ball, attackers, lineProfile, lead, clockMs);
    const targets: Record<PlayerId, Point> = { GK: zonal.GK };
    const claimed = new Set<PlayerId>();
    const carrier = findCarrier(ball, attackers);

    // Mark in back → mid → fwd order so CBs/FBs claim primary marks first.
    // Never claim the ball carrier as a "mark" for multiple players — the
    // single presser handles them; everyone else marks runners / holds zone.
    const markOrder: PlayerId[] = [...BACK_IDS, ...MID_IDS, ...FWD_IDS];
    for (const id of markOrder) {
      const zonalPos = zonal[id];
      const pick = pickMarkTarget(id, zonalPos, attackers, claimed, ball);
      if (pick) {
        // During build-up, don't let midfielders abandon shape to mark a deep carrier.
        if (phase === 'build' && lineRole(id) === 'mid' && pick.id === carrier?.id) {
          targets[id] = zonalPos;
          continue;
        }
        claimed.add(pick.id);
        const markPos = goalSideMark(pick.pos, zonalPos[1], profile.markTightness, 0.22);
        const proximity = 1 - pick.dist / MARK_RADIUS;
        // Carrier is pressed, not man-marked by the whole block.
        const isCarrierMark = carrier && pick.id === carrier.id;
        const strength = isCarrierMark
          ? profile.markingStrength * 0.25
          : profile.markingStrength;
        const blend = clamp(Math.max(0.15, proximity) * strength, 0, strength);
        targets[id] = lerpPoint(zonalPos, markPos, blend);
      } else {
        targets[id] = zonalPos;
      }
    }

    // ONE presser, role-matched. Cover shadows the lane — never stacks on top.
    const pressRadius =
      phase === 'build' ? lineProfile.pressRadius * 0.7
      : phase === 'final' ? lineProfile.pressRadius * 1.15
      : lineProfile.pressRadius;
    const pressAgg = clamp(
      profile.pressAggression * lineProfile.pressMult * (phase === 'build' ? 0.55 : 1),
      0,
      1,
    );

    const picked = pickPresser(lead, carrier, targets, phase);
    let presser: PlayerId | null = picked?.id ?? null;
    const presserDist = picked?.dist ?? Infinity;

    if (presser && presserDist < pressRadius + (phase === 'build' ? 6 : 12)) {
      const engage =
        presserDist < pressRadius
          ? pressAgg
          : pressAgg * clamp(1 - (presserDist - pressRadius) / 20, 0.2, 0.5);

      const gapLeftBehind = zonal[presser];
      // Press from a slightly central angle — show the carrier inside so the
      // half-space channel stays playable, instead of sealing every lay-off.
      const pressY = lerp(targets[presser][1], GOAL_CENTER_Y, 0.28);
      const pressPos = goalSideMark(
        lead,
        pressY,
        Math.max(1.2, profile.markTightness * (1 - engage * 0.5)),
        0.28,
      );
      targets[presser] = lerpPoint(targets[presser], pressPos, engage);

      // Cover: sit in the central pocket the presser left, ~8m goal-side —
      // a shadow, not a second tackler and not a body in the half-space lane.
      const coverSpot: Point = [
        clamp(Math.max(gapLeftBehind[0], lead[0] + 8), 0, PITCH_LENGTH),
        lerp(gapLeftBehind[1], GOAL_CENTER_Y, 0.35),
      ];

      let cover: PlayerId | null = null;
      let coverDist = Infinity;
      for (const id of OUTFIELD_IDS) {
        if (id === presser) continue;
        // Prefer same line as presser (mid covers mid, back covers back).
        const sameLine = lineRole(id) === lineRole(presser);
        const d = distance(zonal[id], gapLeftBehind) - (sameLine ? 4 : 0);
        if (d < coverDist) {
          coverDist = distance(zonal[id], gapLeftBehind);
          cover = id;
        }
      }

      if (cover && coverDist < pressRadius + 14) {
        const coverBlend = clamp(
          profile.coverStrength * (phase === 'final' ? 1 : 0.75),
          0,
          profile.coverStrength,
        );
        targets[cover] = lerpPoint(targets[cover], coverSpot, coverBlend);

        // Hard rule: cover must stay clear of the presser (no double-team stack).
        const pressPosNow = targets[presser];
        const coverPosNow = targets[cover];
        const gap = distance(pressPosNow, coverPosNow);
        const minGap = phase === 'final' && difficulty === 'hard' ? 5.5 : 7.5;
        if (gap < minGap && gap > 1e-6) {
          const ux = (coverPosNow[0] - pressPosNow[0]) / gap;
          const uy = (coverPosNow[1] - pressPosNow[1]) / gap;
          targets[cover] = [
            clamp(pressPosNow[0] + ux * minGap, 0, PITCH_LENGTH),
            clamp(pressPosNow[1] + uy * minGap, Y_MARGIN, PITCH_WIDTH - Y_MARGIN),
          ];
        }
      }

      // Hard difficulty + final third only: a second presser can pinch from the
      // weak side — still kept outside minGap so it reads as a trap, not a stack.
      if (phase === 'final' && difficulty === 'hard') {
        let second: PlayerId | null = null;
        let secondDist = Infinity;
        for (const id of OUTFIELD_IDS) {
          if (id === presser || id === cover) continue;
          const d = distance(targets[id], lead);
          if (d < secondDist && d < pressRadius) {
            secondDist = d;
            second = id;
          }
        }
        if (second) {
          const pinch: Point = [
            clamp(lead[0] + profile.markTightness + 2, 0, PITCH_LENGTH),
            lerp(targets[second][1], lead[1], 0.35),
          ];
          targets[second] = lerpPoint(targets[second], pinch, pressAgg * 0.45);
        }
      }
    } else {
      presser = null;
    }

    separateDefenders(targets, MIN_SEPARATION);
    return { targets, presser };
  }

  function seedMissing(targets: Record<PlayerId, Point>): void {
    for (const [id, pos] of Object.entries(targets)) {
      if (!positions.has(id)) positions.set(id, pos);
    }
  }

  return {
    update(ball, attackers, dtMs) {
      const dt = Math.max(0, dtMs) / 1000;
      clockMs += Math.max(0, dtMs);
      trackBall(ball, dt);
      const { targets, presser } = computeTargets(ball, attackers);
      seedMissing(targets);
      const result: Record<PlayerId, Point> = {};
      for (const [id, target] of Object.entries(targets)) {
        const current = positions.get(id) ?? target;
        const next = moveToward(
          current,
          target,
          dt,
          maxSpeedFor(id, profile.maxSpeed, difficulty, id === presser),
        );
        result[id] = next;
      }
      separateDefenders(result, MIN_SEPARATION);
      for (const [id, pos] of Object.entries(result)) positions.set(id, pos);
      return result;
    },
    snap(ball, attackers) {
      trackBall(ball, 0);
      const { targets } = computeTargets(ball, attackers);
      separateDefenders(targets, MIN_SEPARATION);
      for (const [id, pos] of Object.entries(targets)) positions.set(id, pos);
      return targets;
    },
    setDifficulty(next) {
      difficulty = next;
      profile = PROFILES[next];
    },
    setDefensiveLine(line) {
      lineProfile = LINE_PROFILES[line];
    },
  };
}
