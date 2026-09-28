// Starter plays for the 4-3-2-1 ("Christmas tree").

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-3-2-1')!.defaultPositions;

const FRONT_THREE_INTERCHANGE: Play = {
  id: 'front-three-interchange',
  formation: '4-3-2-1',
  title: 'Front three interchange',
  concept:
    "The \"Christmas tree\" front three constantly interchange positions: when the lone striker drops to combine, he drags a center-back with him, and the resulting gap is exactly where a support forward or midfielder times a run into.",
  commonMistake:
    'All three forwards making the same run at the same time: stagger the movement so only one player occupies the space a defender vacates.',
  startPositions: START,
  startBall: 'CM',
  steps: [
    {
      positions: { ST: [52, 30] },
      ball: [52, 30],
      focus: 'ST',
      input: 'Ground pass (A / Cross)',
      caption: 'The lone striker drops short to receive, pulling a center-back out of the defensive line with him.',
    },
    {
      positions: { RCF: [68, 40] },
      ball: 'ST',
      focus: 'RCF',
      caption: "As the center-back follows the striker out, the right support forward darts into the gap he leaves behind: the interchange is what drags defenders out of shape.",
    },
    {
      positions: { LCM: [62, 26], RCF: [82, 36] },
      ball: [62, 26],
      focus: 'LCM',
      input: 'One-touch pass (A / Cross)',
      caption: "The striker lays it into the midfielder's run: the third man arriving through the gap the interchange created.",
    },
    {
      positions: { RCF: [95, 34] },
      ball: [95, 34],
      focus: 'RCF',
      input: 'Through ball (Y / Triangle)',
      caption: 'The pass goes exactly where the center-back used to be: before the striker dragged him away.',
    },
    {
      positions: {},
      ball: [105, 32],
      focus: 'RCF',
      input: 'Shoot (B / Circle)',
      caption: "One on one with the keeper, straight through the space the front three's rotation created.",
    },
  ],
};

const MIDFIELDER_EXPLOITS_THE_SPACE: Play = {
  id: 'midfielder-exploits-the-space',
  formation: '4-3-2-1',
  title: 'Midfielder exploits the space',
  concept:
    'Pushing three forwards high pins the opposition\'s back line deep, which opens the space in front of the defense for a midfielder to carry into unchallenged.',
  commonMistake:
    "Advancing the midfielder without a support runner alongside: if he's isolated, the defense can afford to double up on him.",
  startPositions: START,
  steps: [
    {
      positions: { LCM: [45, 22] },
      ball: 'LCM',
      focus: 'LCM',
      input: 'Carry forward (left stick)',
      caption: 'With three forwards pinning the back four deep, the space in front of the defense is wide open for a midfielder to run into.',
    },
    {
      positions: { LCM: [65, 24] },
      ball: 'LCM',
      focus: 'LCM',
      caption: 'No one picks him up: the deeper midfielders are occupied tracking the front three.',
    },
    {
      positions: { CM: [55, 34], RCF: [62, 44] },
      ball: 'LCM',
      focus: 'LCM',
      caption: 'The other midfielder offers support, and the support forward drops to open a passing lane through the middle.',
    },
    {
      positions: {},
      ball: [62, 44],
      focus: 'RCF',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball goes into the pocket between the lines: the hardest gap for a defense to close.',
    },
    {
      positions: { ST: [92, 34] },
      ball: [92, 34],
      focus: 'ST',
      input: 'Through ball (Y / Triangle)',
      caption: 'One touch to turn, then straight through to the striker peeling off the last man.',
    },
    {
      positions: {},
      ball: [105, 32],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal: finish before the last defender recovers.',
    },
  ],
};

export const PLAYS_4321: Play[] = [FRONT_THREE_INTERCHANGE, MIDFIELDER_EXPLOITS_THE_SPACE];
