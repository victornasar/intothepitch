import './styles.css';
import { createPitch } from './render/pitch';
import { createLogomark } from './render/logo';
import { createPlayerLayer } from './render/players';
import { createLineLayer } from './render/lines';
import { Animator } from './engine/animator';
import { createControls, type ControlsHandle } from './ui/controls';
import { createLessonPanel, showLessonEmpty, type LessonPanelHandle } from './ui/lessonPanel';
import { createNav } from './ui/nav';
import { applyTheme, readTheme } from './ui/theme';
import { FORMATIONS } from './data/formations';
import { PLAYS_433 } from './data/plays/433';
import { PLAYS_4231 } from './data/plays/4231';
import { PLAYS_442 } from './data/plays/442';
import { PLAYS_352 } from './data/plays/352';
import { PLAYS_4213 } from './data/plays/4213';
import { PLAYS_4411 } from './data/plays/4411';
import { PLAYS_41212 } from './data/plays/41212';
import { PLAYS_4312 } from './data/plays/4312';
import { PLAYS_4141 } from './data/plays/4141';
import { PLAYS_451 } from './data/plays/451';
import { PLAYS_4321 } from './data/plays/4321';
import { PLAYS_4222 } from './data/plays/4222';
import { PLAYS_3421 } from './data/plays/3421';
import { PLAYS_424 } from './data/plays/424';
import { PLAYS_4132 } from './data/plays/4132';
import { PLAYS_5212 } from './data/plays/5212';
import { PLAYS_3412 } from './data/plays/3412';
import { PLAYS_532 } from './data/plays/532';
import { PLAYS_523 } from './data/plays/523';
import { PLAYS_541 } from './data/plays/541';
import { PLAYS_343 } from './data/plays/343';
import { PLAYS_3142 } from './data/plays/3142';
import { createDefenderAI, type DefensiveLine, type Difficulty } from './logic/defenders';
import { createAttackSupportAI } from './logic/attackSupport';
import { withBuildUp } from './logic/buildUp';
import type { Play, Point } from './data/types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root element');

applyTheme(readTheme());

app.innerHTML = `
  <div class="desktop-gate" role="dialog" aria-modal="true" aria-labelledby="desktop-gate-title">
    <div class="desktop-gate-bg" aria-hidden="true"></div>
    <div class="desktop-gate-inner">
      <p class="desktop-gate-brand">Into the Pitch</p>
      <h1 class="desktop-gate-title" id="desktop-gate-title">Best on a bigger screen</h1>
      <p class="desktop-gate-copy">
        This is a pitch-first coaching tool built for desktop. Open it on a laptop or monitor to run the lessons.
      </p>
    </div>
  </div>

  <div class="cam">
    <a class="skip-link" href="#pitch-frame">Skip to pitch</a>

    <div class="pitch-canvas" id="pitch-frame">
      <p class="pitch-loading">Lining up</p>
    </div>

    <div class="hud">
      <div class="hud-left">
        <header class="hud-bug">
          <div class="hud-brand" id="brand"></div>
          <div class="hud-bug-actions">
            <button
              type="button"
              class="hud-menu"
              id="menu-toggle"
              aria-expanded="false"
              aria-controls="nav"
            >
              Plays
            </button>
          </div>
        </header>
        <aside class="hud-rail" id="nav" aria-label="Formation and play"></aside>
      </div>

      <section class="lower-third" aria-label="Lesson">
        <div class="lower-third-body" id="lesson-panel"></div>
        <div class="lower-third-transport" id="controls"></div>
      </section>
    </div>
  </div>
`;

const brand = document.querySelector<HTMLDivElement>('#brand')!;
brand.appendChild(createLogomark(22));
const brandText = document.createElement('div');
brandText.className = 'hud-brand-text';
brandText.innerHTML = `
  <h1 class="hud-wordmark">Into the Pitch</h1>
  <p class="hud-tag">Learn to attack</p>
`;
brand.appendChild(brandText);

const cam = document.querySelector<HTMLDivElement>('.cam')!;
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')!;
menuToggle.addEventListener('click', () => {
  const open = !cam.classList.contains('is-menu-open');
  cam.classList.toggle('is-menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Plays';
});

const pitchFrame = document.querySelector<HTMLDivElement>('#pitch-frame')!;
const controlsContainer = document.querySelector<HTMLDivElement>('#controls')!;
const lessonPanelContainer = document.querySelector<HTMLDivElement>('#lesson-panel')!;
const navContainer = document.querySelector<HTMLDivElement>('#nav')!;

showLessonEmpty(lessonPanelContainer);

const svg = createPitch(pitchFrame);
const players = createPlayerLayer(svg);
const lines = createLineLayer(svg);

let difficulty: Difficulty = 'normal';
let defensiveLine: DefensiveLine = 'balanced';
const defenderAI = createDefenderAI(difficulty, defensiveLine);
const attackSupport = createAttackSupportAI();

const playsByFormation: Record<string, Play[]> = {
  '4-3-3': PLAYS_433,
  '4-2-3-1': PLAYS_4231,
  '4-4-2': PLAYS_442,
  '3-5-2': PLAYS_352,
  '4-2-1-3': PLAYS_4213,
  '4-4-1-1': PLAYS_4411,
  '4-1-2-1-2': PLAYS_41212,
  '4-3-1-2': PLAYS_4312,
  '4-1-4-1': PLAYS_4141,
  '4-5-1': PLAYS_451,
  '4-3-2-1': PLAYS_4321,
  '4-2-2-2': PLAYS_4222,
  '3-4-2-1': PLAYS_3421,
  '4-2-4': PLAYS_424,
  '4-1-3-2': PLAYS_4132,
  '5-2-1-2': PLAYS_5212,
  '3-4-1-2': PLAYS_3412,
  '5-3-2': PLAYS_532,
  '5-2-3': PLAYS_523,
  '5-4-1': PLAYS_541,
  '3-4-3': PLAYS_343,
  '3-1-4-2': PLAYS_3142,
};

let currentPlay: Play | null = null;
let animator: Animator | null = null;
let controlsHandle: ControlsHandle | null = null;
let lessonPanelHandle: LessonPanelHandle | null = null;
/** Wall-clock idle clock — only advances while playback is running. */
let ambientMs = 0;

/** Kickoff ball point for a play (matches Animator.resolveStates initial ball). */
function playKickoffBall(play: Play): Point {
  const players = play.startPositions;
  if (play.startBall !== undefined) {
    return typeof play.startBall === 'string' ? players[play.startBall] : play.startBall;
  }
  if (players.GK) return players.GK;
  const first = play.steps[0];
  if (first) {
    return typeof first.ball === 'string' ? players[first.ball] : first.ball;
  }
  return Object.values(players)[0] as Point;
}

function renderFrame(instant: boolean, dtMs: number): void {
  if (!animator || !currentPlay) return;
  const frame = animator.getFrameState();
  const step = currentPlay.steps[animator.currentStepIndex];
  const movingIds = new Set(Object.keys(step?.positions ?? {}));
  // Carrier holding the ball is locked for support — leave them to the script.
  if (typeof step?.ball === 'string') movingIds.add(step.ball);
  const idleIds = new Set(Object.keys(frame.players).filter((id) => !movingIds.has(id)));

  // Motion only while the timeline is playing — paused freezes the frame.
  const playing = animator.isPlaying && dtMs > 0;
  if (playing) ambientMs += dtMs;

  const attackPositions = instant
    ? attackSupport.snap(frame.ball, frame.players, movingIds)
    : attackSupport.update(frame.ball, frame.players, movingIds, dtMs);

  players.updateAttackers(attackPositions, {
    focusId: step?.focus,
    idleTimeMs: ambientMs,
    idleIds: playing ? idleIds : undefined,
  });
  const defenderPositions = instant
    ? defenderAI.snap(frame.ball, attackPositions)
    : defenderAI.update(frame.ball, attackPositions, dtMs);
  players.updateDefenders(defenderPositions);
  players.updateBall(frame.ball);

  // Pass arrow spans the live distance between passer and receiver every frame.
  const arrows = animator.getStepArrows();
  const ball = arrows.ballPath;
  if (ball) {
    const fromPt = (ball.fromId && attackPositions[ball.fromId]) || ball.from;
    const toPt = (ball.toId && attackPositions[ball.toId]) || ball.to;
    lines.syncBallArrow(fromPt, toPt);
  } else {
    lines.syncBallArrow(null, null);
  }
}

function loadPlay(rawPlay: Play): void {
  // Every lesson opens from the GK with a short build-up chain, then the
  // authored teaching steps — no mid-pitch vacuum kickoffs.
  const play = withBuildUp(rawPlay);
  currentPlay = play;
  controlsHandle?.destroy();
  players.reset();
  ambientMs = 0;
  attackSupport.reset(play.startPositions, playKickoffBall(play));

  animator = new Animator(play, {
    onStepChange(stepIndex) {
      lessonPanelHandle?.setStep(stepIndex);
      lessonPanelHandle?.setComplete(false);
      if (animator) lines.setStep(animator.getStepArrows());
    },
    onProgress(stepIndex, progress, meta) {
      // Restart / jump-to-start / previous-to-start: reseed support from formation
      // so hold-ground can't keep the advanced vertical column.
      if (meta.instant && stepIndex === 0 && progress === 0 && currentPlay) {
        attackSupport.reset(currentPlay.startPositions, playKickoffBall(currentPlay));
        ambientMs = 0;
      }
      renderFrame(meta.instant, meta.dtMs);
      lines.setProgress(progress);
      if (animator) {
        controlsHandle?.setProgress((stepIndex + progress) / animator.totalSteps);
      }
    },
    onComplete() {
      lessonPanelHandle?.setComplete(true);
      controlsHandle?.setPlaying(false);
    },
  });

  lessonPanelHandle = createLessonPanel(lessonPanelContainer, play, (index) => {
    animator?.jumpToStep(index);
  });
  lessonPanelHandle.setStep(0);
  lessonPanelHandle.setComplete(false);

  controlsHandle = createControls(controlsContainer, animator, {
    difficulty,
    onDifficultyChange(next) {
      difficulty = next;
      defenderAI.setDifficulty(next);
    },
    defensiveLine,
    onDefensiveLineChange(next) {
      defensiveLine = next;
      defenderAI.setDefensiveLine(next);
    },
  });
  controlsHandle.setPlaying(false);
  controlsHandle.setProgress(0);

  lines.setStep(animator.getStepArrows());
  lines.setProgress(0);
  renderFrame(true, 0);
}

createNav(navContainer, FORMATIONS, playsByFormation, (play) => {
  cam.classList.remove('is-menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Plays';
  loadPlay(play);
}, () => {
  controlsHandle?.destroy();
  controlsHandle = null;
  controlsContainer.replaceChildren();
  showLessonEmpty(lessonPanelContainer);
});
