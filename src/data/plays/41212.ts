// Starter plays for the 4-1-2-1-2 (narrow diamond midfield).

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-1-2-1-2')!.defaultPositions;

const FULLBACK_PROVIDES_WIDTH: Play = {
  id: 'fullback-provides-width',
  formation: '4-1-2-1-2',
  title: 'Fullback provides the only width',
  concept:
    "A narrow diamond has no wingers, so width has to come from the fullbacks: when one commits fully forward, the front two rotate so one always stays central to occupy the defense while the other combines out wide.",
  commonMistake:
    'Both strikers drifting wide to help the overlap: leave at least one central, or there\'s no one left to attack the back-post cross.',
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: {},
      ball: [18, 58],
      focus: 'RB',
      input: 'Ground pass (A / Cross)',
      caption: "With no winger ahead of him, the fullback has to provide the width himself: the ball is shifted out to him early.",
    },
    {
      positions: { RB: [55, 60] },
      ball: 'RB',
      focus: 'RB',
      input: 'Carry forward (left stick)',
      caption: "He drives into the space: a back four's fullback often isn't used to tracking an overlapping run this high.",
    },
    {
      positions: { RST: [70, 50] },
      ball: 'RB',
      focus: 'RST',
      caption: 'The near striker drifts wide to offer a combination, while the other stays central and pins both center-backs.',
    },
    {
      positions: {},
      ball: [70, 50],
      focus: 'RST',
      input: 'Ground pass (A / Cross)',
      caption: 'A pass into feet, with the fullback continuing his run beyond it.',
    },
    {
      positions: { RB: [90, 60] },
      ball: [90, 60],
      focus: 'RB',
      input: 'One-touch return (A / Cross)',
      caption: 'The give-and-go sends the fullback through: exactly the kind of run a diamond midfield relies on for width.',
    },
    {
      positions: {},
      ball: [92, 26],
      focus: 'LST',
      input: 'Cross (R1 / Cross)',
      caption: 'A cross to the far post, where the other striker has stayed central and is now arriving unmarked.',
    },
    {
      positions: {},
      ball: [105, 24],
      focus: 'LST',
      input: 'Shoot / Header (B / Circle)',
      caption: 'Far-post finish: he never needed to move far, because the width came from someone else entirely.',
    },
  ],
};

const CDM_SPRINGS_THE_FRONT_TWO: Play = {
  id: 'cdm-springs-the-front-two',
  formation: '4-1-2-1-2',
  title: 'CDM springs the front two',
  concept:
    'The deep-lying midfielder at the base of a diamond often has more time on the ball than anyone else on the pitch, since opponents naturally press the front four first: that time is enough to pick a single pass that skips the entire midfield.',
  commonMistake:
    'Taking too many touches before playing the vertical ball: the extra time exists only because no one is closing him down yet; use it quickly.',
  startPositions: START,
  steps: [
    {
      positions: { CDM: [38, 34] },
      ball: 'CDM',
      focus: 'CDM',
      input: 'Carry forward (left stick)',
      caption: 'Sitting at the base of the diamond, the deep midfielder often has time on the ball: opponents press the front four first.',
    },
    {
      positions: { CAM: [52, 28], LST: [75, 24] },
      ball: 'CDM',
      focus: 'LST',
      caption: "As the #10 shows for it, the near striker spins off the shoulder of the last defender.",
    },
    {
      positions: { LST: [92, 22] },
      ball: [92, 22],
      focus: 'LST',
      input: 'Through ball (Y / Triangle)',
      caption: "One long pass from deep, straight through the space: the diamond's base can see the whole pitch.",
    },
    {
      positions: { RST: [92, 42] },
      ball: 'LST',
      focus: 'LST',
      caption: 'The other striker arrives at the back post in case the shot needs to be squared.',
    },
    {
      positions: {},
      ball: [105, 20],
      focus: 'LST',
      input: 'Shoot (B / Circle)',
      caption: 'A one-on-one finish from a single pass out of defense.',
    },
  ],
};

export const PLAYS_41212: Play[] = [FULLBACK_PROVIDES_WIDTH, CDM_SPRINGS_THE_FRONT_TWO];
