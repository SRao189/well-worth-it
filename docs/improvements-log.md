# Improvements log

## 2026-07-18 — gameplay and UI vertical slice

The game now follows a deliberate arcade loop: understand the objective, route
the pipe network, hold to build pressure, then celebrate the clean-water flow.
The route is deterministic so players learn mastery instead of guessing.

- Replaced the lone clicker presentation with a six-segment route board.
- Added phase-specific mission copy, rewards, progress dots, and a run score.
- Added readable telegraphing: the next pipe glows blue, wrong inputs shake,
  and the status line explains the recovery path.
- Added assisted route mode for motor-accessibility needs; it reaches the same
  outcome and reward as manual play.
- Added a one-second pressure hold only after the planning step is complete,
  keeping the tactile interaction without requiring rapid tapping.
- Added route streak, village unlock, and daily-quest feedback to make the
  reward loop legible at a glance.
- Added responsive desktop side navigation and a wider “live stories” rail,
  while retaining a thumb-friendly mobile navigation bar.
- Added reduced-motion behavior to the new telegraph and feedback states.
- Corrected primary navigation so Game and Village are separate destinations.

## Design principles used

The pass borrows the discipline of a premium live-game team: strong player
verbs, short readable feedback, deterministic mastery, meaningful progression,
and generous accessibility paths. It deliberately excludes monetization,
energy decay, loot boxes, and real-world impact claims because this remains a
synthetic assignment demo.
