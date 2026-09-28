// Starter plays for the 5-4-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('5-4-1')!.defaultPositions;

const LONE_STRIKER_LINKS_WITH_WIDE_MID: Play = {
  id: 'lone-striker-links-with-wide-mid',
  formation: '5-4-1',
  title: 'Lone striker links, wide mid bursts beyond',
  concept:
    'With just one out-and-out striker, he has to drop off the last defender to get involved in the game: staying high and isolated means he never touches the ball. That drop opens the space in behind for a wide midfielder to become the real goal threat.',
  commonMistake:
    'Leaving the striker isolated up front with no one dropping to link: if he never touches the ball, the wide midfielder has no run to make.',
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: { ST: [48, 30] },
      ball: [48, 30],
      focus: 'ST',
      input: 'Ground pass (A / Cross)',
      caption:
        'With just one striker up top, he has to drop off the last defender to get involved: staying high alone means he never sees the ball.',
    },
    {
      positions: { RM: [62, 50] },
      ball: 'ST',
      focus: 'RM',
      input: 'Sprint / targeted run (RB / R2)',
      caption: 'As the striker drops to receive, the wide midfielder bursts beyond him into the space he just vacated.',
    },
    {
      positions: { RM: [85, 48] },
      ball: [85, 48],
      focus: 'RM',
      input: 'One-touch pass (A / Cross)',
      caption: "He doesn't try to turn and carry it: a first-time lay-off sends the midfielder through immediately.",
    },
    {
      positions: { RM: [96, 42] },
      ball: 'RM',
      focus: 'RM',
      input: 'Sprint in behind (RB / R2)',
      caption:
        'The run started the moment the lay-off went in: with only one striker up top, the wide midfielder has to be the one arriving late in the box.',
    },
    {
      positions: {},
      ball: [105, 34],
      focus: 'RM',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper: finish early before the angle closes.',
    },
  ],
};

const TWO_V_ONE_DOWN_THE_FLANK: Play = {
  id: 'two-v-one-down-the-flank',
  formation: '5-4-1',
  title: '2v1 down the flank: wide mid and wing-back',
  concept:
    "Pairing a wide midfielder with the wing-back behind him creates a 2v1 out wide that a lone defender can't cover alone: and since a back five has the numbers to spare, the wing-back is free to bomb on and commit fully forward.",
  commonMistake:
    "Both players staying level with each other out wide: stagger the runs, so there's always a passing option instead of two players marked by the same defender.",
  startPositions: START,
  steps: [
    {
      positions: { LWB: [50, 6] },
      ball: 'LM',
      focus: 'LWB',
      input: 'Overlap / targeted run (L1 + direction)',
      caption:
        'The wide midfielder holds it while the wing-back overlaps outside him: two players out wide against one defender is a numbers-up situation.',
    },
    {
      positions: { LWB: [78, 6] },
      ball: [78, 6],
      focus: 'LWB',
      input: 'Through ball (Y / Triangle)',
      caption: 'He releases it into the overlap: the defender can only face one runner at a time.',
    },
    {
      positions: { LWB: [100, 6], ST: [92, 28], RM: [88, 45] },
      ball: 'LWB',
      focus: 'LWB',
      input: 'Sprint to byline (RB / R2)',
      caption:
        'Both the striker and the far-side midfielder are already filling the box: with a back five behind him, the wing-back can commit fully forward.',
    },
    {
      positions: {},
      ball: [92, 28],
      focus: 'ST',
      input: 'Cross (R1 / Cross)',
      caption: 'A low, driven ball to the near post: the hardest kind for a keeper to deal with.',
    },
    {
      positions: {},
      ball: [105, 26],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'One touch at the near post before the defense can react.',
    },
  ],
};

export const PLAYS_541: Play[] = [LONE_STRIKER_LINKS_WITH_WIDE_MID, TWO_V_ONE_DOWN_THE_FLANK];
