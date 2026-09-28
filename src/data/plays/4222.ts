// Starter plays for the 4-2-2-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-2-2-2')!.defaultPositions;

const POCKET_COMBINATION: Play = {
  id: 'pocket-combination',
  formation: '4-2-2-2',
  title: 'Pocket combination play',
  concept:
    "The two attacking mids operate in the pockets between the lines: combining directly with a central striker through quick give-and-goes is often the fastest way to break through a compact defense, since there's no need to go the long way around via the flanks.",
  commonMistake: 'Taking too many touches in the pocket: the space between the lines closes fast; play the give-and-go first time.',
  startPositions: START,
  startBall: 'RDM',
  steps: [
    {
      positions: {},
      ball: [48, 54],
      focus: 'RAM',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball is worked to the right attacking mid, tucked infield in the pocket between the lines.',
    },
    {
      positions: { RST: [68, 40] },
      ball: [68, 40],
      focus: 'RST',
      input: 'One-touch pass (A / Cross)',
      caption: "A quick pass into the striker's feet starts the combination centrally.",
    },
    {
      positions: { RAM: [80, 46] },
      ball: [80, 46],
      focus: 'RAM',
      input: 'One-touch return (A / Cross)',
      caption: 'The striker lays it first time into the run: the give-and-go sends the attacking mid straight through the gap.',
    },
    {
      positions: { RAM: [92, 42], LAM: [75, 30], LST: [92, 26] },
      ball: 'RAM',
      focus: 'RAM',
      caption: 'As he bursts into the box, the other pieces rotate to occupy defenders and keep the box full.',
    },
    {
      positions: {},
      ball: [105, 38],
      focus: 'RAM',
      input: 'Shoot (B / Circle)',
      caption: 'Through the middle and one on one with the keeper.',
    },
  ],
};

const DOUBLE_PIVOT_ROTATION: Play = {
  id: 'double-pivot-rotation',
  formation: '4-2-2-2',
  title: 'Double pivot: one steps up, the other covers',
  concept:
    "The double pivot doesn't have to sit static: when one holding midfielder's passing option drifts wide, the other can rotate forward into the space, keeping the team's shape solid while still adding a body to the attack.",
  commonMistake:
    'Both holding midfielders advancing at once: if the pivot is empty, one loose ball anywhere in midfield turns into an instant counterattack.',
  startPositions: START,
  steps: [
    {
      positions: { LAM: [52, 10] },
      ball: 'LB',
      focus: 'LAM',
      caption: 'The left attacking mid drifts wide to create a two-on-one with the fullback against a lone marker.',
    },
    {
      positions: { LDM: [45, 24] },
      ball: 'LB',
      focus: 'LDM',
      caption: 'As the attacking mid goes wide, the holding midfielder steps up to fill the space: the double pivot rotates rather than both sitting deep.',
    },
    {
      positions: {},
      ball: [52, 10],
      focus: 'LAM',
      input: 'Ground pass (A / Cross)',
      caption: 'The fullback finds the attacking mid in the two-on-one out wide.',
    },
    {
      positions: {},
      ball: [45, 24],
      focus: 'LDM',
      input: 'Cutback pass (A / Cross)',
      caption: "Rather than cross first time, he cuts it back inside to the midfielder who's stepped into space.",
    },
    {
      positions: { LST: [85, 30] },
      ball: [85, 30],
      focus: 'LST',
      input: 'Through ball (Y / Triangle)',
      caption: "From distance, the midfielder finds the striker's run in behind.",
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'LST',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper: finish early.',
    },
  ],
};

export const PLAYS_4222: Play[] = [POCKET_COMBINATION, DOUBLE_PIVOT_ROTATION];
