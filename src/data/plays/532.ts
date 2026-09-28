// Starter plays for the 5-3-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('5-3-2')!.defaultPositions;

const WING_BACK_MIDFIELD_COMBO: Play = {
  id: 'wing-back-midfield-combo',
  formation: '5-3-2',
  title: 'Wing-back and midfielder combination',
  concept:
    "The extra center-back in a back five means a wing-back can commit fully forward, and a central midfielder underlapping inside him (timed to arrive late) is nearly impossible for a settled back four to pick up, especially with a striker's decoy run dragging a defender away from the cutback lane.",
  commonMistake:
    'The underlapping run arriving too early and standing offside, or too late and missing the cutback: timing it to the wing-back reaching the byline is what makes it work.',
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { RWB: [50, 62] },
      ball: [50, 62],
      focus: 'RWB',
      input: 'Ground pass (A / Cross)',
      caption: "The ball is switched out to the advancing wing-back: with three center-backs behind, he's free to get forward.",
    },
    {
      positions: { RWB: [75, 60], RST: [90, 30] },
      ball: 'RWB',
      focus: 'RWB',
      caption:
        'As the wing-back drives on, the near striker peels to the front post: a decoy run that occupies a center-back and clears the cutback lane.',
    },
    {
      positions: { RWB: [95, 60], RCM: [85, 46] },
      ball: 'RWB',
      focus: 'RCM',
      input: 'Underlapping run (RB / R2)',
      caption: 'The midfielder makes his run underneath the wing-back: timed to arrive as the ball nears the box, not before.',
    },
    {
      positions: { RCM: [93, 42] },
      ball: [93, 42],
      focus: 'RCM',
      input: 'Cutback / through ball (Y / Triangle)',
      caption:
        'Rather than cross, he picks out the underlapping run: arriving centrally is far more dangerous than another cross into a crowded box.',
    },
    {
      positions: {},
      ball: [105, 38],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'One touch, first time, before the defense can react.',
    },
  ],
};

const CENTRAL_MIDFIELDER_DRIVES_THE_LINE: Play = {
  id: 'central-midfielder-drives-the-line',
  formation: '5-3-2',
  title: 'Central midfielder drives the line',
  concept:
    'With two other central midfielders able to cover behind, one is free to drive the ball forward through midfield himself: his run drags a defensive line forward and opens the space in behind for the front two.',
  commonMistake:
    'All three midfielders staying flat and none of them carrying forward: someone has to break the line personally, or the team just recycles possession sideways.',
  startPositions: START,
  steps: [
    {
      positions: {},
      ball: 'CM',
      focus: 'CM',
      caption: 'With two other central midfielders holding their positions to cover, the base stays compact as he prepares to break forward.',
    },
    {
      positions: { CM: [50, 34] },
      ball: 'CM',
      focus: 'CM',
      input: 'Carry forward (left stick)',
      caption: 'With two other central midfielders providing cover, he can drive forward through the middle without leaving the base exposed.',
    },
    {
      positions: { RST: [75, 40], LST: [85, 22] },
      ball: 'CM',
      focus: 'RST',
      input: 'Targeted run (L1 + direction)',
      caption: 'One striker peels in behind as the carry draws a defender out, while his partner drifts across as a decoy.',
    },
    {
      positions: { RST: [92, 38] },
      ball: [92, 38],
      focus: 'RST',
      input: 'Through ball (Y / Triangle)',
      caption: 'The pass goes the moment the run beats the last defender: any later and the offside line catches up.',
    },
    {
      positions: {},
      ball: [105, 36],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal, one on one.',
    },
  ],
};

export const PLAYS_532: Play[] = [WING_BACK_MIDFIELD_COMBO, CENTRAL_MIDFIELDER_DRIVES_THE_LINE];
