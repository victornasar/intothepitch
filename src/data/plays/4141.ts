// Starter plays for the 4-1-4-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-1-4-1')!.defaultPositions;

const CDM_SHIELDS_BOTH_FULLBACKS: Play = {
  id: 'cdm-shields-both-fullbacks',
  formation: '4-1-4-1',
  title: 'CDM shields while fullbacks bomb on',
  concept:
    'A single holding midfielder shielding the back four means both fullbacks can push forward at once without leaving the defense exposed: the extra bodies forward come from width on both sides simultaneously.',
  commonMistake: 'Both fullbacks committing forward with no cover at all: the CDM can screen one loose ball, not an entire back four\'s worth of gaps.',
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: {},
      ball: [42, 60],
      focus: 'RM',
      input: 'Ground pass (A / Cross)',
      caption: 'The lone holding midfielder screens the back four, which frees both fullbacks to push forward without worry.',
    },
    {
      positions: { RB: [60, 60] },
      ball: 'RM',
      focus: 'RB',
      input: 'Overlap run (L1 + direction)',
      caption: "With the CDM covering, the right back bursts forward: there's defensive cover behind him even if the move breaks down.",
    },
    {
      positions: { RB: [85, 60] },
      ball: [85, 60],
      focus: 'RB',
      input: 'Through ball (Y / Triangle)',
      caption: 'He releases the overlapping fullback into the space out wide.',
    },
    {
      positions: { RB: [102, 60], ST: [92, 30], LM: [88, 42] },
      ball: 'RB',
      focus: 'RB',
      input: 'Sprint to byline (RB / R2)',
      caption: 'With the holding midfielder still shielding the defense, the far winger can afford to tuck inside for the cross too.',
    },
    {
      positions: {},
      ball: [92, 28],
      focus: 'ST',
      input: 'Cross (R1 / Cross)',
      caption: 'A driven cross to the near post.',
    },
    {
      positions: {},
      ball: [105, 26],
      focus: 'ST',
      input: 'Shoot / Header (B / Circle)',
      caption: "Near-post finish: the lone striker's movement made the difference.",
    },
  ],
};

const WIDE_STRETCH_MIDFIELD_ARRIVES: Play = {
  id: 'wide-stretch-midfield-arrives',
  formation: '4-1-4-1',
  title: 'Wide players stretch, midfielders arrive',
  concept:
    'Stretching the back four wide with the flat midfield four opens space centrally: and because defenders are trained to track the striker, a central midfielder\'s late arrival into the box often goes completely unmarked.',
  commonMistake:
    'Waiting for the striker to get on the end of every cross: with a flat midfield four, a late-arriving midfielder is frequently the free man instead.',
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: {},
      ball: [40, 26],
      focus: 'LCM',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball is worked into the midfielder, with the wide players holding their width to stretch the back four side to side.',
    },
    {
      positions: {},
      ball: [42, 8],
      focus: 'LM',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball reaches the wide man, who has the fullback pinned deep and wide.',
    },
    {
      positions: { LM: [58, 8], RCM: [68, 44] },
      ball: 'LM',
      focus: 'RCM',
      caption: 'As the winger occupies his man out wide, the far-side central midfielder senses the space and starts a run into the box.',
    },
    {
      positions: {},
      ball: [80, 40],
      focus: 'RCM',
      input: 'Cross (R1 / Cross)',
      caption: "He crosses early, aiming for the midfielder's run rather than waiting for a striker who's tightly marked.",
    },
    {
      positions: {},
      ball: [105, 36],
      focus: 'RCM',
      input: 'Shoot / Header (B / Circle)',
      caption: "A midfielder's late run is often unmarked: center-backs are watching the striker, not the runner from deep.",
    },
  ],
};

export const PLAYS_4141: Play[] = [CDM_SHIELDS_BOTH_FULLBACKS, WIDE_STRETCH_MIDFIELD_ARRIVES];
