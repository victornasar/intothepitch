// Draws attackers, defenders, and the ball on top of the pitch, and exposes
// an update API rather than a one-shot render: the animator calls
// updateAttackers/updateDefenders/updateBall every frame with interpolated
// positions, so elements are created once per id and moved thereafter
// instead of being torn down and rebuilt.

import type { PlayerId, Point } from '../data/types';
import { svgEl } from '../engine/svg';

const PLAYER_RADIUS = 1.8;
const FOCUS_RING_RADIUS = 2.4;
const BALL_RADIUS = 0.9;
const LABEL_FONT_SIZE = 1.15;

/** Strip L/R side prefixes so the badge reads the role, not the lane. */
const ROLE_LABEL: Record<string, string> = {
  LCB: 'CB',
  RCB: 'CB',
  LCM: 'CM',
  RCM: 'CM',
  LDM: 'CDM',
  RDM: 'CDM',
  LST: 'ST',
  RST: 'ST',
  LCF: 'CF',
  RCF: 'CF',
  LAM: 'CAM',
  RAM: 'CAM',
};

function displayLabel(id: PlayerId): string {
  return ROLE_LABEL[id] ?? id;
}

type AttackerEntry = { group: SVGGElement; ring: SVGCircleElement };
type DefenderEntry = { group: SVGGElement };

export interface AttackerFrameOptions {
  /** The one player the learner should watch this step — gets the pulsing ring. */
  focusId?: PlayerId;
  /** Real elapsed playback ms (Animator.idleTimeMs) driving the idle sway below. */
  idleTimeMs?: number;
  /** Ids NOT moving this step. They get a small ambient sway instead of standing frozen — skipped under prefers-reduced-motion. */
  idleIds?: ReadonlySet<PlayerId>;
}

export interface PlayerLayer {
  /** Moves (or creates, on first sight of an id) every attacker to its position, plus idle sway for anyone in `options.idleIds`. */
  updateAttackers(positions: Record<PlayerId, Point>, options?: AttackerFrameOptions): void;
  /** Moves (or creates) every defender to its position. */
  updateDefenders(positions: Record<PlayerId, Point>): void;
  /** Moves the ball to its position, creating it on first use. */
  updateBall(position: Point): void;
  /** Removes every attacker/defender element. Call before loading a play whose formation uses different player ids, so the old formation's players don't linger. */
  reset(): void;
}

/** A stable, deterministic 0..2π phase per player id, so idle sway isn't randomized (and thus isn't identical) across players. */
function idlePhase(id: PlayerId): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000;
}

/**
 * A small, slow, non-repeating-looking drift for a player who isn't part of
 * this step's scripted movement — real players shift their weight and adjust
 * their stance even when "holding position." Two sine waves per axis at
 * slightly different, per-player frequencies avoid an obvious synchronized
 * wobble across the whole team. Amplitude stays low so idle never fights
 * scripted runs or the focus ring.
 */
function idleSway(id: PlayerId, timeMs: number, amplitude = 1): [number, number] {
  const phase = idlePhase(id) * Math.PI * 2;
  const t = timeMs / 1000;
  const dx = Math.sin(t * 0.55 + phase) * 0.28 + Math.sin(t * 1.55 + phase * 1.3) * 0.1;
  const dy = Math.cos(t * 0.45 + phase * 0.8) * 0.22 + Math.cos(t * 1.75 + phase * 1.1) * 0.08;
  return [dx * amplitude, dy * amplitude];
}

function reducedMotionActive(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Builds the player layer on top of `svg` (the pitch from render/pitch.ts)
 * and returns update functions. Draw order (back to front): defenders,
 * attackers, ball: so the ball always reads clearly on top of everyone.
 */
export function createPlayerLayer(svg: SVGSVGElement): PlayerLayer {
  const defenderGroup = svgEl('g', { class: 'defenders' });
  const attackerGroup = svgEl('g', { class: 'attackers' });
  const ball = svgEl('circle', { class: 'ball', cx: 0, cy: 0, r: BALL_RADIUS });
  svg.append(defenderGroup, attackerGroup, ball);

  const attackers = new Map<PlayerId, AttackerEntry>();
  const defenders = new Map<PlayerId, DefenderEntry>();

  function createAttacker(id: PlayerId): AttackerEntry {
    const group = svgEl('g', { class: 'player player-attacker' });
    const ring = svgEl('circle', { class: 'player-focus-ring', cx: 0, cy: 0, r: FOCUS_RING_RADIUS });
    const body = svgEl('circle', { class: 'attacker', cx: 0, cy: 0, r: PLAYER_RADIUS });
    const label = svgEl('text', {
      class: 'attacker-label',
      x: 0,
      y: 0,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      'font-size': LABEL_FONT_SIZE,
      'font-weight': 700,
    });
    label.textContent = displayLabel(id);
    group.append(ring, body, label);
    attackerGroup.appendChild(group);
    const entry: AttackerEntry = { group, ring };
    attackers.set(id, entry);
    return entry;
  }

  function createDefender(id: PlayerId): DefenderEntry {
    const group = svgEl('g', { class: 'player player-defender' });
    const circle = svgEl('circle', { class: 'defender', cx: 0, cy: 0, r: PLAYER_RADIUS });
    const label = svgEl('text', {
      class: 'defender-label',
      x: 0,
      y: 0,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      'font-size': LABEL_FONT_SIZE,
      'font-weight': 700,
    });
    label.textContent = displayLabel(id);
    group.append(circle, label);
    defenderGroup.appendChild(group);
    const entry: DefenderEntry = { group };
    defenders.set(id, entry);
    return entry;
  }

  return {
    updateAttackers(positions, options = {}) {
      const { focusId, idleTimeMs = 0, idleIds } = options;
      const applySway = idleIds && idleIds.size > 0 && !reducedMotionActive();
      for (const [id, [x, y]] of Object.entries(positions)) {
        const entry = attackers.get(id) ?? createAttacker(id);
        let renderX = x;
        let renderY = y;
        if (applySway && idleIds.has(id)) {
          // Focus player: quieter sway so the ring / role stay readable.
          const amp = id === focusId ? 0.45 : 1;
          const [dx, dy] = idleSway(id, idleTimeMs, amp);
          renderX += dx;
          renderY += dy;
        }
        entry.group.setAttribute('transform', `translate(${renderX} ${renderY})`);
        entry.ring.style.display = id === focusId ? '' : 'none';
      }
    },
    updateDefenders(positions) {
      for (const [id, [x, y]] of Object.entries(positions)) {
        const entry = defenders.get(id) ?? createDefender(id);
        entry.group.setAttribute('transform', `translate(${x} ${y})`);
      }
    },
    updateBall([x, y]) {
      ball.setAttribute('cx', String(x));
      ball.setAttribute('cy', String(y));
    },
    reset() {
      for (const entry of attackers.values()) entry.group.remove();
      attackers.clear();
      for (const entry of defenders.values()) entry.group.remove();
      defenders.clear();
    },
  };
}
