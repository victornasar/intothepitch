// Starter plays for the 5-2-1-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('5-2-1-2')!.defaultPositions;

const CAM_FINDS_THE_POCKET: Play = {
  id: 'cam-finds-the-pocket',
  formation: '5-2-1-2',
  title: 'The #10 finds the pocket',
  concept:
    'A back five frees a wing-back to bomb forward, and as the opposition shifts to track him, the CAM finds the pocket of space that opens up centrally: turning him into the free man who unlocks the defense.',
  commonMistake:
    "The CAM chasing the ball out wide instead of holding his position in the pocket: if he drifts wide too, there's no one left to exploit the space centrally.",
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { RWB: [55, 62] },
      ball: [55, 62],
      focus: 'RWB',
      input: 'Ground pass (A / Cross)',
      caption: 'The wing-back bombs forward down the right: with three center-backs behind, the team can afford to commit him fully.',
    },
    {
      positions: { CAM: [58, 40] },
      ball: 'RWB',
      focus: 'CAM',
      caption:
        "As the defense shifts to deal with the wing-back, the #10 finds space in the pocket between the lines: exactly where a back five's midfield gets stretched thin.",
    },
    {
      positions: { RWB: [95, 58] },
      ball: [58, 40],
      focus: 'CAM',
      input: 'Cutback / pass inside (A / Cross)',
      caption:
        'Rather than cross early, he picks out the free man in the pocket: the CAM has more time on the ball there than anyone would in the box.',
    },
    {
      positions: { RST: [85, 44] },
      ball: [85, 44],
      focus: 'RST',
      input: 'Through ball (Y / Triangle)',
      caption: "One touch to turn, then thread it through: the pocket is the perfect platform to pick a final pass.",
    },
    {
      positions: {},
      ball: [105, 38],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal: finish early.',
    },
  ],
};

const MIDFIELDER_JOINS_THE_ATTACK: Play = {
  id: 'midfielder-joins-the-attack',
  formation: '5-2-1-2',
  title: 'Central midfielder joins the front two',
  concept:
    'A back five and a double pivot give enough defensive cover that one of the two central midfielders can safely join the attack as an auxiliary striker: arriving late into the box is what makes him hard to track.',
  commonMistake:
    'Both central midfielders pushing forward together: someone has to stay to screen the back five, or a turnover leaves the defense completely exposed.',
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: {},
      ball: [46, 34],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: "The ball is worked into the #10: with a back five and the holding midfielder behind, there's cover to commit a man forward.",
    },
    {
      positions: { RCM: [70, 44] },
      ball: 'CAM',
      focus: 'RCM',
      input: 'Late run (RB / R2)',
      caption:
        'Because the back five and the other pivot are covering, the second midfielder can burst beyond the #10 without leaving a gap.',
    },
    {
      positions: { LST: [52, 26] },
      ball: [52, 26],
      focus: 'LST',
      input: 'Ground pass (A / Cross)',
      caption: "The #10 finds the striker dropping short, keeping the move flowing centrally.",
    },
    {
      positions: { RCM: [88, 40] },
      ball: [88, 40],
      focus: 'RCM',
      input: 'Through ball / lay-off (Y / Triangle)',
      caption: "First time, into the space the midfielder's run has already found: arriving late means he's unmarked.",
    },
    {
      positions: {},
      ball: [105, 36],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'Arriving from deep, unmarked, in front of goal.',
    },
  ],
};

export const PLAYS_5212: Play[] = [CAM_FINDS_THE_POCKET, MIDFIELDER_JOINS_THE_ATTACK];
