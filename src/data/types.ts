// Core data model for the lesson system.
// Coordinates are in real pitch meters. The attacking team always attacks
// left to right, with (0, 0) at the top-left corner of the pitch.

/** Standard full-size pitch dimensions in meters (length x width). */
export const PITCH_LENGTH = 105;
export const PITCH_WIDTH = 68;

/** A point on the pitch, in meters: [x, y]. */
export type Point = [number, number];

/**
 * Identifies a single on-ball or off-ball player slot, e.g. "LB", "ST".
 * The same id is reused across formations to keep play data simple.
 */
export type PlayerId = string;

/**
 * The formations we teach plays for: every distinct player-position
 * skeleton available in EA FC 27's formation picker. Mentality-only
 * variants of the same skeleton (e.g. 4-3-3 Attack / Defend / Holding, or
 * 4-2-3-1 Wide) are deliberately not separate entries here: they don't
 * change the attacking patterns being taught, just a defensive setting.
 */
export type FormationId =
  | '4-3-3'
  | '4-2-3-1'
  | '4-4-2'
  | '3-5-2'
  | '4-2-1-3'
  | '4-4-1-1'
  | '4-1-2-1-2'
  | '4-3-1-2'
  | '4-1-4-1'
  | '4-5-1'
  | '4-3-2-1'
  | '4-2-2-2'
  | '3-4-2-1'
  | '4-2-4'
  | '4-1-3-2'
  | '5-2-1-2'
  | '3-4-1-2'
  | '5-3-2'
  | '5-2-3'
  | '5-4-1'
  | '3-4-3'
  | '3-1-4-2';

/**
 * One beat of a play. Animating a step means interpolating every player
 * (and the ball) from their position at the end of the previous step to
 * their position at the end of this one. Players not listed keep whatever
 * position they last held.
 */
export type Step = {
  /** Only the players who move during this step. */
  positions: Partial<Record<PlayerId, Point>>;
  /** Ball location: tracking a player, or a fixed point (e.g. a shot on goal). */
  ball: PlayerId | Point;
  /** Plain-language explanation of what's happening and why it works. */
  caption: string;
  /** Controller input shown to the learner, e.g. "Through ball (Y / Triangle)". */
  input?: string;
  /** The one player the learner should watch this step. */
  focus?: PlayerId;
};

/** A single teachable attacking pattern within a formation. */
export type Play = {
  id: string;
  formation: FormationId;
  title: string;
  concept: string;
  commonMistake: string;
  startPositions: Record<PlayerId, Point>;
  /**
   * Where the ball sits before step 0 happens. Required whenever step 0's
   * `ball` is a fixed Point (a pass or shot) rather than a PlayerId : 
   * without it, there's no way to know who actually has the ball at
   * kickoff, and the ball would incorrectly appear to start already at the
   * pass's destination. Not needed when step 0's `ball` is a PlayerId
   * (e.g. a dribble): that player's own start position is already correct.
   */
  startBall?: PlayerId | Point;
  steps: Step[];
};
