// Draws the static pitch markings as an SVG: outer boundary, halfway line,
// center circle, penalty areas, six-yard boxes, penalty spots and arcs,
// corner arcs, and the two goals. All elements are built with
// document.createElementNS so no SVG library is needed.
//
// The pitch uses real meters as its coordinate space (105 x 68) so every
// other renderer (players, ball, lines) can plot positions directly without
// unit conversion. A small padding is added around the pitch so the goals,
// which sit outside the goal line, are fully visible.

import { PITCH_LENGTH, PITCH_WIDTH } from '../data/types';
import { svgEl } from '../engine/svg';

/** How far the goal frame sticks out behind the goal line, in meters. */
const GOAL_DEPTH = 2;
/** Width of the goal mouth, in meters (standard 7.32m). */
const GOAL_WIDTH = 7.32;
/** Extra breathing room around the pitch so goals and strokes aren't clipped. */
const PADDING = 3;

const CENTER = { x: PITCH_LENGTH / 2, y: PITCH_WIDTH / 2 };
const CENTER_CIRCLE_RADIUS = 9.15;
const PENALTY_AREA_DEPTH = 16.5;
const PENALTY_AREA_WIDTH = 40.32;
const SIX_YARD_DEPTH = 5.5;
const SIX_YARD_WIDTH = 18.32;
const PENALTY_SPOT_DISTANCE = 11;
const CORNER_ARC_RADIUS = 1;

/**
 * Builds an SVG path for a short arc between two points that share a center,
 * bulging toward `through` (a point the arc should pass near). Used for the
 * penalty-box "D" and the corner quarter-circles, where hand-picking the
 * sweep flag is error-prone.
 */
function arcThrough(center: [number, number], radius: number, a: [number, number], b: [number, number], through: [number, number]): string {
  const angle = (p: [number, number]) => Math.atan2(p[1] - center[1], p[0] - center[0]);
  const TAU = Math.PI * 2;
  const normalize = (rad: number) => ((rad % TAU) + TAU) % TAU;

  const startAngle = normalize(angle(a));
  const endAngle = normalize(angle(b));
  const throughAngle = normalize(angle(through));

  // Does going counter-clockwise (increasing angle) from start to end pass
  // through the target angle? If so, sweep-flag = 1, otherwise 0.
  const ccwContains = (from: number, to: number, mid: number) => {
    const span = normalize(to - from);
    const midSpan = normalize(mid - from);
    return midSpan <= span;
  };
  const sweepFlag = ccwContains(startAngle, endAngle, throughAngle) ? 1 : 0;

  return `M ${a[0]} ${a[1]} A ${radius} ${radius} 0 0 ${sweepFlag} ${b[0]} ${b[1]}`;
}

/** Draws the subtle alternating mowing stripes that fill the pitch. */
function drawStripes(svg: SVGSVGElement): void {
  const stripeCount = 12;
  const stripeWidth = PITCH_LENGTH / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    const rect = svgEl('rect', {
      x: i * stripeWidth,
      y: 0,
      width: stripeWidth,
      height: PITCH_WIDTH,
      class: i % 2 === 0 ? 'fill-grass' : 'fill-grass-alt',
    });
    svg.appendChild(rect);
  }
}

/** Draws the goal frame (net outline) sitting just behind a goal line. */
function drawGoal(svg: SVGSVGElement, side: 'left' | 'right'): void {
  const goalY = CENTER.y - GOAL_WIDTH / 2;
  const x = side === 'left' ? -GOAL_DEPTH : PITCH_LENGTH;
  const rect = svgEl('rect', {
    x,
    y: goalY,
    width: GOAL_DEPTH,
    height: GOAL_WIDTH,
    class: 'stroke-goal',
  });
  svg.appendChild(rect);
}

/** Draws one team's penalty area, six-yard box, spot, and arc. */
function drawBox(svg: SVGSVGElement, side: 'left' | 'right'): void {
  const isLeft = side === 'left';
  const penaltyAreaX = isLeft ? 0 : PITCH_LENGTH - PENALTY_AREA_DEPTH;
  const sixYardX = isLeft ? 0 : PITCH_LENGTH - SIX_YARD_DEPTH;
  const boxEdgeX = isLeft ? PENALTY_AREA_DEPTH : PITCH_LENGTH - PENALTY_AREA_DEPTH;
  const spotX = isLeft ? PENALTY_SPOT_DISTANCE : PITCH_LENGTH - PENALTY_SPOT_DISTANCE;

  svg.appendChild(
    svgEl('rect', {
      x: penaltyAreaX,
      y: CENTER.y - PENALTY_AREA_WIDTH / 2,
      width: PENALTY_AREA_DEPTH,
      height: PENALTY_AREA_WIDTH,
      class: 'stroke-line',
    }),
  );
  svg.appendChild(
    svgEl('rect', {
      x: sixYardX,
      y: CENTER.y - SIX_YARD_WIDTH / 2,
      width: SIX_YARD_DEPTH,
      height: SIX_YARD_WIDTH,
      class: 'stroke-line',
    }),
  );
  svg.appendChild(svgEl('circle', { cx: spotX, cy: CENTER.y, r: 0.3, class: 'fill-line' }));

  // The "D": the part of the penalty-spot circle that sits outside the box.
  const offset = Math.sqrt(CENTER_CIRCLE_RADIUS ** 2 - (boxEdgeX - spotX) ** 2);
  const top: [number, number] = [boxEdgeX, CENTER.y - offset];
  const bottom: [number, number] = [boxEdgeX, CENTER.y + offset];
  const bulge: [number, number] = isLeft
    ? [spotX + CENTER_CIRCLE_RADIUS, CENTER.y]
    : [spotX - CENTER_CIRCLE_RADIUS, CENTER.y];
  const d = arcThrough([spotX, CENTER.y], CENTER_CIRCLE_RADIUS, top, bottom, bulge);
  svg.appendChild(svgEl('path', { d, class: 'stroke-line' }));
}

/** Draws the four corner quarter-circles. */
function drawCornerArcs(svg: SVGSVGElement): void {
  const corners: Array<{ center: [number, number]; a: [number, number]; b: [number, number]; through: [number, number] }> = [
    {
      center: [0, 0],
      a: [0, CORNER_ARC_RADIUS],
      b: [CORNER_ARC_RADIUS, 0],
      through: [CORNER_ARC_RADIUS * 0.7, CORNER_ARC_RADIUS * 0.7],
    },
    {
      center: [PITCH_LENGTH, 0],
      a: [PITCH_LENGTH - CORNER_ARC_RADIUS, 0],
      b: [PITCH_LENGTH, CORNER_ARC_RADIUS],
      through: [PITCH_LENGTH - CORNER_ARC_RADIUS * 0.7, CORNER_ARC_RADIUS * 0.7],
    },
    {
      center: [0, PITCH_WIDTH],
      a: [0, PITCH_WIDTH - CORNER_ARC_RADIUS],
      b: [CORNER_ARC_RADIUS, PITCH_WIDTH],
      through: [CORNER_ARC_RADIUS * 0.7, PITCH_WIDTH - CORNER_ARC_RADIUS * 0.7],
    },
    {
      center: [PITCH_LENGTH, PITCH_WIDTH],
      a: [PITCH_LENGTH - CORNER_ARC_RADIUS, PITCH_WIDTH],
      b: [PITCH_LENGTH, PITCH_WIDTH - CORNER_ARC_RADIUS],
      through: [PITCH_LENGTH - CORNER_ARC_RADIUS * 0.7, PITCH_WIDTH - CORNER_ARC_RADIUS * 0.7],
    },
  ];

  for (const { center, a, b, through } of corners) {
    const d = arcThrough(center, CORNER_ARC_RADIUS, a, b, through);
    svg.appendChild(svgEl('path', { d, class: 'stroke-line' }));
  }
}

/** Draws the halfway line, center circle, and center spot. */
function drawHalfwayAndCenter(svg: SVGSVGElement): void {
  svg.appendChild(
    svgEl('line', { x1: CENTER.x, y1: 0, x2: CENTER.x, y2: PITCH_WIDTH, class: 'stroke-line' }),
  );
  svg.appendChild(
    svgEl('circle', { cx: CENTER.x, cy: CENTER.y, r: CENTER_CIRCLE_RADIUS, class: 'stroke-line' }),
  );
  svg.appendChild(svgEl('circle', { cx: CENTER.x, cy: CENTER.y, r: 0.3, class: 'fill-line' }));
}

/**
 * Builds the pitch SVG and mounts it inside `container`. Returns the SVG
 * element so callers (players, lines) can append further layers on top.
 */
export function createPitch(container: HTMLElement): SVGSVGElement {
  const viewMinX = -PADDING;
  const viewMinY = -PADDING;
  const viewWidth = PITCH_LENGTH + PADDING * 2;
  const viewHeight = PITCH_WIDTH + PADDING * 2;

  container.replaceChildren();

  const svg = svgEl('svg', {
    viewBox: `${viewMinX} ${viewMinY} ${viewWidth} ${viewHeight}`,
    class: 'pitch',
    role: 'img',
    'aria-label': 'Top-down football pitch diagram',
    preserveAspectRatio: 'xMidYMid meet',
  });

  drawStripes(svg);
  svg.appendChild(
    svgEl('rect', { x: 0, y: 0, width: PITCH_LENGTH, height: PITCH_WIDTH, class: 'stroke-line' }),
  );
  drawHalfwayAndCenter(svg);
  drawBox(svg, 'left');
  drawBox(svg, 'right');
  drawCornerArcs(svg);
  drawGoal(svg, 'left');
  drawGoal(svg, 'right');

  container.appendChild(svg);
  return svg;
}
