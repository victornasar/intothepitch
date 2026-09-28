// Default starting shapes for each formation we support. Individual plays
// (see data/plays/) can and do start from these positions, then move
// players around; this file only holds the "at rest" shape shown before a
// play is picked, and used to size up the nav.

import type { FormationId, Point, PlayerId } from './types';

export type Formation = {
  id: FormationId;
  label: string;
  /** Where each player lines up before a play begins, attacking left to right. */
  defaultPositions: Record<PlayerId, Point>;
};

const FOUR_THREE_THREE: Formation = {
  id: '4-3-3',
  label: '4-3-3',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 8],
    LCB: [14, 26],
    RCB: [14, 42],
    RB: [20, 60],
    CDM: [30, 34],
    LCM: [38, 20],
    RCM: [38, 48],
    LW: [55, 8],
    ST: [55, 34],
    RW: [55, 60],
  },
};

const FOUR_TWO_THREE_ONE: Formation = {
  id: '4-2-3-1',
  label: '4-2-3-1',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LDM: [28, 26],
    RDM: [28, 42],
    CAM: [45, 34],
    LW: [58, 10],
    RW: [58, 58],
    ST: [60, 34],
  },
};

const FOUR_FOUR_TWO: Formation = {
  id: '4-4-2',
  label: '4-4-2',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 8],
    LCB: [14, 26],
    RCB: [14, 42],
    RB: [20, 60],
    LM: [40, 8],
    LCM: [35, 26],
    RCM: [35, 42],
    RM: [40, 60],
    LST: [55, 26],
    RST: [55, 42],
  },
};

const THREE_FIVE_TWO: Formation = {
  id: '3-5-2',
  label: '3-5-2',
  defaultPositions: {
    GK: [5, 34],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    LWB: [30, 6],
    LCM: [35, 24],
    CM: [30, 34],
    RCM: [35, 44],
    RWB: [30, 62],
    LST: [55, 26],
    RST: [55, 42],
  },
};

const FOUR_TWO_ONE_THREE: Formation = {
  id: '4-2-1-3',
  label: '4-2-1-3',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LDM: [26, 26],
    RDM: [26, 42],
    CAM: [42, 34],
    LW: [60, 10],
    ST: [62, 34],
    RW: [60, 58],
  },
};

const FOUR_FOUR_ONE_ONE: Formation = {
  id: '4-4-1-1',
  label: '4-4-1-1',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 8],
    LCB: [14, 26],
    RCB: [14, 42],
    RB: [20, 60],
    LM: [38, 8],
    LCM: [35, 26],
    RCM: [35, 42],
    RM: [38, 60],
    CF: [52, 34],
    ST: [62, 34],
  },
};

const FOUR_ONE_TWO_ONE_TWO: Formation = {
  id: '4-1-2-1-2',
  label: '4-1-2-1-2',
  defaultPositions: {
    GK: [5, 34],
    LB: [18, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [18, 58],
    CDM: [26, 34],
    LCM: [36, 22],
    RCM: [36, 46],
    CAM: [48, 34],
    LST: [60, 26],
    RST: [60, 42],
  },
};

const FOUR_THREE_ONE_TWO: Formation = {
  id: '4-3-1-2',
  label: '4-3-1-2',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LCM: [32, 20],
    CM: [30, 34],
    RCM: [32, 48],
    CAM: [48, 34],
    LST: [60, 26],
    RST: [60, 42],
  },
};

const FOUR_ONE_FOUR_ONE: Formation = {
  id: '4-1-4-1',
  label: '4-1-4-1',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    CDM: [26, 34],
    LM: [42, 8],
    LCM: [40, 26],
    RCM: [40, 42],
    RM: [42, 60],
    ST: [60, 34],
  },
};

const FOUR_FIVE_ONE: Formation = {
  id: '4-5-1',
  label: '4-5-1',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LM: [38, 6],
    LCM: [36, 22],
    CM: [34, 34],
    RCM: [36, 46],
    RM: [38, 62],
    ST: [60, 34],
  },
};

const FOUR_THREE_TWO_ONE: Formation = {
  id: '4-3-2-1',
  label: '4-3-2-1',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LCM: [32, 20],
    CM: [30, 34],
    RCM: [32, 48],
    LCF: [50, 26],
    RCF: [50, 42],
    ST: [65, 34],
  },
};

const FOUR_TWO_TWO_TWO: Formation = {
  id: '4-2-2-2',
  label: '4-2-2-2',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LDM: [28, 26],
    RDM: [28, 42],
    LAM: [48, 14],
    RAM: [48, 54],
    LST: [62, 26],
    RST: [62, 42],
  },
};

const THREE_FOUR_TWO_ONE: Formation = {
  id: '3-4-2-1',
  label: '3-4-2-1',
  defaultPositions: {
    GK: [5, 34],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    LM: [32, 8],
    LCM: [30, 26],
    RCM: [30, 42],
    RM: [32, 60],
    LCF: [52, 26],
    RCF: [52, 42],
    ST: [65, 34],
  },
};

const FOUR_TWO_FOUR: Formation = {
  id: '4-2-4',
  label: '4-2-4',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    LCM: [32, 26],
    RCM: [32, 42],
    LW: [58, 10],
    LST: [60, 28],
    RST: [60, 40],
    RW: [58, 58],
  },
};

const FOUR_ONE_THREE_TWO: Formation = {
  id: '4-1-3-2',
  label: '4-1-3-2',
  defaultPositions: {
    GK: [5, 34],
    LB: [20, 10],
    LCB: [12, 26],
    RCB: [12, 42],
    RB: [20, 58],
    CDM: [26, 34],
    LCM: [42, 20],
    CM: [40, 34],
    RCM: [42, 48],
    LST: [60, 26],
    RST: [60, 42],
  },
};

const FIVE_TWO_ONE_TWO: Formation = {
  id: '5-2-1-2',
  label: '5-2-1-2',
  defaultPositions: {
    GK: [5, 34],
    LWB: [22, 6],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    RWB: [22, 62],
    LCM: [32, 26],
    RCM: [32, 42],
    CAM: [46, 34],
    LST: [60, 26],
    RST: [60, 42],
  },
};

const THREE_FOUR_ONE_TWO: Formation = {
  id: '3-4-1-2',
  label: '3-4-1-2',
  defaultPositions: {
    GK: [5, 34],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    LM: [32, 8],
    LCM: [30, 26],
    RCM: [30, 42],
    RM: [32, 60],
    CAM: [46, 34],
    LST: [60, 26],
    RST: [60, 42],
  },
};

const FIVE_THREE_TWO: Formation = {
  id: '5-3-2',
  label: '5-3-2',
  defaultPositions: {
    GK: [5, 34],
    LWB: [22, 6],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    RWB: [22, 62],
    LCM: [35, 24],
    CM: [32, 34],
    RCM: [35, 44],
    LST: [58, 26],
    RST: [58, 42],
  },
};

const FIVE_TWO_THREE: Formation = {
  id: '5-2-3',
  label: '5-2-3',
  defaultPositions: {
    GK: [5, 34],
    LWB: [22, 6],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    RWB: [22, 62],
    LCM: [34, 26],
    RCM: [34, 42],
    LW: [58, 10],
    ST: [60, 34],
    RW: [58, 58],
  },
};

const FIVE_FOUR_ONE: Formation = {
  id: '5-4-1',
  label: '5-4-1',
  defaultPositions: {
    GK: [5, 34],
    LWB: [22, 6],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    RWB: [22, 62],
    LM: [42, 10],
    LCM: [38, 26],
    RCM: [38, 42],
    RM: [42, 58],
    ST: [62, 34],
  },
};

const THREE_FOUR_THREE: Formation = {
  id: '3-4-3',
  label: '3-4-3',
  defaultPositions: {
    GK: [5, 34],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    LM: [32, 8],
    LCM: [30, 26],
    RCM: [30, 42],
    RM: [32, 60],
    LW: [58, 10],
    ST: [60, 34],
    RW: [58, 58],
  },
};

const THREE_ONE_FOUR_TWO: Formation = {
  id: '3-1-4-2',
  label: '3-1-4-2',
  defaultPositions: {
    GK: [5, 34],
    LCB: [14, 20],
    CB: [10, 34],
    RCB: [14, 48],
    CDM: [26, 34],
    LM: [42, 8],
    LCM: [40, 26],
    RCM: [40, 42],
    RM: [42, 60],
    LST: [60, 26],
    RST: [60, 42],
  },
};

export const FORMATIONS: Formation[] = [
  // Back four
  FOUR_THREE_THREE,
  FOUR_TWO_THREE_ONE,
  FOUR_TWO_ONE_THREE,
  FOUR_FOUR_TWO,
  FOUR_FOUR_ONE_ONE,
  FOUR_THREE_ONE_TWO,
  FOUR_THREE_TWO_ONE,
  FOUR_ONE_TWO_ONE_TWO,
  FOUR_ONE_FOUR_ONE,
  FOUR_ONE_THREE_TWO,
  FOUR_TWO_TWO_TWO,
  FOUR_TWO_FOUR,
  FOUR_FIVE_ONE,
  // Back three
  THREE_FIVE_TWO,
  THREE_FOUR_THREE,
  THREE_FOUR_TWO_ONE,
  THREE_FOUR_ONE_TWO,
  THREE_ONE_FOUR_TWO,
  // Back five
  FIVE_TWO_ONE_TWO,
  FIVE_THREE_TWO,
  FIVE_TWO_THREE,
  FIVE_FOUR_ONE,
];

/** Groups for the formation picker (back-line families). */
export const FORMATION_GROUPS: Array<{ label: string; ids: FormationId[] }> = [
  {
    label: 'Back four',
    ids: [
      '4-3-3',
      '4-2-3-1',
      '4-2-1-3',
      '4-4-2',
      '4-4-1-1',
      '4-3-1-2',
      '4-3-2-1',
      '4-1-2-1-2',
      '4-1-4-1',
      '4-1-3-2',
      '4-2-2-2',
      '4-2-4',
      '4-5-1',
    ],
  },
  {
    label: 'Back three',
    ids: ['3-5-2', '3-4-3', '3-4-2-1', '3-4-1-2', '3-1-4-2'],
  },
  {
    label: 'Back five',
    ids: ['5-2-1-2', '5-3-2', '5-2-3', '5-4-1'],
  },
];

export function getFormation(id: FormationId): Formation | undefined {
  return FORMATIONS.find((f) => f.id === id);
}
