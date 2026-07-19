(() => {
  const board = document.querySelector('#pipeBoard');
  const button = document.querySelector('#fillTarget');
  if (!board || !button) return;

  const phases = [
    { name: 'Awareness', title: 'Mountain Spring', copy: 'Route the water to the village pump.', reward: 200, duration: 900 },
    { name: 'Site preparation', title: 'Clear the Ridge', copy: 'Sediment blocks the safest path.', reward: 250, duration: 1050 },
    { name: 'Digging', title: 'Downhill Run', copy: 'Keep the route steady through the dig site.', reward: 300, duration: 1200 },
    { name: 'Pump installation', title: 'Prime the Pump', copy: 'Connect the pump before the pressure drops.', reward: 400, duration: 1350 },
    { name: 'Clean-water flow', title: 'Village Flow', copy: 'One clean route. Everyone gets water.', reward: 500, duration: 1500 }
  ];
  const key = 'wwi-local-pilot-v2';
  const ui = { phaseEyebrow: document.querySelector('#phaseEyebrow'), title: document.querySelector('#main-title'), missionTitle: document.querySelector('#missionTitle'), missionCopy: document.querySelector('#missionCopy'), phaseReward: document.querySelector('#phaseReward'), stepCount: document.querySelector('#stepCount'), status: document.querySelector('#boardStatus'), meter: document.querySelector('#fillMeter'), label: document.querySelector('#fillLabel'), droplets: document.querySelector('#droplets'), score: document.querySelector('#runScore'), quest: document.querySelector('#questCount'), streak: document.querySelector('#routeStreak'), nextUnlock: document.querySelector('#nextUnlock'), combo: document.querySelector('#comboNote'), assist: document.querySelector('#assistMode'), track: document.querySelector('.phase-track'), button };
  let state = { phase: 0, droplets: 1247, quest: 0, streak: 0, completed: false, finished: false };
  let timer = null;
  let start = 0;
  let selected = [];

  try { state = { ...state, ...JSON.parse(localStorage.getItem(key) || '{}') }; } catch (_) {}
  state.phase = Math.min(phases.length - 1, Math.max(0, Number(state.phase) || 0));
  state.quest = Math.min(5, Math.max(0, Number(state.quest) || 0));

  function persist() { try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {} }
  function renderTrack() {
    [...ui.track.querySelectorAll('.phase-dot')].forEach((dot, index) => { dot.classList.toggle('active', index === state.phase); dot.classList.toggle('complete', index < state.phase); });
    [...ui.track.querySelectorAll('i')].forEach((line, index) => line.classList.toggle('complete', index < state.phase));
    ui.track.setAttribute('aria-valuenow', String(state.phase + 1));
  }
  function render() {
    const phase = phases[state.phase];
    ui.phaseEyebrow.textContent = `PHASE ${state.phase + 1} · ${phase.name}`;
    ui.title.textContent = phase.title; ui.missionTitle.textContent = phase.title; ui.missionCopy.textContent = phase.copy; ui.phaseReward.textContent = `+${phase.reward}`;
    ui.droplets.textContent = state.droplets.toLocaleString(); ui.score.textContent = state.droplets.toLocaleString(); ui.quest.textContent = `${state.quest} / 5`; ui.streak.textContent = state.streak;
    const next = [500, 1100, 1800, 2600].find((threshold) => state.droplets < threshold); ui.nextUnlock.textContent = next ? next.toLocaleString() : 'MAX';
    ui.combo.textContent = state.streak > 1 ? `${state.streak} route streak · bonus focus` : 'No mistakes · clean route';
    renderTrack();
  }
  function drawBoard() {
    board.replaceChildren(); selected = []; state.completed = false; ui.stepCount.textContent = '0 / 6'; ui.status.textContent = 'Select the glowing segment first.'; ui.meter.style.width = '0%'; ui.label.textContent = 'Hold to flow';
    for (let index = 0; index < 6; index += 1) {
      const tile = document.createElement('button'); tile.type = 'button'; tile.className = `pipe-node${index === 0 ? ' next' : ''}`; tile.dataset.index = String(index); tile.setAttribute('aria-label', `Pipe segment ${index + 1}`); tile.innerHTML = `<span class="sr-only">Segment ${index + 1}</span>`;
      tile.addEventListener('click', () => selectPipe(index)); board.append(tile);
    }
  }
  function selectPipe(index) {
    if (state.completed) return;
    const expected = selected.length;
    const tile = board.children[index];
    if (index !== expected) { tile.classList.add('wrong'); ui.status.textContent = 'That joint is blocked. Follow the blue signal.'; window.setTimeout(() => tile.classList.remove('wrong'), 320); return; }
    selected.push(index); tile.classList.remove('next'); tile.classList.add('connected'); tile.setAttribute('aria-label', `Pipe segment ${index + 1}, connected`);
    const next = board.children[index + 1]; if (next) next.classList.add('next');
    ui.stepCount.textContent = `${selected.length} / 6`;
    if (selected.length === 6) { state.completed = true; ui.status.textContent = 'Route locked. Hold to open the clean-water flow.'; ui.label.textContent = 'Hold to flow'; }
    else ui.status.textContent = `Good connection. Segment ${selected.length + 1} is next.`;
  }
  function finishPhase() {
    state.droplets += phases[state.phase].reward; state.quest = Math.min(5, state.quest + 1); state.streak += 1; state.completed = false;
    if (state.phase === phases.length - 1) state.finished = true;
    persist();
    ui.status.textContent = `Flow restored! +${phases[state.phase].reward} droplets.`; ui.label.textContent = 'Route restored'; render();
    if (state.finished) { ui.status.textContent = 'Waterworks complete! Your village has a clean-water route.'; ui.label.textContent = 'Run complete'; button.disabled = true; return; }
    window.setTimeout(() => { state.phase += 1; drawBoard(); render(); }, 850);
  }
  function stop(cancelled) {
    clearInterval(timer); timer = null; ui.button.setAttribute('aria-pressed', 'false');
    if (cancelled) { ui.meter.style.width = '0%'; ui.label.textContent = 'Hold to flow'; ui.status.textContent = 'Keep holding until the gauge completes.'; return; }
    ui.meter.style.width = '100%'; finishPhase();
  }
  function startFlow() {
    if (state.finished) { ui.status.textContent = 'This run is complete. Reset the demo to play again.'; return; }
    if (timer || !state.completed) { if (!state.completed) ui.status.textContent = ui.assist.checked ? 'Assisted route is ready — select Flow again.' : 'Connect all six segments before opening the flow.'; return; }
    start = performance.now(); ui.button.setAttribute('aria-pressed', 'true'); ui.label.textContent = 'Building pressure…';
    timer = window.setInterval(() => { const ratio = Math.min(1, (performance.now() - start) / phases[state.phase].duration); ui.meter.style.width = `${ratio * 100}%`; if (ratio >= 1) stop(false); }, 40);
  }
  function assistedRoute() { if (!ui.assist.checked || state.completed) return; for (let index = 0; index < 6; index += 1) selectPipe(index); ui.status.textContent = 'Assisted route complete. Hold to open the flow.'; }
  button.addEventListener('pointerdown', startFlow); ['pointerup', 'pointercancel', 'pointerleave'].forEach((event) => button.addEventListener(event, () => { if (timer) stop(true); }));
  button.addEventListener('keydown', (event) => { if ((event.key === 'Enter' || event.key === ' ') && !timer) { event.preventDefault(); startFlow(); } });
  button.addEventListener('keyup', (event) => { if ((event.key === 'Enter' || event.key === ' ') && timer) { event.preventDefault(); stop(true); } });
  ui.assist.addEventListener('change', assistedRoute);
  drawBoard(); render();
  window.WWI = { key, phases, getState: () => ({ ...state }), reset: () => { localStorage.removeItem(key); window.location.reload(); } };
})();
