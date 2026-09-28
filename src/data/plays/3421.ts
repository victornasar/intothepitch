// Starter plays for the 3-4-2-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('3-4-2-1')!.defaultPositions;

const WIDE_MID_BURST_BEHIND: Play = {
  id: 'wide-mid-burst-behind',
  formation: '3-4-2-1',
  title: 'Wide midfielder bursts beyond the drop',
  concept:
    'In a back three system, the support forwards dropping to combine draws defenders out of the last line: and since there\'s no natural winger, the wide midfielder\'s late burst beyond the dropping forward becomes the actual width.',
  commonMistake:
    'The wide midfielder bursting forward too early: wait for the forward to drop and drag a marker before making the run, or there\'s no gap to run into.',
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { RCF: [45, 36] },
      ball: [45, 36],
      focus: 'RCF',
      input: 'Ground pass (A / Cross)',
      caption: "The support forward drops off the front line to receive, and a center-back is reluctant to follow him too far from the back three.",
    },
    {
      positions: { RM: [58, 58] },
      ball: 'RCF',
      focus: 'RM',
      input: 'Sprint forward (RB / R2)',
      caption: 'As the forward drops, the wide midfielder bursts beyond him into the space out wide: the third man in the move.',
    },
    {
      positions: { RM: [78, 58] },
      ball: [78, 58],
      focus: 'RM',
      input: 'Through ball / one-touch lay-off (A / Cross)',
      caption: "A first-time lay-off sends the wide man through: the defense is still watching the forward who just received it.",
    },
    {
      positions: { RM: [100, 58], ST: [92, 28], LCF: [90, 40] },
      ball: 'RM',
      focus: 'RM',
      input: 'Sprint to byline (RB / R2)',
      caption: 'With two forwards attacking the box, the cross has options at both posts.',
    },
    {
      positions: {},
      ball: [92, 28],
      focus: 'ST',
      input: 'Cross (R1 / Cross)',
      caption: 'A low, driven cross to the near post, where the striker is already arriving.',
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

const THIRD_MAN_THROUGH_THE_FRONT_TWO: Play = {
  id: 'third-man-through-the-front-two',
  formation: '3-4-2-1',
  title: 'Third-man run through the front two',
  concept:
    'Two support forwards combining draws the defense\'s eyes to the ball: which is exactly when a central midfielder\'s late run from deep goes completely unmarked. It\'s a third-man run built around the front two instead of a winger.',
  commonMistake:
    "Starting the midfield run too early: it has to begin only once the forwards' combination has the defense's full attention.",
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: { LCF: [46, 24] },
      ball: [46, 24],
      focus: 'LCF',
      input: 'Ground pass (A / Cross)',
      caption: "The ball goes into the support forward, who's dropped to feet to link play.",
    },
    {
      positions: { RCF: [50, 38] },
      ball: [50, 38],
      focus: 'RCF',
      input: 'One-touch pass (A / Cross)',
      caption: 'A quick lay-off across to the other support forward keeps the move flowing and shifts the defense\'s attention.',
    },
    {
      positions: { RCM: [65, 44] },
      ball: 'RCF',
      focus: 'RCM',
      caption: 'While the defense tracks the two forwards combining, the central midfielder starts his run from deep, arriving late and unmarked.',
    },
    {
      positions: { RCM: [85, 44] },
      ball: [85, 44],
      focus: 'RCM',
      input: 'Through ball (Y / Triangle)',
      caption: "The pass goes through to the third man: the run that started off the ball is the one defenses forget to track.",
    },
    {
      positions: {},
      ball: [105, 38],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal from midfield: a run no one picked up.',
    },
  ],
};

export const PLAYS_3421: Play[] = [WIDE_MID_BURST_BEHIND, THIRD_MAN_THROUGH_THE_FRONT_TWO];
