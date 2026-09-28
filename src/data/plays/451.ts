// Starter plays for the 4-5-1.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-5-1')!.defaultPositions;

const WIDE_COMBINATION_LATE_RUN: Play = {
  id: 'wide-combination-late-run',
  formation: '4-5-1',
  title: 'Wide combination and late run',
  concept:
    "Without a winger high and wide, a 4-5-1 creates width through combination play: a give-and-go down the side frees the wide midfielder, and while everyone watches him, a central midfielder arrives late and unmarked for the finish.",
  commonMistake:
    'Crossing early instead of squaring the ball: an early cross into a stacked box is easy to defend; a pass along the ground to a late, unmarked runner usually isn\'t.',
  startPositions: START,
  steps: [
    {
      positions: { RM: [48, 58] },
      ball: 'RM',
      focus: 'RM',
      input: 'Dribble (left stick)',
      caption: 'The right mid drifts inside off the touchline, drawing his marker with him.',
    },
    {
      positions: { RCM: [52, 52] },
      ball: [52, 52],
      focus: 'RCM',
      input: 'Ground pass (A / Cross)',
      caption: 'A quick pass inside to the nearest central midfielder starts the combination.',
    },
    {
      positions: { RM: [68, 60] },
      ball: [68, 60],
      focus: 'RM',
      input: 'One-touch return pass (A / Cross)',
      caption: "The give-and-go sends the winger straight back into the space he just left: his marker is still following the ball, not the run.",
    },
    {
      positions: { RM: [85, 58], CM: [75, 40] },
      ball: 'RM',
      focus: 'CM',
      caption: "As the winger drives on, the central midfielder times a late run beyond him into the box: the run nobody's tracking because everyone's watching the ball out wide.",
    },
    {
      positions: {},
      ball: [88, 40],
      focus: 'CM',
      input: 'Cutback / square pass (A / Cross)',
      caption: "Rather than cross early, he squares it into the run: the defense is set for a cross, not a pass along the ground.",
    },
    {
      positions: {},
      ball: [105, 36],
      focus: 'CM',
      input: 'Shoot (B / Circle)',
      caption: 'First-time finish from the edge of the box, arriving late and unmarked.',
    },
  ],
};

const FULLBACK_OVERLAPS_WIDE_MID: Play = {
  id: 'fullback-overlaps-wide-mid',
  formation: '4-5-1',
  title: 'Fullback overlaps the wide midfielder',
  concept:
    'In a 4-5-1, wide midfielders often tuck inside, so the actual width comes from the overlapping fullback: and because the midfield has five bodies, extra runners can still get forward to attack the cross.',
  commonMistake:
    'The fullback overlapping without anyone covering behind him: make sure a holding midfielder tucks in before committing the fullback fully forward.',
  startPositions: START,
  steps: [
    {
      positions: { LM: [50, 20] },
      ball: 'LM',
      focus: 'LM',
      input: 'Cut inside (skill move)',
      caption: 'The wide midfielder drifts inside, as he often does in a 4-5-1: leaving the flank open behind him.',
    },
    {
      positions: { LB: [62, 8] },
      ball: 'LM',
      focus: 'LB',
      input: 'Overlap run (L1 + direction)',
      caption: 'The fullback overlaps into the space out wide: the space the wide midfielder just vacated.',
    },
    {
      positions: { LB: [85, 6] },
      ball: [85, 6],
      focus: 'LB',
      input: 'Through ball (Y / Triangle)',
      caption: 'Rather than force it inside, he releases the fullback into the space behind.',
    },
    {
      positions: { LB: [102, 6], ST: [92, 30], LCM: [88, 40] },
      ball: 'LB',
      focus: 'LB',
      input: 'Sprint to byline (RB / R2)',
      caption: 'With five in midfield, the team can afford to throw extra bodies into the box for the cross.',
    },
    {
      positions: {},
      ball: [92, 28],
      focus: 'ST',
      input: 'Cross (R1 / Cross)',
      caption: 'A driven cross to the near post, where the striker is already arriving.',
    },
    {
      positions: {},
      ball: [105, 30],
      focus: 'ST',
      input: 'Shoot / Header (B / Circle)',
      caption: 'Near-post header before the defense can react.',
    },
  ],
};

export const PLAYS_451: Play[] = [WIDE_COMBINATION_LATE_RUN, FULLBACK_OVERLAPS_WIDE_MID];
