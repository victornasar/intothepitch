// Starter plays for the 3-1-4-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('3-1-4-2')!.defaultPositions;

const PIVOT_SWITCHES_PLAY: Play = {
  id: 'pivot-switches-play',
  formation: '3-1-4-2',
  title: 'The pivot switches play',
  concept:
    'A single holding midfielder gives the whole team a stable point to recycle possession from: from deep and central, he can switch play to either flank before the defense can slide across, isolating a wide midfielder in space.',
  commonMistake:
    'Rushing the switch before actually assessing which side is open: a misplaced long ball straight to a covered defender gives possession away instead of creating the overload.',
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: {},
      ball: [42, 60],
      focus: 'RM',
      input: 'Long / switch pass (L1 + Square)',
      caption: 'The lone pivot sits deep and recycles the ball: from there, he can switch play to whichever side is more open.',
    },
    {
      positions: { RM: [62, 58] },
      ball: 'RM',
      focus: 'RM',
      input: 'Sprint dribble (RB / R2)',
      caption: "He's isolated 1v1 out wide: the defense was compact on the other side when the switch was played.",
    },
    {
      positions: { RST: [70, 48] },
      ball: 'RM',
      focus: 'RST',
      caption: 'The near striker drops to link up, giving the wide midfielder an option instead of forcing a cross.',
    },
    {
      positions: {},
      ball: [70, 48],
      focus: 'RST',
      input: 'Ground pass (A / Cross)',
      caption: "A simple pass inside: the striker's movement created the option, not a difficult ball.",
    },
    {
      positions: { RM: [90, 52] },
      ball: [90, 52],
      focus: 'RM',
      input: 'One-touch pass (A / Cross)',
      caption: 'A quick lay-off sends the midfielder through: he never stopped running after the pass.',
    },
    {
      positions: {},
      ball: [105, 44],
      focus: 'RM',
      input: 'Shoot (B / Circle)',
      caption: 'Through on goal after the switch and combination pulled the defense across and back again.',
    },
  ],
};

const CENTRAL_OVERLOAD_UNDERLAP: Play = {
  id: 'central-overload-underlap',
  formation: '3-1-4-2',
  title: 'Central overload: midfielder underlaps the strikers',
  concept:
    'With two strikers occupying both center-backs, the middle of the pitch opens up for a central midfielder to run straight through it: a run that is almost impossible for markers fixated on the front two to track.',
  commonMistake:
    "Sending the midfielder on his run too early: if he arrives before the strikers have actually pinned both center-backs, there's a defender free to step across and cut it out.",
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: { LST: [48, 28] },
      ball: [48, 28],
      focus: 'LST',
      input: 'Ground pass (A / Cross)',
      caption: "The midfielder feeds the near striker, who's dropped off the last defender to create an option centrally.",
    },
    {
      positions: { RCM: [52, 40] },
      ball: [52, 40],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross)',
      caption:
        'He lays it off first time: the second striker stays high to keep both center-backs occupied and out of the midfield.',
    },
    {
      positions: { LM: [70, 30] },
      ball: 'RCM',
      focus: 'LM',
      input: 'Sprint / targeted run (RB / R2)',
      caption: 'With both center-backs fixed on the strikers, a midfielder can run straight through the middle almost unnoticed.',
    },
    {
      positions: { LM: [92, 26] },
      ball: [92, 26],
      focus: 'LM',
      input: 'Through ball (Y / Triangle)',
      caption: 'The pass goes right through the space the two strikers just cleared by holding their positions.',
    },
    {
      positions: {},
      ball: [105, 24],
      focus: 'LM',
      input: 'Shoot (B / Circle)',
      caption: 'Through the middle and one on one with the keeper: arriving from deep beats a marker who was watching the strikers, not him.',
    },
  ],
};

export const PLAYS_3142: Play[] = [PIVOT_SWITCHES_PLAY, CENTRAL_OVERLOAD_UNDERLAP];
