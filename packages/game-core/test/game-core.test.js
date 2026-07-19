import assert from 'node:assert/strict';
import { PHASES, BUILDINGS, initialState, recordClear, resetDailyQuest, localDay } from '../src/index.js';

let state = initialState(0);
for (const phase of PHASES) {
  const result = recordClear(state, { phaseId: phase.id, durationMs: 1000 });
  assert.equal(result.accepted, true);
  state = result.state;
}
assert.equal(state.events.length, 5);
assert.equal(recordClear(state, { phaseId: PHASES[0].id, durationMs: 1000 }).accepted, false);
assert.equal(BUILDINGS.filter((b) => state.droplets >= b.unlockAt).length, 3);
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
assert.equal(resetDailyQuest(state, tomorrow).quest.count, 0);
assert.equal(localDay(tomorrow), resetDailyQuest(state, tomorrow).quest.day);
console.log('game-core: deterministic phase, event-limit, unlock, and quest reset checks passed');
