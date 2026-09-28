// Starter plays for the 4-3-3. Each teaches one attacking idea end to end.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-3-3')!.defaultPositions;

const OVERLAP_AND_CUTBACK: Play = {
  id: 'overlap-cutback',
  formation: '4-3-3',
  title: 'Overlap and cutback',
  concept:
    "Overlapping runs create a spare man out wide: once the winger drags a defender infield, the space in behind belongs to the overlapping fullback. From the byline, a cutback is played across defenders who are facing their own goal: one of the hardest angles for a goalkeeper to cover.",
  commonMistake:
    'Cutting the ball back too early, before the run arrives: wait until your teammate is actually arriving at the penalty spot, or the pass runs through to no one.',
  startPositions: START,
  steps: [
    {
      positions: { LW: [64, 24] },
      ball: 'LW',
      focus: 'LW',
      input: 'Sprint dribble (RB / R2)',
      caption:
        'The left winger dribbles inside off his stronger foot, dragging the right back inside with him and opening the width behind.',
    },
    {
      positions: { LB: [60, 6] },
      ball: 'LW',
      focus: 'LB',
      input: 'Targeted run (LB + direction / L1 + direction)',
      caption: 'The left back overlaps into the space out wide: the winger just dragged his marker inside, so the flank is empty.',
    },
    {
      positions: { LB: [92, 5], ST: [62, 28] },
      ball: [90, 6],
      focus: 'LB',
      input: 'Through ball (Y / Triangle)',
      caption:
        'The winger slides a first-time pass into the space in behind, while the striker peels toward the near post to pull the center-backs away from the cutback zone.',
    },
    {
      positions: { LB: [102, 6] },
      ball: 'LB',
      focus: 'LB',
      input: 'Sprint to the byline (RB / R2)',
      caption: 'The fullback takes it to the byline before the defense can recover: the deeper he gets, the harder the cutback is to defend.',
    },
    {
      positions: { RCM: [90, 38] },
      ball: [90, 38],
      focus: 'RCM',
      input: 'Cutback pass (A / Cross, low and driven)',
      caption:
        'He cuts the ball back across goal, away from the goalkeeper and defenders who are facing their own net: one of the highest-percentage chances in the game.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'RCM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish before the defense can scramble back across.',
    },
  ],
};

const THIRD_MAN_RUN: Play = {
  id: 'third-man-run',
  formation: '4-3-3',
  title: 'Third-man run',
  concept:
    "A \"third man\" run works because defenders track the ball and the first two players near it: by the time they notice the runner arriving late from deep, the through ball is already played. It only works if the run starts late and stays just onside.",
  commonMistake:
    "Sending the winger on his run too soon: start it late, after the first pass has already gone, so the defense doesn't see the third man coming until it's too late.",
  startPositions: START,
  startBall: 'CDM',
  steps: [
    {
      positions: { ST: [44, 28] },
      ball: [44, 28],
      focus: 'ST',
      input: 'Ground pass (A / Cross)',
      caption:
        'The striker drops off the back line to offer a passing option, pulling a center-back with him and opening the space in behind.',
    },
    {
      positions: { RCM: [50, 40], RW: [70, 50] },
      ball: [50, 40],
      focus: 'RCM',
      input: 'One-touch pass (A / Cross, tapped quickly)',
      caption:
        'The striker lays it off first time to keep the move flowing, and as the ball travels the right winger starts his run inside: the third man in the move.',
    },
    {
      positions: { RW: [86, 36], RCM: [54, 37] },
      ball: 'RCM',
      focus: 'RW',
      caption:
        "The winger's run is timed to start late, off the ball: the defense is watching the two players in front of them and doesn't see him arriving.",
    },
    {
      positions: { RW: [94, 32] },
      ball: [94, 32],
      focus: 'RW',
      input: 'Through ball (Y / Triangle)',
      caption: 'The midfielder slides it through exactly as the winger arrives: timed to beat the offside line, not before.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'RW',
      input: 'Shoot (B / Circle)',
      caption: 'One touch to finish before the last defender can recover.',
    },
  ],
};

export const PLAYS_433: Play[] = [OVERLAP_AND_CUTBACK, THIRD_MAN_RUN];
