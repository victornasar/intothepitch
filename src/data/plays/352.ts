// Starter plays for the 3-5-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('3-5-2')!.defaultPositions;

const WING_BACK_OVERLAP: Play = {
  id: 'wing-back-overlap',
  formation: '3-5-2',
  title: 'Wing-back overlap into the box',
  concept:
    'A back three frees up a spare defender, which means a wing-back can bomb forward without leaving the defense exposed: the extra center-back simply shifts across to cover. That turns the wing-back into an auxiliary winger.',
  commonMistake:
    "Committing the wing-back forward without checking that the spare center-back has shifted across to cover: if both remaining center-backs are still narrow, the space behind is wide open.",
  startPositions: START,
  startBall: 'CM',
  steps: [
    {
      positions: { LST: [45, 30] },
      ball: [45, 30],
      focus: 'LST',
      input: 'Ground pass (A / Cross)',
      caption:
        "The midfielder plays into the striker, who's dropped short: with a spare center-back covering behind, the wing-back is free to push on.",
    },
    {
      positions: { LWB: [75, 6] },
      ball: 'LST',
      focus: 'LWB',
      input: 'Overlap / sprint forward (RB / R2)',
      caption: 'Because there is a spare man at the back, the wing-back can commit fully forward without leaving a gap.',
    },
    {
      positions: { LWB: [95, 6] },
      ball: [95, 6],
      focus: 'LWB',
      input: 'Through ball / lay-off (A / Cross)',
      caption: "The striker lays it into the run rather than holding onto it: the wing-back is already flying forward.",
    },
    {
      positions: { LWB: [103, 6] },
      ball: 'LWB',
      focus: 'LWB',
      input: 'Sprint to byline (RB / R2)',
      caption: 'He reaches the byline before the back three can shuffle across to cover.',
    },
    {
      positions: { RCM: [90, 38] },
      ball: [90, 38],
      focus: 'RCM',
      input: 'Cutback pass (A / Cross)',
      caption: 'Cut back across goal, away from defenders who are facing their own net.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish before the defense can recover.',
    },
  ],
};

const SPARE_CENTER_BACK_CARRIES: Play = {
  id: 'spare-center-back-carries',
  formation: '3-5-2',
  title: 'Spare center-back steps into midfield',
  concept:
    "A back three lets the middle center-back safely carry the ball into midfield, since the other two can cover behind him: creating an extra passing option through the middle that most defenses aren't set up to track.",
  commonMistake:
    'Advancing the spare center-back too far, too central, without a midfielder dropping to cover for him: if he gets caught in possession, the defense is badly exposed.',
  startPositions: START,
  steps: [
    {
      positions: { CB: [35, 34] },
      ball: 'CB',
      focus: 'CB',
      input: 'Carry forward (left stick)',
      caption: 'With two other center-backs behind him, the middle CB can safely step into midfield and create an overload there.',
    },
    {
      positions: { RCM: [55, 44], RST: [62, 38] },
      ball: 'CB',
      focus: 'RCM',
      caption: 'The extra body in midfield drags an opponent out of position, opening a lane through the middle for a runner.',
    },
    {
      positions: { RCM: [75, 46] },
      ball: [62, 38],
      focus: 'RST',
      input: 'Ground pass / through ball (A / Cross)',
      caption: 'He picks out the striker\'s feet: the midfielder is already running beyond him into the space in behind.',
    },
    {
      positions: { RCM: [92, 42] },
      ball: [92, 42],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross)',
      caption: 'A quick lay-off sends the midfielder through, right on the run.',
    },
    {
      positions: {},
      ball: [105, 34],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'Through the middle and one on one with the keeper.',
    },
  ],
};

export const PLAYS_352: Play[] = [WING_BACK_OVERLAP, SPARE_CENTER_BACK_CARRIES];
