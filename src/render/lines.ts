// Movement arrows for the current step.
// Pass arrows are drawn as a rounded shaft + compact filled tip (no SVG
// marker chevrons) so length and tip stay proportional on the pitch.
// Run arrows stay dashed with a progressive reveal.

import { distance } from '../engine/geometry';
import { svgEl } from '../engine/svg';
import type { Point } from '../data/types';
import type { StepArrow, StepArrows } from '../engine/animator';

const CLIP_THICKNESS = 4;
const FADE_OUT_MS = 300;
/** Clearance from player centers (meters). */
const PLAYER_PAD = 2.05;
/** Pass tip length along the shaft (meters). */
const TIP_LEN = 1.35;
/** Pass tip half-width (meters). */
const TIP_HALF = 0.48;

type LiveRun = {
  path: SVGPathElement;
  clipRect: SVGRectElement;
  clipPath: SVGClipPathElement;
  length: number;
};

export interface LineLayer {
  setStep(arrows: StepArrows): void;
  setProgress(t: number): void;
  /** Redraw the ball/pass arrow between two live pitch points. Null hides it. */
  syncBallArrow(from: Point | null, to: Point | null): void;
}

function getOrCreateDefs(svg: SVGSVGElement): SVGDefsElement {
  const existing = svg.querySelector('defs');
  if (existing) return existing as SVGDefsElement;
  const defs = svgEl('defs');
  svg.insertBefore(defs, svg.firstChild);
  return defs;
}

/**
 * Broadcast-style pass geometry: rounded shaft stopping at the tip base,
 * plus a compact filled triangle. All sizes are pitch meters.
 */
function passGeometry(
  from: Point,
  to: Point,
): { shaft: [Point, Point]; tip: string; length: number } | null {
  const len = distance(from, to);
  if (len < 1) return null;

  const ux = (to[0] - from[0]) / len;
  const uy = (to[1] - from[1]) / len;
  const px = -uy;
  const py = ux;

  const pad = Math.min(PLAYER_PAD, len * 0.22);
  const tipLen = Math.min(TIP_LEN, (len - pad * 2) * 0.35);
  const tipHalf = Math.min(TIP_HALF, tipLen * 0.42);

  const usable = len - pad * 2;
  if (usable < tipLen + 0.4) return null;

  const shaftStart: Point = [from[0] + ux * pad, from[1] + uy * pad];
  const tipPoint: Point = [to[0] - ux * pad, to[1] - uy * pad];
  const tipBase: Point = [tipPoint[0] - ux * tipLen, tipPoint[1] - uy * tipLen];

  const left: Point = [tipBase[0] + px * tipHalf, tipBase[1] + py * tipHalf];
  const right: Point = [tipBase[0] - px * tipHalf, tipBase[1] - py * tipHalf];

  return {
    shaft: [shaftStart, tipBase],
    tip: `M ${tipPoint[0]} ${tipPoint[1]} L ${left[0]} ${left[1]} L ${right[0]} ${right[1]} Z`,
    length: distance(shaftStart, tipBase),
  };
}

export function createLineLayer(svg: SVGSVGElement): LineLayer {
  const defs = getOrCreateDefs(svg);

  // Small filled tip for dashed run arrows only (strokeWidth-scaled).
  defs.querySelector('#run-arrowhead')?.remove();
  const runMarker = svgEl('marker', {
    id: 'run-arrowhead',
    viewBox: '0 0 10 10',
    refX: 9,
    refY: 5,
    markerWidth: 2.2,
    markerHeight: 2.2,
    orient: 'auto',
  });
  runMarker.appendChild(
    svgEl('path', {
      d: 'M 1 1.8 L 9 5 L 1 8.2 Z',
      fill: 'currentColor',
    }),
  );
  defs.appendChild(runMarker);

  const group = svgEl('g', { class: 'lines' });
  svg.appendChild(group);

  let liveRuns: LiveRun[] = [];
  let ballShaft: SVGPathElement | null = null;
  let ballTip: SVGPathElement | null = null;

  function makeRun(arrow: StepArrow): LiveRun {
    const geo = passGeometry(arrow.from, arrow.to);
    const from = geo?.shaft[0] ?? arrow.from;
    const to = geo?.shaft[1] ?? arrow.to;
    const length = geo?.length ?? Math.max(distance(from, to), 0.0001);
    const angle = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;

    const clipId = `line-reveal-${Math.random().toString(36).slice(2)}`;
    const clipRect = svgEl('rect', {
      x: from[0],
      y: from[1] - CLIP_THICKNESS / 2,
      width: 0,
      height: CLIP_THICKNESS,
      transform: `rotate(${angle} ${from[0]} ${from[1]})`,
    });
    const clipPath = svgEl('clipPath', { id: clipId });
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);

    const path = svgEl('path', {
      d: `M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`,
      class: 'run-arrow',
      'clip-path': `url(#${clipId})`,
      'marker-end': 'url(#run-arrowhead)',
    });
    group.appendChild(path);
    return { path, clipRect, clipPath, length };
  }

  function ensureBallParts(): { shaft: SVGPathElement; tip: SVGPathElement } {
    if (!ballShaft) {
      ballShaft = svgEl('path', { d: 'M 0 0', class: 'ball-arrow-shaft' });
      group.appendChild(ballShaft);
    }
    if (!ballTip) {
      ballTip = svgEl('path', { d: 'M 0 0', class: 'ball-arrow-tip' });
      group.appendChild(ballTip);
    }
    return { shaft: ballShaft, tip: ballTip };
  }

  function paintBall(from: Point, to: Point): void {
    const geo = passGeometry(from, to);
    const { shaft, tip } = ensureBallParts();
    if (!geo) {
      shaft.style.opacity = '0';
      tip.style.opacity = '0';
      return;
    }
    const [a, b] = geo.shaft;
    shaft.setAttribute('d', `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`);
    tip.setAttribute('d', geo.tip);
    shaft.style.opacity = '1';
    tip.style.opacity = '1';
  }

  function hideBall(): void {
    if (ballShaft) ballShaft.style.opacity = '0';
    if (ballTip) ballTip.style.opacity = '0';
  }

  function clearRuns(): void {
    for (const line of liveRuns) {
      line.path.classList.add('arrow-fade-out');
      window.setTimeout(() => {
        line.path.remove();
        line.clipPath.remove();
      }, FADE_OUT_MS);
    }
    liveRuns = [];
  }

  return {
    setStep(arrows) {
      clearRuns();
      liveRuns = arrows.runs.map(makeRun);
      if (arrows.ballPath) paintBall(arrows.ballPath.from, arrows.ballPath.to);
      else hideBall();
    },

    setProgress(t) {
      for (const line of liveRuns) {
        line.clipRect.setAttribute('width', String(Math.max(line.length * t, 0.0001)));
      }
    },

    syncBallArrow(from, to) {
      if (!from || !to || distance(from, to) < 0.5) {
        hideBall();
        return;
      }
      paintBall(from, to);
    },
  };
}
