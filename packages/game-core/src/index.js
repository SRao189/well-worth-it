export const PHASES = Object.freeze([
  { id: 'awareness', label: 'Awareness', mechanic: 'Route the first clear-water pipe', unlockAt: 0, reward: 200 },
  { id: 'site-preparation', label: 'Site preparation', mechanic: 'Avoid sediment gates', unlockAt: 500, reward: 250 },
  { id: 'digging', label: 'Digging', mechanic: 'Complete the assisted fill', unlockAt: 1100, reward: 300 },
  { id: 'pump-installation', label: 'Pump installation', mechanic: 'Connect the pump before the timer', unlockAt: 1800, reward: 400 },
  { id: 'clean-water-flow', label: 'Clean-water flow', mechanic: 'Keep every pipe segment open', unlockAt: 2600, reward: 500 }
]);

export const BUILDINGS = Object.freeze([
  { id: 'community-center', name: 'Community center', unlockAt: 0, explanation: 'A shared place for water-system decisions.' },
  { id: 'school', name: 'School', unlockAt: 500, explanation: 'A progression node for the demo village.' },
  { id: 'health-clinic', name: 'Health clinic', unlockAt: 1100, explanation: 'A progression node for the demo village.' },
  { id: 'farm', name: 'Farm', unlockAt: 1800, explanation: 'A progression node for the demo village.' }
]);

export const MAX_EVENTS = 5;

export function initialState(seed = 1247) {
  return { seed, droplets: seed, phaseIndex: 0, completed: [], quest: { count: 0, day: localDay() }, events: [] };
}

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function resetDailyQuest(state, date = new Date()) {
  const day = localDay(date);
  if (state.quest.day === day) return state;
  return { ...state, quest: { count: 0, day } };
}

export function completePhase(state, phaseId) {
  const phase = PHASES.find((item) => item.id === phaseId);
  if (!phase || state.completed.includes(phaseId)) return state;
  const next = { ...state, completed: [...state.completed, phaseId], droplets: state.droplets + phase.reward };
  return { ...next, phaseIndex: Math.min(PHASES.length - 1, next.completed.length) };
}

export function recordClear(state, { phaseId, durationMs, assisted = false, date = new Date() } = {}) {
  const phase = PHASES.find((item) => item.id === phaseId);
  if (!phase || !Number.isFinite(durationMs) || durationMs < 500 || durationMs > 30000) return { state, accepted: false, reason: 'invalid-event' };
  const clean = resetDailyQuest(state, date);
  if (clean.events.length >= MAX_EVENTS) return { state: clean, accepted: false, reason: 'event-limit' };
  const next = completePhase(clean, phaseId);
  const questCount = Math.min(5, next.quest.count + 1);
  const event = { phaseId, durationMs, assisted: Boolean(assisted), reward: phase.reward };
  return { accepted: true, state: { ...next, quest: { count: questCount, day: localDay(date) }, events: [...next.events, event] }, event };
}

export function unlockedBuildings(droplets) { return BUILDINGS.filter((building) => droplets >= building.unlockAt); }
