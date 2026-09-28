// Starter plays for the 4-2-3-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-2-3-1')!.defaultPositions;

const SWITCH_THE_PLAY: Play = {
  id: 'switch-the-play',
  formation: '4-2-3-1',
  title: 'Switch the play',
  concept:
    "Switching the point of attack forces the entire defense to shift across the pitch: if you move the ball faster than they can move their feet, you isolate a winger 1v1 in space on the far side.",
  commonMistake:
    'Taking too many touches before switching: the longer you hold it, the more time the defense has to slide across and cover the switch.',
  startPositions: START,
  startBall: 'LDM',
  steps: [
    {
      positions: {},
      ball: [58, 58],
      focus: 'RW',
      input: 'Long / switch pass (L1 + Square, or lofted through ball)',
      caption:
        'The holding midfielder switches play with one long diagonal ball: the defense is compact on the left, so the winger is isolated 1v1 on the far side.',
    },
    {
      positions: { RW: [72, 55] },
      ball: 'RW',
      focus: 'RW',
      input: 'Sprint dribble (RB / R2)',
      caption: 'Facing a lone fullback in space, the winger attacks him directly at pace: 1v1s out wide are where isolation does the most damage.',
    },
    {
      positions: { RW: [85, 48] },
      ball: 'RW',
      focus: 'RW',
      caption: 'He cuts inside onto his stronger foot, opening up the passing and shooting angle.',
    },
    {
      positions: { CAM: [88, 38], ST: [92, 30] },
      ball: 'RW',
      focus: 'CAM',
      caption: "As the winger shapes up, the #10 arrives late into the box (exactly the space defenders forget to track) while the striker occupies the near post.",
    },
    {
      positions: {},
      ball: [88, 38],
      focus: 'CAM',
      input: 'Pass into space (A / Cross)',
      caption: 'The winger squares it into the run rather than forcing a difficult angle himself.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'CAM',
      input: 'Shoot (B / Circle)',
      caption: 'One-touch finish: arriving into space beats a covered near-post shot every time.',
    },
  ],
};

const UNDERLAP_FROM_THE_TEN: Play = {
  id: 'underlap-from-the-ten',
  formation: '4-2-3-1',
  title: 'Underlap from the #10',
  concept:
    "An underlapping run from the #10 attacks the inside of the fullback while the winger occupies him out wide: since the fullback is fixed on the winger, the run through the half-space usually goes unmarked.",
  commonMistake:
    "Crossing early instead of waiting: if the winger crosses before the underlap arrives, the run is wasted. Look up and pick the pass.",
  startPositions: START,
  startBall: 'RDM',
  steps: [
    {
      positions: {},
      ball: [58, 58],
      focus: 'RW',
      input: 'Ground pass (A / Cross)',
      caption: "The ball is worked out to the winger, who's staying high and wide to stretch the back four.",
    },
    {
      positions: { RW: [73, 56], CAM: [60, 40] },
      ball: 'RW',
      focus: 'CAM',
      input: 'Sprint / targeted run (RB / R2)',
      caption:
        'As the winger occupies the fullback out wide, the #10 makes a run underneath him, through the half-space the fullback just vacated.',
    },
    {
      positions: { CAM: [86, 36] },
      ball: 'RW',
      focus: 'CAM',
      caption: "The run continues into the box, timed to stay just onside while the fullback is fixed on the winger.",
    },
    {
      positions: {},
      ball: [86, 36],
      focus: 'CAM',
      input: 'Through ball / cutback (Y / Triangle)',
      caption: 'The winger slides it inside rather than crossing early: the underlapping run arrives right on cue.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'CAM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish, right through the space the underlap created.',
    },
  ],
};

export const PLAYS_4231: Play[] = [SWITCH_THE_PLAY, UNDERLAP_FROM_THE_TEN];
