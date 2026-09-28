// Accessible custom select. Native <select> menus ignore app typography
// (especially on macOS), so formation / other pickers use this instead.

export type SelectOption = { value: string; label: string };

export interface SelectHandle {
  setValue(value: string): void;
  getValue(): string;
  setOptions(options: SelectOption[]): void;
  destroy(): void;
}

export interface SelectOptions {
  id?: string;
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
}

export function createSelect(container: HTMLElement, config: SelectOptions): SelectHandle {
  let options = config.options.slice();
  let value = config.value ?? options[0]?.value ?? '';
  let open = false;

  container.classList.add('ui-select');
  container.innerHTML = `
    <button
      type="button"
      class="ui-select-trigger"
      ${config.id ? `id="${config.id}"` : ''}
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-label="${config.label}"
    >
      <span class="ui-select-value"></span>
    </button>
    <ul class="ui-select-list" role="listbox" hidden></ul>
  `;

  const trigger = container.querySelector<HTMLButtonElement>('.ui-select-trigger')!;
  const valueEl = container.querySelector<HTMLSpanElement>('.ui-select-value')!;
  const list = container.querySelector<HTMLUListElement>('.ui-select-list')!;

  function labelFor(v: string): string {
    return options.find((o) => o.value === v)?.label ?? v;
  }

  function paintValue(): void {
    valueEl.textContent = labelFor(value);
  }

  function paintList(): void {
    list.textContent = '';
    for (const option of options) {
      const item = document.createElement('li');
      item.role = 'option';
      item.className = 'ui-select-option' + (option.value === value ? ' is-selected' : '');
      item.dataset.value = option.value;
      item.setAttribute('aria-selected', String(option.value === value));
      item.textContent = option.label;
      item.tabIndex = -1;
      item.addEventListener('click', () => {
        if (option.value !== value) {
          value = option.value;
          paintValue();
          config.onChange(value);
        }
        setOpen(false);
        trigger.focus();
      });
      list.appendChild(item);
    }
  }

  function setOpen(next: boolean): void {
    open = next;
    container.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    list.hidden = !open;
    if (open) {
      paintList();
      const selected = list.querySelector<HTMLElement>('.is-selected');
      selected?.focus();
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }

  function onDocPointer(event: PointerEvent): void {
    if (!open) return;
    if (!container.contains(event.target as Node)) setOpen(false);
  }

  function onKey(event: KeyboardEvent): void {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    const items = [...list.querySelectorAll<HTMLElement>('.ui-select-option')];
    const index = items.findIndex((el) => el === document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      trigger.focus();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[Math.min(index + 1, items.length - 1)]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[Math.max(index - 1, 0)]?.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const active = document.activeElement as HTMLElement | null;
      const next = active?.dataset.value;
      if (next && next !== value) {
        value = next;
        paintValue();
        config.onChange(value);
      }
      setOpen(false);
      trigger.focus();
    }
  }

  trigger.addEventListener('click', () => setOpen(!open));
  trigger.addEventListener('keydown', onKey);
  list.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onDocPointer);

  paintValue();
  paintList();

  return {
    setValue(next) {
      value = next;
      paintValue();
      if (open) paintList();
    },
    getValue() {
      return value;
    },
    setOptions(next) {
      options = next.slice();
      if (!options.some((o) => o.value === value)) value = options[0]?.value ?? '';
      paintValue();
      if (open) paintList();
    },
    destroy() {
      document.removeEventListener('pointerdown', onDocPointer);
      container.textContent = '';
      container.classList.remove('ui-select', 'is-open');
    },
  };
}
