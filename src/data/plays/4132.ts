// Starter plays for the 4-1-3-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-1-3-2')!.defaultPositions;

const FRONT_TWO_INTERCHANGE: Play = {
  id: 'front-two-interchange',
  formation: '4-1-3-2',
  title: 'Front-two interchange',
  concept:
    'A lone holding midfielder lets the front two interchange freely (one drops to link play while the other spins in behind) because the base stays compact and screened no matter what happens further forward.',
  commonMistake:
    "The striker holding the ball too long after receiving it: the whole point of dropping short is to play it first time into the run, not to try to beat a man with his back to goal.",
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: { LST: [48, 30] },
      ball: [48, 30],
      focus: 'LST',
      input: 'Ground pass (A / Cross)',
      caption:
        'The holding midfielder keeps the base solid (screening in front of the back four) and finds the front two with a simple pass into feet.',
    },
    {
      positions: { RST: [76, 36] },
      ball: 'LST',
      focus: 'RST',
      input: 'Targeted run (L1 + direction)',
      caption:
        "Timing the run off a teammate who still has the ball, not off the ball itself, is what beats a defender who's watching the man rather than the space.",
    },
    {
      positions: { RST: [92, 34] },
      ball: [92, 34],
      focus: 'RST',
      input: 'First-time lay-off / through ball (Y / Triangle)',
      caption: 'One touch is the difference between beating the offside line and running into a recovering defender.',
    },
    {
      positions: { RST: [97, 32] },
      ball: 'RST',
      focus: 'RST',
      caption: 'Because the holding midfielder never joined the attack, the base is still there to cover if this breaks down.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper: finish early before the angle closes.',
    },
  ],
};

const MANUFACTURED_WIDTH: Play = {
  id: 'manufactured-width',
  formation: '4-1-3-2',
  title: 'Manufactured width',
  concept:
    'This shape has no natural wide player, so width has to be manufactured: a striker drifting to the touchline creates the space for a central midfielder to underlap inside him, combining to create a chance through what is usually a narrow shape.',
  commonMistake:
    "Both strikers ending up central with nobody providing width: if no one drifts wide, the fullback never has a reason to leave his line and the underlap has no space to run into.",
  startPositions: START,
  startBall: 'CM',
  steps: [
    {
      positions: {},
      ball: [42, 48],
      focus: 'RCM',
      input: 'Ground pass (A / Cross)',
      caption: "Without a natural winger, the shape funnels the ball into the half-space through the midfield three.",
    },
    {
      positions: { RST: [65, 60] },
      ball: 'RCM',
      focus: 'RST',
      caption: 'One striker drifts out to the touchline: since this formation has no winger, someone has to create the width manually.',
    },
    {
      positions: {},
      ball: [65, 60],
      focus: 'RST',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball goes out to the width he just created.',
    },
    {
      positions: { RST: [80, 58], RCM: [75, 40] },
      ball: 'RST',
      focus: 'RCM',
      caption:
        "As the striker occupies the fullback out wide, the midfielder underlaps inside him: into the half-space the fullback can't cover without leaving his line.",
    },
    {
      positions: { RCM: [90, 40] },
      ball: [90, 40],
      focus: 'RCM',
      input: 'Cutback (A / Cross)',
      caption: 'Cut back inside rather than crossing: the underlapping run arrives centrally, in the most dangerous area.',
    },
    {
      positions: {},
      ball: [105, 34],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish through the middle.',
    },
  ],
};

export const PLAYS_4132: Play[] = [FRONT_TWO_INTERCHANGE, MANUFACTURED_WIDTH];
