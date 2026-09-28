// Starter plays for the 4-2-1-3.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-2-1-3')!.defaultPositions;

const FALSE_NINE_DROPS_DEEP: Play = {
  id: 'false-nine-drops-deep',
  formation: '4-2-1-3',
  title: 'False 9 drops deep',
  concept:
    "A false 9 dropping deep drags a center-back out of the last line: the moment he follows, the space in behind belongs to whichever wide forward times the run.",
  commonMistake:
    "The winger starting his run before the center-back actually commits to following the drop: time it to the marker's movement, not the pass.",
  startPositions: START,
  startBall: 'LDM',
  steps: [
    {
      positions: { CAM: [35, 34] },
      ball: [35, 34],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: 'The #10 drops deep to receive, tempting a center-back to step out and follow him.',
    },
    {
      positions: { RW: [75, 45] },
      ball: 'CAM',
      focus: 'RW',
      caption: 'As the marker steps out to close him down, the space in behind opens up: the winger starts his run into it.',
    },
    {
      positions: { RW: [92, 38] },
      ball: [92, 38],
      focus: 'RW',
      input: 'Through ball (Y / Triangle)',
      caption: "One touch to turn, then a ball straight through the gap the dropped #10 just created.",
    },
    {
      positions: { RW: [102, 38], ST: [92, 26] },
      ball: 'RW',
      focus: 'RW',
      input: 'Sprint to byline (RB / R2)',
      caption: 'The striker attacks the near post as the winger reaches the line.',
    },
    {
      positions: {},
      ball: [92, 26],
      focus: 'ST',
      input: 'Cutback pass (A / Cross)',
      caption: 'Cut back for the striker rather than an early cross: the near-post run is already there.',
    },
    {
      positions: {},
      ball: [105, 26],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish at the near post.',
    },
  ],
};

const DOUBLE_PIVOT_PROGRESSES: Play = {
  id: 'double-pivot-progresses',
  formation: '4-2-1-3',
  title: 'Double pivot progresses the ball',
  concept:
    'Quick one-touch combinations through the double pivot break the first line of pressure before the ball ever reaches the front three: by the time it arrives out wide, the defense is already stretched and recovering.',
  commonMistake:
    'Slowing the tempo down after the first pass: the double pivot combination only works if it\'s played at speed, one touch at a time.',
  startPositions: START,
  startBall: 'LDM',
  steps: [
    {
      positions: {},
      ball: [26, 42],
      focus: 'RDM',
      input: 'Ground pass (A / Cross)',
      caption: 'The double pivot combines with a simple pass to shift the angle of attack.',
    },
    {
      positions: { CAM: [38, 40] },
      ball: [38, 40],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: "The ball goes forward into the #10, who's shown for it between the lines.",
    },
    {
      positions: { RDM: [52, 44] },
      ball: [52, 44],
      focus: 'RDM',
      input: 'One-touch return (A / Cross)',
      caption: 'A quick give-and-go sends the midfielder forward, beyond the first line of pressure.',
    },
    {
      positions: {},
      ball: [60, 58],
      focus: 'RW',
      input: 'Ground pass (A / Cross)',
      caption: "The ball reaches the winger, now facing a defense that's had to shift and recover.",
    },
    {
      positions: { RW: [80, 45] },
      ball: 'RW',
      focus: 'RW',
      caption: 'He cuts inside onto his stronger foot, opening the passing lane centrally.',
    },
    {
      positions: { ST: [95, 30] },
      ball: [95, 30],
      focus: 'ST',
      input: 'Through ball (Y / Triangle)',
      caption: "Straight through for the striker's run in behind.",
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper.',
    },
  ],
};

export const PLAYS_4213: Play[] = [FALSE_NINE_DROPS_DEEP, DOUBLE_PIVOT_PROGRESSES];
