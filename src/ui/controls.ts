// Transport stays on the pitch. All tunable settings live in an animated
// dialog opened from a gear icon: speed, difficulty, line, and theme.

import type { Animator } from '../engine/animator';
import type { DefensiveLine, Difficulty } from '../logic/defenders';
import { applyTheme, readTheme, type Theme } from './theme';
import {
  iconClose,
  iconMoon,
  iconNext,
  iconPause,
  iconPlay,
  iconPrevious,
  iconRestart,
  iconSettings,
  iconSun,
} from './icons';

export interface ControlsHandle {
  setPlaying(isPlaying: boolean): void;
  setProgress(fraction: number): void;
  destroy(): void;
}

export interface ControlsOptions {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  defensiveLine: DefensiveLine;
  onDefensiveLineChange: (line: DefensiveLine) => void;
}

const SPEEDS = [0.5, 1, 1.5] as const;
const DIFFICULTIES: Array<{ value: Difficulty; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
];
const DEFENSIVE_LINES: Array<{ value: DefensiveLine; label: string }> = [
  { value: 'deep', label: 'Deep' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'high', label: 'High' },
];

function cycleIndex(i: number, len: number): number {
  return (i + 1) % len;
}

export function createControls(container: HTMLElement, animator: Animator, options: ControlsOptions): ControlsHandle {
  let speed = 1;
  let difficulty = options.difficulty;
  let line = options.defensiveLine;
  let theme: Theme = readTheme();
  let closing = false;

  container.innerHTML = `
    <div class="tape">
      <div class="tape-progress" role="presentation">
        <div class="tape-fill" id="progress-fill"></div>
      </div>
      <div class="tape-row">
        <div class="tape-transport" role="group" aria-label="Playback controls">
          <button type="button" class="tape-btn" id="btn-restart" aria-label="Restart"></button>
          <button type="button" class="tape-btn" id="btn-prev" aria-label="Previous step"></button>
          <button type="button" class="tape-btn tape-btn--play" id="btn-play" aria-label="Play"></button>
          <button type="button" class="tape-btn" id="btn-next" aria-label="Next step"></button>
          <button type="button" class="tape-btn tape-btn--settings" id="btn-settings" aria-label="Open settings" aria-haspopup="dialog" aria-expanded="false"></button>
        </div>
      </div>
    </div>
    <dialog class="hud-dialog" id="settings-dialog" aria-labelledby="settings-title">
      <div class="hud-dialog-sheet">
        <header class="hud-dialog-head">
          <div class="hud-dialog-heading">
            <span class="hud-dialog-mark" aria-hidden="true"></span>
            <h2 class="hud-dialog-title" id="settings-title">Settings</h2>
          </div>
          <button type="button" class="hud-dialog-close" id="btn-settings-close" aria-label="Close settings"></button>
        </header>
        <div class="hud-dialog-body">
          <p class="hud-dialog-hint">Tap a row to cycle</p>
          <button type="button" class="hud-cycle-row" id="cycle-speed">
            <span class="hud-cycle-label">Speed</span>
            <span class="hud-cycle-value" id="cycle-speed-value"></span>
          </button>
          <button type="button" class="hud-cycle-row" id="cycle-difficulty">
            <span class="hud-cycle-label">Difficulty</span>
            <span class="hud-cycle-value" id="cycle-difficulty-value"></span>
          </button>
          <button type="button" class="hud-cycle-row" id="cycle-line">
            <span class="hud-cycle-label">Line</span>
            <span class="hud-cycle-value" id="cycle-line-value"></span>
          </button>
          <button type="button" class="hud-cycle-row" id="cycle-theme">
            <span class="hud-cycle-label">Theme</span>
            <span class="hud-cycle-value hud-cycle-value--icon" id="cycle-theme-value"></span>
          </button>
        </div>
      </div>
    </dialog>
  `;

  const progressFill = container.querySelector<HTMLDivElement>('#progress-fill')!;
  const restartBtn = container.querySelector<HTMLButtonElement>('#btn-restart')!;
  const prevBtn = container.querySelector<HTMLButtonElement>('#btn-prev')!;
  const playBtn = container.querySelector<HTMLButtonElement>('#btn-play')!;
  const nextBtn = container.querySelector<HTMLButtonElement>('#btn-next')!;
  const settingsBtn = container.querySelector<HTMLButtonElement>('#btn-settings')!;
  const closeBtn = container.querySelector<HTMLButtonElement>('#btn-settings-close')!;
  const dialog = container.querySelector<HTMLDialogElement>('#settings-dialog')!;
  const dialogMark = container.querySelector<HTMLSpanElement>('.hud-dialog-mark')!;
  const speedRow = container.querySelector<HTMLButtonElement>('#cycle-speed')!;
  const difficultyRow = container.querySelector<HTMLButtonElement>('#cycle-difficulty')!;
  const lineRow = container.querySelector<HTMLButtonElement>('#cycle-line')!;
  const themeRow = container.querySelector<HTMLButtonElement>('#cycle-theme')!;
  const speedValue = container.querySelector<HTMLSpanElement>('#cycle-speed-value')!;
  const difficultyValue = container.querySelector<HTMLSpanElement>('#cycle-difficulty-value')!;
  const lineValue = container.querySelector<HTMLSpanElement>('#cycle-line-value')!;
  const themeValue = container.querySelector<HTMLSpanElement>('#cycle-theme-value')!;

  restartBtn.appendChild(iconRestart());
  prevBtn.appendChild(iconPrevious());
  nextBtn.appendChild(iconNext());
  playBtn.appendChild(iconPlay());
  settingsBtn.appendChild(iconSettings());
  closeBtn.appendChild(iconClose());
  dialogMark.appendChild(iconSettings());

  function paintSpeed(): void {
    speedValue.textContent = `${speed}x`;
  }
  function paintDifficulty(): void {
    difficultyValue.textContent = DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? difficulty;
  }
  function paintLine(): void {
    lineValue.textContent = DEFENSIVE_LINES.find((d) => d.value === line)?.label ?? line;
  }
  function paintTheme(): void {
    themeValue.replaceChildren();
    const icon = theme === 'night' ? iconMoon() : iconSun();
    const label = document.createElement('span');
    label.textContent = theme === 'night' ? 'Dark' : 'Light';
    themeValue.append(icon, label);
  }

  paintSpeed();
  paintDifficulty();
  paintLine();
  paintTheme();

  speedRow.addEventListener('click', () => {
    const i = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    speed = SPEEDS[cycleIndex(i < 0 ? 1 : i, SPEEDS.length)];
    animator.setSpeed(speed);
    paintSpeed();
  });

  difficultyRow.addEventListener('click', () => {
    const i = DIFFICULTIES.findIndex((d) => d.value === difficulty);
    difficulty = DIFFICULTIES[cycleIndex(i < 0 ? 1 : i, DIFFICULTIES.length)].value;
    options.onDifficultyChange(difficulty);
    paintDifficulty();
  });

  lineRow.addEventListener('click', () => {
    const i = DEFENSIVE_LINES.findIndex((d) => d.value === line);
    line = DEFENSIVE_LINES[cycleIndex(i < 0 ? 1 : i, DEFENSIVE_LINES.length)].value;
    options.onDefensiveLineChange(line);
    paintLine();
  });

  themeRow.addEventListener('click', () => {
    theme = theme === 'night' ? 'day' : 'night';
    applyTheme(theme);
    paintTheme();
  });

  function openSettings(): void {
    if (dialog.open || closing) return;
    dialog.classList.remove('is-closing');
    dialog.showModal();
    // Next frame so CSS can transition from starting style.
    requestAnimationFrame(() => {
      dialog.classList.add('is-open');
    });
    settingsBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSettings(): void {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    settingsBtn.setAttribute('aria-expanded', 'false');

    const finish = () => {
      dialog.removeEventListener('transitionend', onEnd);
      dialog.classList.remove('is-closing');
      if (dialog.open) dialog.close();
      closing = false;
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== dialog) return;
      finish();
    };
    dialog.addEventListener('transitionend', onEnd);
    window.setTimeout(finish, 280);
  }

  settingsBtn.addEventListener('click', () => {
    if (dialog.open) closeSettings();
    else openSettings();
  });
  closeBtn.addEventListener('click', () => closeSettings());

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSettings();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeSettings();
  });

  function setPlaying(isPlaying: boolean): void {
    playBtn.textContent = '';
    playBtn.appendChild(isPlaying ? iconPause() : iconPlay());
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  function setProgress(fraction: number): void {
    progressFill.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
  }

  playBtn.addEventListener('click', () => {
    if (animator.isPlaying) animator.pause();
    else animator.play();
    setPlaying(animator.isPlaying);
  });
  prevBtn.addEventListener('click', () => {
    animator.previousStep();
    setPlaying(false);
  });
  nextBtn.addEventListener('click', () => {
    animator.nextStep();
    setPlaying(animator.isPlaying);
  });
  restartBtn.addEventListener('click', () => {
    animator.restart();
    setPlaying(false);
  });

  function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;
    return target.isContentEditable;
  }

  function onKeydown(event: KeyboardEvent): void {
    if (isEditableTarget(event.target)) return;
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      closeSettings();
      return;
    }
    switch (event.key) {
      case ' ':
        if (event.target instanceof HTMLButtonElement) return;
        event.preventDefault();
        playBtn.click();
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextBtn.click();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        prevBtn.click();
        break;
      case 'r':
      case 'R':
        restartBtn.click();
        break;
    }
  }
  window.addEventListener('keydown', onKeydown);

  return {
    setPlaying,
    setProgress,
    destroy() {
      window.removeEventListener('keydown', onKeydown);
      if (dialog.open) dialog.close();
    },
  };
}
