// Left-rail formation + play picker for the broadcast HUD. Still owns the
// URL hash so deep links and back/forward keep working.

import type { Formation } from '../data/formations';
import { FORMATION_GROUPS } from '../data/formations';
import type { FormationId, Play } from '../data/types';

function formationIdToHashSegment(id: FormationId): string {
  return id.replace(/-/g, '');
}

function hashSegmentToFormationId(segment: string, formations: Formation[]): FormationId | undefined {
  return formations.find((f) => formationIdToHashSegment(f.id) === segment)?.id;
}

function parseHash(formations: Formation[]): { formationId: FormationId; playId: string } | null {
  const raw = location.hash.replace(/^#/, '');
  const [segment, playId] = raw.split('/');
  const formationId = segment ? hashSegmentToFormationId(segment, formations) : undefined;
  if (!formationId || !playId) return null;
  return { formationId, playId };
}

function writeHash(formationId: FormationId, playId: string): void {
  const next = `#${formationIdToHashSegment(formationId)}/${playId}`;
  if (location.hash !== next) history.pushState(null, '', next);
}

export function createNav(
  container: HTMLElement,
  formations: Formation[],
  playsByFormation: Record<string, Play[]>,
  onSelectPlay: (play: Play) => void,
  onNoPlays?: () => void,
): void {
  container.innerHTML = `
    <p class="hash-error" id="hash-error" hidden role="alert"></p>
    <nav class="rail">
      <label class="rail-field">
        <span class="rail-label">Formation</span>
        <select class="rail-select" id="formation-select" aria-label="Formation"></select>
      </label>
      <div class="rail-plays-wrap">
        <span class="rail-label">Play</span>
        <div class="rail-plays" id="nav-plays" role="group" aria-label="Play"></div>
      </div>
    </nav>
  `;
  const hashError = container.querySelector<HTMLParagraphElement>('#hash-error')!;
  const formationSelect = container.querySelector<HTMLSelectElement>('#formation-select')!;
  const playsEl = container.querySelector<HTMLDivElement>('#nav-plays')!;

  let activeFormationId: FormationId = formations[0].id;
  let activePlayId: string | null = null;

  function findPlay(formationId: FormationId, playId: string): Play | undefined {
    return playsByFormation[formationId]?.find((play) => play.id === playId);
  }

  function hideHashError(): void {
    hashError.hidden = true;
    hashError.textContent = '';
  }

  function showHashError(): void {
    hashError.hidden = false;
    hashError.textContent = 'That link does not match a play. Pick one from the rail.';
  }

  function renderFormationSelect(): void {
    const expectedOptions = formations.length;
    if (formationSelect.querySelectorAll('option').length !== expectedOptions) {
      formationSelect.textContent = '';
      const byId = new Map(formations.map((f) => [f.id, f]));
      for (const group of FORMATION_GROUPS) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;
        for (const id of group.ids) {
          const formation = byId.get(id);
          if (!formation) continue;
          const option = document.createElement('option');
          option.value = formation.id;
          option.textContent = formation.label;
          optgroup.appendChild(option);
        }
        if (optgroup.childElementCount > 0) formationSelect.appendChild(optgroup);
      }
    }
    formationSelect.value = activeFormationId;
  }

  function renderPlayButtons(): void {
    playsEl.textContent = '';
    const plays = playsByFormation[activeFormationId] ?? [];
    if (plays.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'rail-empty';
      empty.textContent = 'No patterns written yet.';
      playsEl.appendChild(empty);
      return;
    }
    for (const play of plays) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rail-play' + (play.id === activePlayId ? ' is-active' : '');
      btn.textContent = play.title;
      btn.setAttribute('aria-pressed', String(play.id === activePlayId));
      btn.addEventListener('click', () => selectPlay(play));
      playsEl.appendChild(btn);
    }
  }

  function selectPlay(play: Play, updateHash = true): void {
    activeFormationId = play.formation;
    activePlayId = play.id;
    renderFormationSelect();
    renderPlayButtons();
    if (updateHash) {
      writeHash(play.formation, play.id);
      hideHashError();
    }
    onSelectPlay(play);
  }

  formationSelect.addEventListener('change', () => {
    const formationId = formationSelect.value as FormationId;
    const plays = playsByFormation[formationId] ?? [];
    if (plays[0]) selectPlay(plays[0]);
    else {
      activeFormationId = formationId;
      activePlayId = null;
      renderPlayButtons();
      onNoPlays?.();
    }
  });

  window.addEventListener('hashchange', () => {
    const parsed = parseHash(formations);
    if (!parsed) {
      if (location.hash.replace(/^#/, '')) showHashError();
      return;
    }
    const play = findPlay(parsed.formationId, parsed.playId);
    if (!play) {
      showHashError();
      return;
    }
    if (play.id !== activePlayId) selectPlay(play, false);
  });

  const rawHash = location.hash.replace(/^#/, '');
  const parsed = parseHash(formations);
  const initialPlay =
    (parsed && findPlay(parsed.formationId, parsed.playId)) ?? playsByFormation[formations[0].id]?.[0];

  if (rawHash && !parsed) showHashError();
  else if (parsed && !findPlay(parsed.formationId, parsed.playId)) showHashError();

  if (initialPlay) selectPlay(initialPlay, Boolean(parsed && findPlay(parsed.formationId, parsed.playId)));
}
