// Starter plays for the 4-3-1-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-3-1-2')!.defaultPositions;

const HALF_SPACE_GIVE_AND_GO: Play = {
  id: 'half-space-give-and-go',
  formation: '4-3-1-2',
  title: 'Half-space give-and-go',
  concept:
    "The half-space (the inside channel between a fullback and center-back) is where a lot of defenses are most vulnerable, because neither defender is quite sure whose job it is to close it down. A quick give-and-go there is one of the most reliable ways through.",
  commonMistake:
    'Drifting too wide instead of staying in the half-space: go fully wide and a fullback picks you up easily; the half-space is the gap between two markers.',
  startPositions: START,
  steps: [
    {
      positions: { RCM: [45, 42] },
      ball: 'RCM',
      focus: 'RCM',
      input: 'Carry forward (left stick)',
      caption: "The midfielder drives into the half-space: the inside channel between the fullback and center-back that's often left unguarded.",
    },
    {
      positions: {},
      ball: [48, 34],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: "A short pass into the #10 starts the combination.",
    },
    {
      positions: { RCM: [62, 44] },
      ball: [62, 44],
      focus: 'RCM',
      input: 'One-touch return (A / Cross)',
      caption: 'The give-and-go sends the midfielder straight through the half-space: the fullback and center-back are both a step slow to react.',
    },
    {
      positions: { RCM: [80, 42], RST: [75, 40] },
      ball: 'RCM',
      focus: 'RCM',
      caption: 'As he advances, the near striker checks toward him for a one-two, while the other stays central and dangerous.',
    },
    {
      positions: {},
      ball: [75, 40],
      focus: 'RST',
      input: 'Ground pass (A / Cross)',
      caption: "A simple pass into the striker's feet.",
    },
    {
      positions: { LST: [93, 30] },
      ball: [93, 30],
      focus: 'LST',
      input: 'Through ball / one-touch pass (Y / Triangle)',
      caption: 'One touch sends the other striker clean through the middle.',
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'LST',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper, straight through the half-space combination.',
    },
  ],
};

const CAM_TURNS_BETWEEN_THE_LINES: Play = {
  id: 'cam-turns-between-the-lines',
  formation: '4-3-1-2',
  title: 'CAM turns between the lines',
  concept:
    "A #10 who receives on the half-turn between the lines, with two strikers splitting the channels either side of the center-backs, only ever has to pick which gap opened up: the defense can't cover both.",
  commonMistake: 'Forcing the pass to a covered striker out of habit: read which channel is actually open before releasing the ball.',
  startPositions: START,
  startBall: 'CM',
  steps: [
    {
      positions: {},
      ball: [48, 34],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: "The ball goes into the #10, checking to the ball between the lines with both strikers holding the back line.",
    },
    {
      positions: { CAM: [50, 34] },
      ball: 'CAM',
      focus: 'CAM',
      input: 'Turn (flick left stick)',
      caption: 'One touch to turn and face goal: with two strikers ahead of him, he already has two options.',
    },
    {
      positions: { LST: [85, 22], RST: [85, 46] },
      ball: 'CAM',
      focus: 'CAM',
      caption: "Both strikers peel off in opposite channels: whichever center-back holds his position, the other gap opens up.",
    },
    {
      positions: { LST: [95, 20] },
      ball: [95, 20],
      focus: 'LST',
      input: 'Through ball (Y / Triangle)',
      caption: "He picks the run that's a half-step ahead: the defense can't cover both channels at once.",
    },
    {
      positions: {},
      ball: [105, 20],
      focus: 'LST',
      input: 'Shoot (B / Circle)',
      caption: "One on one with the keeper: the second striker's run made this an easy read.",
    },
  ],
};

export const PLAYS_4312: Play[] = [HALF_SPACE_GIVE_AND_GO, CAM_TURNS_BETWEEN_THE_LINES];
