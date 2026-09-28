// Lower-third lesson HUD: caption + step chips. Numeral / play title /
// common-mistake stay in the DOM but are hidden by CSS.

import type { Play } from '../data/types';

export interface LessonPanelHandle {
  setStep(index: number): void;
  setComplete(isComplete: boolean): void;
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function showLessonEmpty(container: HTMLElement): void {
  container.innerHTML = `
    <div class="lt-empty">
      <p class="lt-empty-title">Pick a play</p>
      <p class="lt-empty-copy">Open Plays to choose a formation.</p>
    </div>
  `;
}

export function createLessonPanel(
  container: HTMLElement,
  play: Play,
  onStepSelect: (index: number) => void,
): LessonPanelHandle {
  container.innerHTML = `
    <div class="lt">
      <div class="lt-top">
        <div class="lt-num" id="lt-num" aria-hidden="true">01</div>
        <div class="lt-copy" id="lt-copy">
          <p class="lt-play" id="play-title"></p>
          <p class="lt-caption" id="lt-caption"></p>
          <p class="lt-input" id="lt-input" hidden></p>
        </div>
      </div>
      <ol class="lt-film" id="lt-film" aria-label="Steps"></ol>
      <div class="lt-mistake" id="common-mistake" hidden>
        <span class="lt-mistake-label">Common mistake</span>
        <span id="common-mistake-text"></span>
      </div>
    </div>
  `;

  container.querySelector<HTMLElement>('#play-title')!.textContent = play.title;
  container.querySelector<HTMLElement>('#common-mistake-text')!.textContent = play.commonMistake;

  const numEl = container.querySelector<HTMLElement>('#lt-num')!;
  const copyEl = container.querySelector<HTMLElement>('#lt-copy')!;
  const captionEl = container.querySelector<HTMLElement>('#lt-caption')!;
  const inputEl = container.querySelector<HTMLElement>('#lt-input')!;
  const filmEl = container.querySelector<HTMLOListElement>('#lt-film')!;
  const mistakeEl = container.querySelector<HTMLElement>('#common-mistake')!;

  const stepButtons: HTMLButtonElement[] = play.steps.map((step, index) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lt-tick';
    btn.textContent = String(index + 1).padStart(2, '0');
    btn.setAttribute('aria-label', `Step ${index + 1}: ${step.caption}`);
    btn.addEventListener('click', () => onStepSelect(index));
    li.appendChild(btn);
    filmEl.appendChild(li);
    return btn;
  });

  let currentIndex = -1;
  let fadeTimer: number | null = null;

  function paintStep(index: number): void {
    const step = play.steps[index];
    if (!step) return;

    numEl.textContent = String(index + 1).padStart(2, '0');
    captionEl.textContent = step.caption;

    if (step.input) {
      inputEl.hidden = false;
      inputEl.textContent = step.input;
    } else {
      inputEl.hidden = true;
      inputEl.textContent = '';
    }

    stepButtons.forEach((btn, i) => {
      const current = i === index;
      btn.classList.toggle('is-current', current);
      if (current) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
  }

  function setStep(index: number): void {
    const step = play.steps[index];
    if (!step) return;

    if (fadeTimer !== null) {
      window.clearTimeout(fadeTimer);
      fadeTimer = null;
    }

    // First paint or reduced motion: swap immediately.
    if (currentIndex < 0 || currentIndex === index || reducedMotion()) {
      currentIndex = index;
      copyEl.classList.remove('is-fading');
      paintStep(index);
      return;
    }

    currentIndex = index;
    copyEl.classList.add('is-fading');
    fadeTimer = window.setTimeout(() => {
      paintStep(index);
      // Next frame: fade back in.
      requestAnimationFrame(() => {
        copyEl.classList.remove('is-fading');
      });
      fadeTimer = null;
    }, 160);
  }

  function setComplete(isComplete: boolean): void {
    mistakeEl.hidden = !isComplete;
  }

  return { setStep, setComplete };
}
