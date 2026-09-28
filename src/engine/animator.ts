// Timeline engine that drives step-by-step playback of a Play. Knows
// nothing about the DOM or SVG: it just resolves player/ball positions
// over time and reports them through callbacks, so render and UI code can
// stay completely decoupled from playback logic.
//
// Model: a play has N steps. "State 0" is the play's startPositions; "state
// i" (for i = 1..N) is the positions after step i-1 has fully happened.
// Animating step index `i` (0-based, into play.steps) means interpolating
// from state i to state i+1.

import type { Play, PlayerId, Point, Step } from '../data/types';
import { easeByDistance, easeOutQuad } from './easing';
import { clamp, distance, lerpPoint } from './geometry';
import { SPEED } from './motion';

type ResolvedState = {
  players: Record<PlayerId, Point>;
  ball: Point;
};

/** Resolves a step's ball field to a concrete point, given that step's end-of-step player positions. */
function resolveBallPoint(players: Record<PlayerId, Point>, ball: Step['ball']): Point {
  return typeof ball === 'string' ? players[ball] : ball;
}

/** Precomputes the position of every player and the ball at every step boundary. */
function resolveStates(play: Play): ResolvedState[] {
  const states: ResolvedState[] = [];
  let players: Record<PlayerId, Point> = { ...play.startPositions };

  const firstStep = play.steps[0];
  // Prefer explicit kickoff; otherwise keep the ball on the GK whenever the
  // formation has one — never invent a mid-pitch start from step 0's carrier.
  const initialBall = play.startBall
    ? resolveBallPoint(players, play.startBall)
    : players.GK
      ? players.GK
      : firstStep
        ? resolveBallPoint(players, firstStep.ball)
        : (Object.values(players)[0] as Point);
  states.push({ players: { ...players }, ball: initialBall });

  for (const step of play.steps) {
    players = { ...players, ...step.positions } as Record<PlayerId, Point>;
    states.push({ players: { ...players }, ball: resolveBallPoint(players, step.ball) });
  }
  return states;
}

/**
 * Per-step duration from the longest player/ball travel that step.
 * Long runs take longer; ball-carrier steps use sprint as the reference speed.
 */
function resolveStepDurations(play: Play, states: ResolvedState[]): number[] {
  const durations: number[] = [];
  for (let i = 0; i < play.steps.length; i++) {
    const step = play.steps[i];
    const from = states[i];
    const to = states[i + 1];
    let maxDist = 0;
    let hasCarrier = typeof step.ball === 'string';

    for (const id of Object.keys(to.players)) {
      const a = from.players[id];
      const b = to.players[id];
      if (a && b) maxDist = Math.max(maxDist, distance(a, b));
    }
    maxDist = Math.max(maxDist, distance(from.ball, to.ball));

    const refSpeed = hasCarrier ? SPEED.sprint : SPEED.jog;
    durations.push(clamp(maxDist / refSpeed, 0.7, 2.8) * 1000);
  }
  return durations;
}

export interface ProgressMeta {
  /** True for restarts/jumps/step-clicks (and the mid-step "jump to end" case): the display should snap, not animate, on these. */
  instant: boolean;
  /** Real elapsed time since the last frame, already scaled by the current playback speed. 0 for instant snaps. Lets frame-rate-independent consumers (like the defender AI) integrate motion in sync with speed changes. */
  dtMs: number;
}

export interface AnimatorCallbacks {
  /** Fired whenever the active step index changes (including via jumps/restart). */
  onStepChange?: (stepIndex: number) => void;
  /** Fired every animation frame (and after any instant snap) with the raw, linear (un-eased) progress through the current step. */
  onProgress?: (stepIndex: number, progress: number, meta: ProgressMeta) => void;
  /** Fired once, after the final step finishes playing (not on manual jumps to the end). */
  onComplete?: () => void;
}

export interface FrameState {
  players: Record<PlayerId, Point>;
  ball: Point;
}

/** A straight-line segment worth drawing an arrow for, in the current step. */
export interface StepArrow {
  from: Point;
  to: Point;
  /** When set, the renderer can re-anchor to live player positions each frame. */
  fromId?: PlayerId;
  toId?: PlayerId;
}

export interface StepArrows {
  /** Off-ball runs: dashed arrows. */
  runs: StepArrow[];
  /** The ball's own path this step (a carry or a pass/shot): solid arrow. Null if the ball doesn't move this step. */
  ballPath: StepArrow | null;
}

function reducedMotionActive(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Nearest player id to a point, optionally skipping an id. */
function nearestPlayerId(
  players: Record<PlayerId, Point>,
  point: Point,
  skip?: PlayerId,
): PlayerId | null {
  let best: PlayerId | null = null;
  let bestDist = Infinity;
  for (const [id, pos] of Object.entries(players)) {
    if (skip && id === skip) continue;
    const d = distance(pos, point);
    if (d < bestDist) {
      bestDist = d;
      best = id;
    }
  }
  return best;
}

/** Stagger budget for off-ball runners — enough that simultaneous runs don't lockstep. */
const MAX_STAGGER_OFF_BALL = 0.26;
/** Ball carriers stay tighter to the step clock so their carry reads urgent/direct. */
const MAX_STAGGER_CARRIER = 0.08;

/** A stable, deterministic 0..1 value per player id — not random, just spread out, so the same play always staggers the same way. */
function staggerPhase(id: PlayerId): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000;
}

/**
 * Remaps global step progress `t` into a player's own slightly-offset motion
 * window, so players moving in the same step don't all accelerate and
 * decelerate in perfect lockstep. Every player still reaches exactly their
 * scripted position by t = 1 — only the timing on the way there varies.
 * `maxStagger` is smaller for ball carriers (tighter to the beat) than for
 * off-ball runners.
 */
function staggeredProgress(id: PlayerId, t: number, maxStagger: number): number {
  const start = staggerPhase(id) * maxStagger;
  const span = 1 - maxStagger;
  return clamp((t - start) / span, 0, 1);
}

/**
 * Pick an ease curve for this player's run this step. Carriers get a snappy
 * easeOut so the carry feels urgent; everyone else blends linear→ease-in-out
 * by run length so short adjustments don't over-ease.
 */
function easePlayerMotion(localT: number, isCarrier: boolean, runDistance: number): number {
  if (isCarrier) return easeOutQuad(localT);
  return easeByDistance(localT, runDistance);
}

export class Animator {
  private readonly playData: Play;
  private readonly states: ResolvedState[];
  private readonly stepDurationsMs: number[];
  private readonly callbacks: AnimatorCallbacks;

  private stepIndex = 0;
  private elapsedMs = 0;
  /** Real time (scaled by speed) since the play started, never reset by jumps/pauses — only restart() zeroes it. Drives ambient idle motion for off-ball players, independent of step progress. */
  private totalElapsedMs = 0;
  private speed = 1;
  private playing = false;
  private singleStepMode = false;
  private lastFrameTime: number | null = null;
  private rafId: number | null = null;

  constructor(play: Play, callbacks: AnimatorCallbacks = {}) {
    this.playData = play;
    this.states = resolveStates(play);
    this.stepDurationsMs = resolveStepDurations(play, this.states);
    this.callbacks = callbacks;
  }

  get totalSteps(): number {
    return this.playData.steps.length;
  }

  get currentStepIndex(): number {
    return this.stepIndex;
  }

  /** Duration of the current step at 1x, in ms. */
  private currentStepDurationMs(): number {
    return this.stepDurationsMs[this.stepIndex] ?? 1200;
  }

  /** Raw, linear progress through the current step, in [0, 1]. */
  get progress(): number {
    return clamp(this.elapsedMs / this.currentStepDurationMs(), 0, 1);
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  /** Real elapsed playback time in ms, for ambient/idle motion — not reset by jumps, only by restart(). */
  get idleTimeMs(): number {
    return this.totalElapsedMs;
  }

  /** Interpolated positions for the current instant. Safe to call any time, playing or not. */
  getFrameState(): FrameState {
    const from = this.states[this.stepIndex];
    const to = this.states[this.stepIndex + 1];
    const rawBallTarget = this.playData.steps[this.stepIndex]?.ball;
    const reduced = reducedMotionActive();
    const t = reduced ? 1 : this.progress;

    const ballCarrierId = typeof rawBallTarget === 'string' ? rawBallTarget : null;

    const players: Record<PlayerId, Point> = {};
    for (const id of Object.keys(to.players)) {
      const fromPoint = from.players[id] ?? to.players[id];
      const toPoint = to.players[id];
      // Each player gets their own slightly offset timing window (skipped
      // under reduced motion, where everything just snaps to t = 1 anyway)
      // so simultaneous movers don't read as one synchronized machine.
      // Carriers stagger less and ease snappier; off-ball uses distance-aware
      // ease-in-out so short hops stay near-linear.
      const isCarrier = id === ballCarrierId;
      const maxStagger = isCarrier ? MAX_STAGGER_CARRIER : MAX_STAGGER_OFF_BALL;
      const localT = reduced ? t : staggeredProgress(id, t, maxStagger);
      const runDistance = distance(fromPoint, toPoint);
      const playerT = easePlayerMotion(localT, isCarrier, runDistance);
      players[id] = lerpPoint(fromPoint, toPoint, playerT);
    }

    let ball: Point;
    if (typeof rawBallTarget === 'string') {
      const feet = players[rawBallTarget];
      const startFeet = from.players[rawBallTarget] ?? feet;
      // If the ball isn't already at this player, fly it to their feet
      // (a pass onto them) instead of teleporting mid-step.
      const startDist = distance(from.ball, startFeet);
      if (startDist > 1.5) {
        ball = lerpPoint(from.ball, feet, easeOutQuad(t));
      } else {
        // Already on them — stay glued through the carry / dribble.
        ball = feet;
      }
    } else if (rawBallTarget) {
      // Explicit pass / shot destination: track from previous ball position.
      ball = lerpPoint(from.ball, rawBallTarget, easeOutQuad(t));
    } else {
      ball = from.ball;
    }

    return { players, ball };
  }

  /** Movement lines for the current step, in pitch coordinates. */
  getStepArrows(): StepArrows {
    const step = this.playData.steps[this.stepIndex];
    const from = this.states[this.stepIndex];
    const to = this.states[this.stepIndex + 1];
    if (!step) return { runs: [], ballPath: null };

    const runs: StepArrow[] = [];
    for (const id of Object.keys(step.positions)) {
      if (step.ball === id) continue;
      const fromPoint = from.players[id];
      const toPoint = to.players[id];
      if (fromPoint && toPoint && distance(fromPoint, toPoint) > 0.5) {
        runs.push({ from: fromPoint, to: toPoint, fromId: id, toId: id });
      }
    }

    let ballPath: StepArrow | null = null;
    if (typeof step.ball === 'string') {
      const id = step.ball;
      const startFeet = from.players[id];
      const endFeet = to.players[id];
      if (startFeet && endFeet) {
        const passOnto = distance(from.ball, startFeet) > 1.5;
        if (passOnto) {
          const passerId = nearestPlayerId(from.players, from.ball, id);
          ballPath = {
            from: passerId ? from.players[passerId] : from.ball,
            to: endFeet,
            fromId: passerId ?? undefined,
            toId: id,
          };
        } else if (distance(startFeet, endFeet) > 0.5) {
          ballPath = { from: startFeet, to: endFeet, fromId: id, toId: id };
        }
      }
    } else {
      const passerId = nearestPlayerId(from.players, from.ball);
      const dest = step.ball;
      const receiverId = nearestPlayerId(to.players, dest);
      const receiverPos = receiverId ? to.players[receiverId] : null;
      const useReceiver = receiverPos && distance(receiverPos, dest) < 5;
      ballPath = {
        from: passerId ? from.players[passerId] : from.ball,
        to: useReceiver && receiverPos ? receiverPos : dest,
        fromId: passerId ?? undefined,
        toId: useReceiver ? receiverId ?? undefined : undefined,
      };
      if (distance(ballPath.from, ballPath.to) <= 0.5) ballPath = null;
    }

    return { runs, ballPath };
  }

  private notifyProgress(meta: Partial<ProgressMeta> = {}): void {
    this.callbacks.onProgress?.(this.stepIndex, this.progress, {
      instant: meta.instant ?? false,
      dtMs: meta.dtMs ?? 0,
    });
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastFrameTime = null;
  }

  private readonly tick = (time: number): void => {
    if (!this.playing) return;
    if (this.lastFrameTime === null) this.lastFrameTime = time;
    const dt = time - this.lastFrameTime;
    this.lastFrameTime = time;
    const scaledDt = dt * this.speed;
    this.elapsedMs += scaledDt;
    this.totalElapsedMs += scaledDt;

    const stepMs = this.currentStepDurationMs();
    if (this.elapsedMs >= stepMs) {
      this.elapsedMs = stepMs;
      this.notifyProgress({ dtMs: scaledDt });

      if (this.singleStepMode) {
        this.playing = false;
        this.singleStepMode = false;
        this.stopLoop();
        if (this.stepIndex === this.totalSteps - 1) this.callbacks.onComplete?.();
        return;
      }

      if (this.stepIndex < this.totalSteps - 1) {
        this.stepIndex += 1;
        this.elapsedMs = 0;
        this.lastFrameTime = null;
        this.callbacks.onStepChange?.(this.stepIndex);
        this.rafId = requestAnimationFrame(this.tick);
      } else {
        this.playing = false;
        this.stopLoop();
        this.callbacks.onComplete?.();
      }
      return;
    }

    this.notifyProgress({ dtMs: scaledDt });
    this.rafId = requestAnimationFrame(this.tick);
  };

  /** Starts (or resumes) continuous playback from wherever the timeline currently sits. */
  play(): void {
    if (this.playing) return;
    if (this.stepIndex === this.totalSteps - 1 && this.elapsedMs >= this.currentStepDurationMs()) {
      this.restart();
    }
    this.playing = true;
    this.singleStepMode = false;
    this.lastFrameTime = null;
    this.rafId = requestAnimationFrame(this.tick);
  }

  /** Freezes playback exactly where it is: resuming with play() continues without a jump. */
  pause(): void {
    this.playing = false;
    this.stopLoop();
  }

  /**
   * If mid-step, jumps to the end of the current step. Otherwise animates
   * the next step (auto-pausing once it finishes), or does nothing if
   * already at the end of the last step.
   */
  nextStep(): void {
    const stepMs = this.currentStepDurationMs();
    const midAnimation = this.elapsedMs > 0 && this.elapsedMs < stepMs;
    this.pause();

    if (midAnimation) {
      this.elapsedMs = stepMs;
      this.notifyProgress({ instant: true });
      if (this.stepIndex === this.totalSteps - 1) this.callbacks.onComplete?.();
      return;
    }

    if (this.elapsedMs >= stepMs) {
      if (this.stepIndex >= this.totalSteps - 1) return;
      this.stepIndex += 1;
      this.elapsedMs = 0;
      this.callbacks.onStepChange?.(this.stepIndex);
    }

    this.notifyProgress({ instant: true });
    this.singleStepMode = true;
    this.playing = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  /** Snaps (no animation) to the start of the previous step, or the start of the current one if it's already underway. */
  previousStep(): void {
    this.pause();
    if (this.elapsedMs > 0) {
      this.elapsedMs = 0;
    } else if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.elapsedMs = 0;
    }
    this.callbacks.onStepChange?.(this.stepIndex);
    this.notifyProgress({ instant: true });
  }

  /** Snaps (no animation) to the start of the play. */
  restart(): void {
    this.pause();
    this.stepIndex = 0;
    this.elapsedMs = 0;
    this.totalElapsedMs = 0;
    this.singleStepMode = false;
    this.callbacks.onStepChange?.(this.stepIndex);
    this.notifyProgress({ instant: true });
  }

  /** Snaps (no animation) to the start of step `n`, clamped to the valid range. */
  jumpToStep(n: number): void {
    this.pause();
    this.stepIndex = clamp(n, 0, this.totalSteps - 1);
    this.elapsedMs = 0;
    this.singleStepMode = false;
    this.callbacks.onStepChange?.(this.stepIndex);
    this.notifyProgress({ instant: true });
  }

  setSpeed(multiplier: number): void {
    this.speed = multiplier;
  }
}
