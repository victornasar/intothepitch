// Starter plays for the 4-2-4.

import { getFormation } from '../formations';
import type { Play } from '../types';

const START = getFormation('4-2-4')!.defaultPositions;

const FOUR_ON_FOUR_OVERLOAD: Play = {
  id: 'four-on-four-overload',
  formation: '4-2-4',
  title: 'Four attackers against a back four',
  concept:
    'Committing four attackers against a back four overloads the defense by simple math: when a winger draws two defenders to himself, one of the other three attackers is guaranteed to be unmarked somewhere in the box.',
  commonMistake: "The winger trying to beat both defenders himself instead of finding the spare man: with four attackers, someone is always free.",
  startPositions: START,
  startBall: 'RCM',
  steps: [
    {
      positions: {},
      ball: [58, 58],
      focus: 'RW',
      input: 'Ground pass (A / Cross)',
      caption: 'With four attackers against their back four, the winger is played in early to attack a lone defender.',
    },
    {
      positions: { RW: [75, 55] },
      ball: 'RW',
      focus: 'RW',
      input: 'Sprint dribble (RB / R2)',
      caption: 'He commits both the fullback and a covering center-back: exactly what four attackers against four defenders is designed to exploit.',
    },
    {
      positions: { RST: [88, 42] },
      ball: 'RW',
      focus: 'RST',
      caption: 'As the second defender steps across to help, the space he leaves centrally is wide open for the near striker.',
    },
    {
      positions: {},
      ball: [88, 42],
      focus: 'RST',
      input: 'Square pass (A / Cross)',
      caption: "He squares it rather than trying to beat two men alone: the spare striker is unmarked because the numbers simply don't add up for the defense.",
    },
    {
      positions: {},
      ball: [105, 38],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: 'An open finish: four attackers against a back four always leaves someone spare.',
    },
  ],
};

const BOTH_WINGERS_CRASH_THE_BOX: Play = {
  id: 'both-wingers-crash-the-box',
  formation: '4-2-4',
  title: 'Both wingers crash the box',
  concept:
    "With two strikers already central, both wingers can afford to cut inside and crash the box together, since the fullbacks provide the width instead: overloading the six-yard box for a cutback or cross.",
  commonMistake:
    'Both fullbacks bombing forward at the same time: with only two central midfielders behind them, that leaves almost nobody to stop a counterattack.',
  startPositions: START,
  steps: [
    {
      positions: { LW: [62, 28] },
      ball: 'LW',
      focus: 'LW',
      input: 'Cut inside (skill move)',
      caption: "The left winger cuts inside toward goal instead of hugging the touchline: with two strikers already central, he doesn't need to stay wide.",
    },
    {
      positions: { LB: [75, 8] },
      ball: 'LW',
      focus: 'LB',
      input: 'Overlap run (L1 + direction)',
      caption: 'The fullback overlaps into the space out wide, since all four forwards are now free to attack centrally.',
    },
    {
      positions: { LB: [95, 6] },
      ball: [95, 6],
      focus: 'LB',
      input: 'Through ball (Y / Triangle)',
      caption: 'He releases the fullback into the space rather than forcing it inside himself.',
    },
    {
      positions: { LB: [103, 6], LST: [92, 26], RST: [95, 38], RW: [90, 50] },
      ball: 'LB',
      focus: 'LB',
      input: 'Sprint to byline (RB / R2)',
      caption: 'With four attackers already committed forward, the box is stacked for the cross.',
    },
    {
      positions: {},
      ball: [95, 36],
      focus: 'RST',
      input: 'Cross (R1 / Cross)',
      caption: "A low cross across the face of goal, through a crowded box: some attacker is bound to reach it first.",
    },
    {
      positions: {},
      ball: [105, 34],
      focus: 'RST',
      input: 'Shoot (B / Circle)',
      caption: "Tap-in from point-blank range: the sheer numbers in the box made the defense's job impossible.",
    },
  ],
};

export const PLAYS_424: Play[] = [FOUR_ON_FOUR_OVERLOAD, BOTH_WINGERS_CRASH_THE_BOX];
