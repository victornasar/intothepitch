// Starter plays for the 4-4-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-4-2')!.defaultPositions;

const FLICK_ON_AND_SPIN: Play = {
  id: 'flick-on-and-spin',
  formation: '4-4-2',
  title: 'Strike partnership: flick-on and spin',
  concept:
    'A front two work off each other: one drops to win the ball and knock it on, and the other times a run the instant the long ball is played. The flick-on beats defenders who are watching the ball, not the run.',
  commonMistake:
    'Controlling the flick-on instead of playing it first time: the extra touch gives the defense time to recover and read the run.',
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { LST: [46, 30] },
      ball: [46, 30],
      focus: 'LST',
      input: 'Lofted pass (X / Square)',
      caption: 'The midfielder looks long early: the near striker has already started to drop short to win it.',
    },
    {
      positions: { RST: [62, 36] },
      ball: [62, 36],
      focus: 'RST',
      input: 'First-time flick-on',
      caption: "He doesn't try to control it: a first-time flick into the space is much harder for the defense to react to.",
    },
    {
      positions: { RST: [88, 32] },
      ball: 'RST',
      focus: 'RST',
      input: 'Sprint in behind (RB / R2)',
      caption: 'The run started the instant the long ball was played: too early and he\'s offside, too late and the chance is gone.',
    },
    {
      positions: { LST: [85, 22] },
      ball: 'RST',
      focus: 'RST',
      caption: "The first striker doesn't stop after the flick: he spins away too, giving a second option if the shot comes back off the keeper.",
    },
    {
      positions: {},
      ball: [105, 32],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal: finish early, before the last defender or keeper can close the angle down.',
    },
  ],
};

const WIDE_OVERLAP_EARLY_CROSS: Play = {
  id: 'wide-overlap-early-cross',
  formation: '4-4-2',
  title: 'Wide overlap and early cross',
  concept:
    'An early cross (before the defense can get organized) combined with both strikers already attacking the box, overloads a back line that is still shuffling across to cover.',
  commonMistake: 'Taking too many touches before crossing: the earlier the ball goes in, the fewer defenders are goal-side and set.',
  startPositions: START,
  steps: [
    {
      positions: { RM: [55, 50] },
      ball: 'RM',
      focus: 'RM',
      input: 'Cut inside (skill move)',
      caption: 'The winger cuts inside onto his stronger foot, dragging his marker infield.',
    },
    {
      positions: { RB: [65, 60] },
      ball: 'RM',
      focus: 'RB',
      input: 'Targeted run (L1 + direction)',
      caption: 'The fullback overlaps into the space out wide: the winger just dragged his marker inside.',
    },
    {
      positions: { RB: [85, 60] },
      ball: [85, 60],
      focus: 'RB',
      input: 'Through ball (Y / Triangle)',
      caption: "The winger slides it into the overlap rather than trying to beat his man again.",
    },
    {
      positions: { LST: [92, 20], RST: [95, 44] },
      ball: [93, 22],
      focus: 'LST',
      input: 'Cross (R1 / Cross)',
      caption:
        "He whips an early cross in before the defense can get set: both strikers are already attacking the box in numbers.",
    },
    {
      positions: {},
      ball: [105, 18],
      focus: 'LST',
      input: 'Shoot / Header (B / Circle)',
      caption: "Arriving at the far post beats a keeper who's set for the near one.",
    },
  ],
};

export const PLAYS_442: Play[] = [FLICK_ON_AND_SPIN, WIDE_OVERLAP_EARLY_CROSS];
