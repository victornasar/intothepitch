// Lucide icons for the HUD. Thin wrappers keep the call sites stable
 // (iconPlay, iconSettings, …) while every glyph comes from lucide.

import {
  createElement,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Sun,
  X,
  type IconNode,
} from 'lucide';

const ICON_ATTRS = {
  class: 'icon',
  width: 16,
  height: 16,
  'stroke-width': 2,
} as const;

function lucideIcon(node: IconNode): SVGSVGElement {
  return createElement(node, ICON_ATTRS) as SVGSVGElement;
}

export function iconPlay(): SVGSVGElement {
  return lucideIcon(Play);
}

export function iconPause(): SVGSVGElement {
  return lucideIcon(Pause);
}

export function iconPrevious(): SVGSVGElement {
  return lucideIcon(SkipBack);
}

export function iconNext(): SVGSVGElement {
  return lucideIcon(SkipForward);
}

export function iconRestart(): SVGSVGElement {
  return lucideIcon(RotateCcw);
}

export function iconSun(): SVGSVGElement {
  return lucideIcon(Sun);
}

export function iconMoon(): SVGSVGElement {
  return lucideIcon(Moon);
}

export function iconSettings(): SVGSVGElement {
  return lucideIcon(Settings);
}

export function iconClose(): SVGSVGElement {
  return lucideIcon(X);
}
