(() => {
  const button = document.querySelector('#fillTarget');
  const meter = document.querySelector('#fillMeter');
  const droplets = document.querySelector('#droplets');
  const count = document.querySelector('#questCount');
  const label = document.querySelector('#fillLabel');
  if (!button || !meter || !droplets || !count) return;

  const HOLD_MIN_MS = 500;
  const HOLD_MAX_MS = 1500;
  const STORAGE_KEY = 'wwi-local-pilot-v1';
  let timer = null;
  let start = 0;
  let quest = 0;
  let state = { droplets: 1247, quest: 0 };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Number.isFinite(saved.droplets)) state.droplets = saved.droplets;
    if (Number.isFinite(saved.quest)) state.quest = Math.min(5, Math.max(0, saved.quest));
  } catch (_) { /* local storage is optional in restricted browsers */ }

  function render() {
    droplets.textContent = state.droplets.toLocaleString();
    quest = state.quest;
    count.textContent = `${quest} / 5`;
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* demo remains usable */ }
  }

  function stop(cancelled) {
    clearInterval(timer);
    timer = null;
    meter.style.width = cancelled ? '0%' : '100%';
    button.setAttribute('aria-pressed', 'false');
    if (label) label.textContent = cancelled ? 'Hold to fill' : 'Spring cleared';
    if (!cancelled) {
      state.droplets += 200;
      state.quest = Math.min(5, state.quest + 1);
      render();
      persist();
      window.setTimeout(() => { meter.style.width = '0%'; if (label) label.textContent = 'Hold to fill'; }, 350);
    }
  }

  function fill() {
    if (timer) return;
    const duration = HOLD_MIN_MS + (state.quest / 5) * (HOLD_MAX_MS - HOLD_MIN_MS);
    start = performance.now();
    button.setAttribute('aria-pressed', 'true');
    if (label) label.textContent = 'Filling…';
    timer = window.setInterval(() => {
      const ratio = Math.min(1, (performance.now() - start) / duration);
      meter.style.width = `${ratio * 100}%`;
      if (ratio >= 1) stop(false);
    }, 50);
  }

  button.addEventListener('pointerdown', fill);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(event => button.addEventListener(event, () => { if (timer) stop(true); }));
  button.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !timer) { event.preventDefault(); fill(); }
  });
  button.addEventListener('keyup', event => {
    if ((event.key === 'Enter' || event.key === ' ') && timer) { event.preventDefault(); stop(true); }
  });
  render();
  window.WWI = { HOLD_MIN_MS, HOLD_MAX_MS, STORAGE_KEY };
})();
