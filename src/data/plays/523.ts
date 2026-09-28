// Starter plays for the 5-2-3.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('5-2-3')!.defaultPositions;

const WING_BACK_OVERLAP_CUT_INSIDE: Play = {
  id: 'wing-back-overlap-cut-inside',
  formation: '5-2-3',
  title: 'Wing-back overlap, winger cuts inside',
  concept:
    "With a spare center-back covering behind, a wing-back can push forward and overlap the winger: the same shape as a fullback overlap, but lower risk because two center-backs are still left once the spare one shifts across to cover.",
  commonMistake:
    "Sending the wing-back forward before checking the spare center-back has actually shifted across: with a back three behind him, if the cover isn't there yet, the space in behind is wide open.",
  startPositions: START,
  steps: [
    {
      positions: { RW: [68, 50] },
      ball: 'RW',
      focus: 'RW',
      input: 'Cut inside (skill move)',
      caption: 'The winger cuts inside onto his stronger foot, dragging his marker with him and opening the line out wide.',
    },
    {
      positions: { RWB: [45, 62] },
      ball: 'RW',
      focus: 'RWB',
      input: 'Overlap / targeted run (L1 + direction)',
      caption:
        'The wing-back overlaps into the space out wide: with a spare center-back behind covering, he can commit forward without exposing the back line.',
    },
    {
      positions: { RWB: [75, 62] },
      ball: [75, 62],
      focus: 'RWB',
      input: 'Through ball (Y / Triangle)',
      caption: 'He slides it into the overlap rather than trying to beat his man again.',
    },
    {
      positions: { RWB: [100, 62], ST: [95, 30], LW: [92, 15] },
      ball: 'RWB',
      focus: 'RWB',
      input: 'Sprint to byline (RB / R2)',
      caption:
        'As he reaches the byline, both the striker and the far winger are already attacking the box: a spare center-back means the whole front three can commit forward.',
    },
    {
      positions: {},
      ball: [95, 30],
      focus: 'ST',
      input: 'Cutback / low cross (A / Cross)',
      caption: 'A low ball across the six-yard box is hardest for a keeper set for a cross: the striker just has to get a touch on it.',
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish at the near post.',
    },
  ],
};

const SWITCH_TO_ISOLATE_FAR_WINGER: Play = {
  id: 'switch-to-isolate-far-winger',
  formation: '5-2-3',
  title: 'Quick switch to isolate the far winger',
  concept:
    "A double pivot in central midfield can move the ball from side to side faster than a back four can shift across: and because a back three's extra defender covers centrally, both wide forwards can commit fully forward once the switch is played.",
  commonMistake:
    'Trying to beat the defender all the way to the byline instead of cutting inside: with two other forwards already filling the box, a central pass often creates a better chance than forcing it wide.',
  startPositions: START,
  startBall: 'LCM',
  steps: [
    {
      positions: {},
      ball: [58, 58],
      focus: 'RW',
      input: 'Long / switch pass (L1 + Square)',
      caption: 'The midfielder switches the play early: the defense is compact on the near side, so the far winger is isolated 1v1.',
    },
    {
      positions: { RW: [75, 55] },
      ball: 'RW',
      focus: 'RW',
      input: 'Sprint dribble (RB / R2)',
      caption: "Facing a lone defender in space, he attacks him directly: with a spare center-back behind, there's no rush to release the ball early.",
    },
    {
      positions: { RW: [88, 45], ST: [92, 28], LW: [85, 18] },
      ball: 'RW',
      focus: 'RW',
      caption: 'He cuts inside toward goal as the other two forwards fill the box: a back three lets all three commit forward at once.',
    },
    {
      positions: {},
      ball: [92, 28],
      focus: 'ST',
      input: 'Pass into space (A / Cross)',
      caption: 'He squares it rather than shooting from a tight angle: the striker has a better chance in the middle.',
    },
    {
      positions: {},
      ball: [105, 28],
      focus: 'ST',
      input: 'Shoot (B / Circle)',
      caption: 'Finished from the middle of the box: a much easier chance than the original wide angle.',
    },
  ],
};

export const PLAYS_523: Play[] = [WING_BACK_OVERLAP_CUT_INSIDE, SWITCH_TO_ISOLATE_FAR_WINGER];
