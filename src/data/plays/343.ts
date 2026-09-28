// Starter plays for the 3-4-3.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('3-4-3')!.defaultPositions;

const HALF_SPACE_OVERLOAD: Play = {
  id: 'half-space-overload',
  formation: '3-4-3',
  title: 'Front-three overload: winger and midfielder combine',
  concept:
    "The far winger holds his width to pin the last defender, freeing the near winger and a central midfielder to combine through the half-space: the classic front-three overload, since the defense can't afford to leave the far side open to help centrally.",
  commonMistake:
    "Both wingers drifting inside at the same time: if the far winger doesn't hold his width, the last defender is free to step across and snuff out the combination.",
  startPositions: START,
  steps: [
    {
      positions: { RCM: [45, 42], RW: [65, 45] },
      ball: 'RCM',
      focus: 'RCM',
      input: 'Carry forward (left stick)',
      caption:
        'As the midfielder advances, the right winger drifts inside into the half-space: the left winger stays wide to pin the last defender and keep the space open.',
    },
    {
      positions: {},
      ball: [65, 45],
      focus: 'RW',
      input: 'Ground pass (A / Cross)',
      caption: "He finds the winger between the lines: the far winger's width means the last defender can't step across to help.",
    },
    {
      positions: { RCM: [78, 40] },
      ball: [78, 40],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross)',
      caption: 'A quick lay-off sends the midfielder beyond him: a two-touch combination through the middle of the pitch.',
    },
    {
      positions: { RCM: [92, 36], ST: [94, 26] },
      ball: 'RCM',
      focus: 'RCM',
      input: 'Sprint (RB / R2)',
      caption: "The midfielder arrives late into the box: the striker's near-post run drags the last center-back away from him.",
    },
    {
      positions: {},
      ball: [105, 32],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'Through the middle and one on one with the keeper.',
    },
  ],
};

const FRONT_THREE_ROTATION: Play = {
  id: 'front-three-rotation',
  formation: '3-4-3',
  title: 'Front-three rotation: striker drops, winger fills in',
  concept:
    "A front three doesn't have to stay in fixed positions: when the striker drops to link play, a winger can rotate into the space up front, confusing markers who are used to tracking fixed positions rather than runs.",
  commonMistake:
    "The winger starting his run too early, before the striker has actually dropped: time it so the space is empty when he arrives, not before.",
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { ST: [45, 34] },
      ball: [45, 34],
      focus: 'ST',
      input: 'Ground pass (A / Cross)',
      caption:
        'The striker drops short, pulling a center-back out of the back line: the far winger stays wide to stop the other center-back from covering across.',
    },
    {
      positions: { RW: [75, 35] },
      ball: 'ST',
      focus: 'RW',
      input: 'Sprint / targeted run (RB / R2)',
      caption: 'As the striker drops, the winger starts his run into the space up front: the front three are rotating positions.',
    },
    {
      positions: { RW: [90, 30], RCM: [50, 38] },
      ball: [50, 38],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross)',
      caption: "The striker gives it back to midfield rather than forcing a pass himself: the winger's run isn't ready yet.",
    },
    {
      positions: {},
      ball: [90, 30],
      focus: 'RW',
      input: 'Through ball (Y / Triangle)',
      caption: 'The ball is switched through the middle right as the winger arrives: the rotation has completely confused the marking.',
    },
    {
      positions: {},
      ball: [105, 26],
      focus: 'RW',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal after the front three swapped positions and pulled the defense apart.',
    },
  ],
};

export const PLAYS_343: Play[] = [HALF_SPACE_OVERLOAD, FRONT_THREE_ROTATION];
