// Starter plays for the 4-4-1-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-4-1-1')!.defaultPositions;

const BLINDSIDE_RUN_OFF_TARGET_MAN: Play = {
  id: 'blindside-run-off-target-man',
  formation: '4-4-1-1',
  title: 'Blindside run off the target man',
  concept:
    "A target man's job isn't just to hold the ball: it's to occupy a defender's full attention, so the second striker can peel into the blind spot the defender can't see while he's watching the man in front of him.",
  commonMistake:
    "The support forward making his run too early, in the defender's eyeline: wait until the defender is fully focused on the ball at the striker's feet before peeling away.",
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      // Lofted into ST. Unit steps up; CF sits on ST's left shoulder — not ahead yet.
      positions: {
        ST: [58, 34],
        CF: [50, 28],
        LCM: [46, 26],
        RCM: [48, 44],
        LM: [54, 8],
        RM: [54, 60],
        LB: [26, 8],
        RB: [26, 60],
        LCB: [20, 26],
        RCB: [20, 42],
      },
      ball: [58, 34],
      focus: 'ST',
      input: 'Lofted pass (X / Square)',
      caption:
        'The target man checks to the ball and shields it with his back to goal, giving the team time to push up.',
    },
    {
      // CF peels into the left half-space. ST opens into that corridor before
      // the ball leaves — still clear of the midfield presser.
      positions: {
        CF: [64, 12],
        ST: [54, 20],
        LCM: [46, 32],
        RCM: [50, 44],
        LM: [58, 5],
        RM: [56, 58],
      },
      ball: 'ST',
      focus: 'CF',
      caption:
        "While the defender is fixed on the man in front of him, the support forward peels away into his blind spot: the run he doesn't see coming.",
    },
    {
      // Short channel lay-off — receive in the half-space, facing the box.
      positions: {
        CF: [70, 10],
        ST: [54, 20],
        LCM: [48, 34],
        RCM: [52, 44],
        LM: [66, 5],
        RM: [58, 56],
      },
      ball: [70, 10],
      focus: 'CF',
      input: 'One-touch lay-off (A / Cross)',
      caption: "The target man doesn't try to turn: he lays it first time into the run that's already begun.",
    },
    {
      // After the lay-off: cut INSIDE off the blindside toward the near-post
      // channel — this is where 4-4-1-1 chances from this pattern actually are.
      positions: {
        CF: [90, 26],
        ST: [62, 28],
        LM: [80, 10],
        RM: [74, 52],
        RCM: [58, 40],
        LCM: [52, 32],
      },
      ball: 'CF',
      focus: 'CF',
      input: 'Sprint (RB / R2)',
      caption: 'He cuts inside onto the near-post channel: the center-back is still ball-watching the target man.',
    },
    {
      // 1v1 from a proper central angle — not the byline corner.
      positions: {
        CF: [98, 30],
      },
      ball: [105, 34],
      focus: 'CF',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper: the blindside run beat the defender before he even turned around.',
    },
  ],
};

const LATE_RUN_OFF_THE_LINKUP: Play = {
  id: 'late-run-off-the-linkup',
  formation: '4-4-1-1',
  title: "Late run off the CF's link-up",
  concept:
    'The support forward dropping to link play doesn\'t just keep possession: it drags a marker out of position, and the resulting gap is exactly where the other central midfielder should be driving into.',
  commonMistake:
    'The midfielder waiting for the pass instead of carrying forward himself: if the space is there, take it before the defense recovers its shape.',
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: { CF: [42, 34] },
      ball: [42, 34],
      focus: 'CF',
      input: 'Ground pass (A / Cross)',
      caption: 'The support forward drops to link play, pulling an opposition midfielder out to press him.',
    },
    {
      positions: { RCM: [48, 40] },
      ball: [48, 40],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross)',
      caption: "He lays it back into the space the presser just left: the midfielder is already out of position.",
    },
    {
      positions: { RCM: [68, 38] },
      ball: 'RCM',
      focus: 'RCM',
      input: 'Carry forward (left stick)',
      caption: 'With the space open, the midfielder drives forward before the defense can reorganize.',
    },
    {
      positions: { ST: [90, 30], RM: [75, 58] },
      ball: 'RCM',
      focus: 'ST',
      caption: 'The striker peels off the last defender as the midfielder gets close enough to thread it through.',
    },
    {
      positions: {},
      ball: [100, 28],
      focus: 'ST',
      input: 'Through ball (Y / Triangle)',
      caption: 'A pass right into the run: timed to beat the offside line, not before it.',
    },
    {
      positions: {},
      ball: [105, 26],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'One on one with the keeper: finish early.',
    },
  ],
};

export const PLAYS_4411: Play[] = [BLINDSIDE_RUN_OFF_TARGET_MAN, LATE_RUN_OFF_THE_LINKUP];
