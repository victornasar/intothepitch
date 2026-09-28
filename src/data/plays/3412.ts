// Starter plays for the 3-4-1-2.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('3-4-1-2')!.defaultPositions;

const WIDE_ISOLATION_WITH_COVER: Play = {
  id: 'wide-isolation-with-cover',
  formation: '3-4-1-2',
  title: 'Wide isolation, backed by cover',
  concept:
    "A back three lets the wide midfielders gamble in 1v1 duels that a flat back four's fullbacks couldn't risk: if it breaks down, there's already spare cover centrally.",
  commonMistake:
    "Forcing a shot from a tight angle after cutting inside instead of squaring it to the free #10: the extra cover behind means there's no rush; use the option in the middle.",
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: {},
      ball: [32, 60],
      focus: 'RM',
      input: 'Ground pass (A / Cross)',
      caption:
        "The ball is worked out to the wide midfielder: with a spare center-back behind, he can commit fully to a 1v1 without worrying about the space in behind.",
    },
    {
      positions: { RM: [70, 58] },
      ball: 'RM',
      focus: 'RM',
      input: 'Sprint dribble / skill move (RB / R2)',
      caption:
        "Because a back three provides extra cover centrally, the wide man can take risks 1v1 that a back-four fullback couldn't afford to.",
    },
    {
      positions: { RM: [85, 50], CAM: [68, 40] },
      ball: 'RM',
      focus: 'CAM',
      caption: "As he cuts inside, the #10 arrives to offer a passing option in the middle: a natural link between the wide play and the front two.",
    },
    {
      positions: {},
      ball: [68, 40],
      focus: 'CAM',
      input: 'Pass (A / Cross)',
      caption: 'Rather than force a shot from a tight angle, he squares it to the free man centrally.',
    },
    {
      positions: { RST: [92, 44] },
      ball: [92, 44],
      focus: 'RST',
      input: 'Through ball (Y / Triangle)',
      caption: "One touch, straight through: the striker's run was timed the moment the ball went wide.",
    },
    {
      positions: {},
      ball: [105, 40],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'In on goal: finish early before the last man recovers.',
    },
  ],
};

const HALF_SPACE_GIVE_AND_GO: Play = {
  id: 'half-space-give-and-go',
  formation: '3-4-1-2',
  title: 'Half-space give-and-go',
  concept:
    "A #10 who plays a give-and-go with a striker in the half-space and immediately spins beyond him is nearly impossible to track: the defender following the CAM has to choose between the pass and the run, and can't cover both.",
  commonMistake:
    "The #10 standing still after playing the pass, admiring it, instead of immediately continuing his run: the give-and-go only works if the second run happens right away.",
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: {},
      ball: [46, 34],
      focus: 'CAM',
      input: 'Ground pass (A / Cross)',
      caption: 'The ball is played into the #10, operating freely between the lines.',
    },
    {
      positions: { LST: [58, 20] },
      ball: [58, 20],
      focus: 'LST',
      input: 'One-touch pass (A / Cross)',
      caption: 'The striker drifts slightly wide into the half-space, and the #10 finds him first time.',
    },
    {
      positions: { CAM: [75, 32] },
      ball: 'LST',
      focus: 'CAM',
      caption: "The #10 doesn't stop after the pass: he spins in behind immediately, into the space the pass just opened up.",
    },
    {
      positions: { CAM: [92, 30] },
      ball: [92, 30],
      focus: 'CAM',
      input: 'Through ball (Y / Triangle)',
      caption: "Give-and-go: the return pass arrives right as the #10's run does.",
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'CAM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish, arriving through the middle.',
    },
  ],
};

export const PLAYS_3412: Play[] = [WIDE_ISOLATION_WITH_COVER, HALF_SPACE_GIVE_AND_GO];
