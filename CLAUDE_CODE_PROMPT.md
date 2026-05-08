# CLAUDE CODE PROMPT — Tokimemo Proto (M0 → M2)

> **À donner à Claude Code** dans un terminal pour bootstrap le projet de M0 (setup) à M2 (1 fille fonctionnelle).
> Lis tout d'abord, puis colle ce prompt dans Claude Code après avoir mis les fichiers `BRIEF.md`, `CHARACTERS.md` et `DESIGN.md` dans `./docs/`.

---

## CONTEXT FOR CLAUDE CODE

You are bootstrapping **Tokimemo Proto**, a web-based dating sim inspired by Tokimeki Memorial. The full game design is in three reference docs in `./docs/`:

- `docs/BRIEF.md` — Game design, scope, milestones, tech stack
- `docs/CHARACTERS.md` — The 3 girls + Yoshi (NPC), with progressive narrative twists
- `docs/DESIGN.md` — Technical design: formulas, balance values, tables, save schema

**Read all three before writing any code.** They are the source of truth. Anything you implement must be consistent with them.

The game is in **English**. Character names stay Japanese (Rin, Naomi, Mio, Yoshi).

---

## TECH STACK (locked, no substitutions)

```
Vite + React 19 + TypeScript (strict mode)
+ Zustand (with persist + immer middleware)
+ XState v5
+ inkjs
+ Tailwind CSS 4
+ Motion (formerly Framer Motion)
+ Howler.js
```

Build target: static export, deployable on itch.io as a zip.

---

## CODE STYLE GUIDELINES

- **Pragmatic, not over-engineered.** TS strict mode is mandatory. Standard conventions. No tests for the MVP (we add them post-launch if useful).
- **Clear separation of concerns**: UI components in `src/components/`, game logic in `src/game/`, ink scripts in `src/ink/`.
- **Pure functions for game logic** wherever possible. Side effects (state mutation) only in Zustand actions.
- **Type everything.** No `any`. Use discriminated unions for game states, events, screens.
- **Comment why, not what.** The code should be readable. Comments explain design decisions or non-obvious tradeoffs.
- **No premature abstraction.** Build the boring concrete version first. Refactor when the second use case appears.

---

## DELIVERY: M0 → M1 → M2

You will deliver three milestones in sequence. Confirm completion of each milestone with a short summary before moving to the next.

---

### MILESTONE M0 — Project setup

**Goal**: a clean Vite + React + TS project with all dependencies installed, folder structure ready, a stylized "Hello Tokimemo" landing.

**Tasks**:

1. Initialize a Vite project: `npm create vite@latest tokimemo-proto -- --template react-ts`
2. Install all stack dependencies:
   ```
   npm install zustand immer xstate @xstate/react inkjs framer-motion howler
   npm install -D tailwindcss @tailwindcss/vite
   ```
   (Use Motion package `framer-motion` — that's its current npm name even though branded as "Motion".)
3. Configure Vite for static export (no SSR needed): the default Vite SPA build is fine.
4. Configure Tailwind 4 (using the new Vite plugin approach).
5. Set up `tsconfig.json` with `"strict": true` and modern TS options.
6. Create the folder structure exactly as specified in `BRIEF.md` §9 — but only create empty placeholder files where needed. Do not stub fake content.
7. Create a clean `App.tsx` that renders a stylized "Tokimemo Proto" title screen with:
   - Title in a serif or display font (use Google Fonts via `@import` or `next/font`-style, your call — keep it simple)
   - Subtitle: *"A dating sim. You have 36 weeks. Don't fuck it up."* (sets tone)
   - Single button: *"New Game"* (does nothing yet, just visual)
   - Background: solid dark color (zinc-950 or similar), white text, minimalist
   - Use Motion for a subtle fade-in on mount
8. Initialize a Git repo with a sensible `.gitignore`. Initial commit: `"M0: project setup"`.

**M0 deliverable confirmation should include**:
- Confirmation that `npm run dev` starts and shows the title screen
- Tree of created folders
- Versions of all installed dependencies

**Do NOT in M0**: implement game logic, state management, or any actual game mechanics. Setup only.

---

### MILESTONE M1 — Bare game loop (no girls)

**Goal**: the player can play through 36 weeks, allocate weekly activities, take exams, see stats change. Zero narrative content.

**Tasks**:

1. **Game state in Zustand** (`src/game/store.ts`):
   - Implement the full `SaveData` interface from `DESIGN.md` §14.3
   - Use Zustand `persist` middleware with `localStorage` key `tokimemo-save-default`
   - Use Zustand `immer` middleware for clean nested updates
   - Initial state matches `INITIAL_PLAYER_STATS` from `DESIGN.md` §1.2
   - For now, leave `girls` as an empty placeholder — we add them in M2

2. **Activity data** (`src/game/activities.ts`):
   - Export the complete activities table from `DESIGN.md` §2.1 and §2.2 as typed constants
   - Function `applyActivityEffects(state, activityId)` that mutates state correctly

3. **XState machine** (`src/game/machine.ts`):
   - Top-level states: `title` → `weekPlanning` → `weekResolution` → (loop) → `exam` (when applicable) → `endOfYear`
   - `weekPlanning` is where the player picks an activity
   - `weekResolution` shows the result, advances week
   - `exam` triggers automatically at weeks 12, 24, 35 (per `DESIGN.md` §1.1)
   - `endOfYear` triggers after week 36 (just shows "to be continued" placeholder for now)
   - Use `@xstate/react` for the React integration

4. **Screens** (`src/components/screens/`):
   - `TitleScreen.tsx` — start a new game OR continue from save
   - `CalendarScreen.tsx` — visual grid of 36 weeks, current week highlighted, exam weeks marked. Minimalist, just a grid for now.
   - `WeekPlanningScreen.tsx` — 6 buttons for the 6 weekly activities, with hover tooltips showing effects
   - `WeekResolutionScreen.tsx` — shows "You did X. Stats changed: …" then "Next week" button
   - `ExamScreen.tsx` — applies exam logic from `DESIGN.md` §9, shows result tier, advances
   - `EndOfYearScreen.tsx` — placeholder "year complete, ending logic in M4"
   - `StatsBar.tsx` (UI component) — visible at the top of weekPlanning/resolution: shows the 4 visible stats (studies, athletics, art, charm) as horizontal bars. **Stress is hidden** (per design — visible only via `~` debug toggle).

5. **Debug overlay** (`src/components/DebugOverlay.tsx`):
   - Toggle with `~` key (tilde)
   - Shows raw `gameState` JSON
   - Manual buttons to: skip week, force exam, reset save
   - **Critical for QA — implement now, not later**

6. **Style**: stay minimalist. Tailwind utility classes. No fancy art yet — just clean typography, boxed UI elements, dark theme. Think NES.css or Hatoful Boyfriend pre-art.

**M1 deliverable confirmation**:
- Player can start a new game, allocate 36 weeks of activities, take 3 exams, reach end of year
- Stats persist correctly across page refreshes
- Debug overlay works (`~` toggle)
- Save/load via localStorage works

**Do NOT in M1**: any girl content, dating, ink, audio, fancy art.

---

### MILESTONE M2 — One girl + locations + phone calls (Rin)

**Goal**: the player can meet Rin, call her, take her on dates at different locations, see her affection (via Yoshi qualitative check) shift, and unlock at least one of her cutscenes.

**Tasks**:

1. **Girl data** (`src/game/girls.ts`):
   - Implement Rin's full data per `CHARACTERS.md` §1 and `DESIGN.md` §3, §5.2
   - Type `Girl` interface based on `SaveData.girls` schema
   - Initial state: Rin not met, affection 0, no flags set
   - Add Naomi and Mio as data placeholders (they exist but won't be playable yet — for M2 only Rin is reachable)

2. **Location data** (`src/game/locations.ts`):
   - All 8 locations from `DESIGN.md` §5.1
   - Function `getLocationPreference(girl, location, currentGirlState)` that returns `'loved' | 'hated' | 'neutral'` accounting for dynamic twists (Naomi library twist, Rin aquarium post-cutscene)

3. **Affection formula** (`src/game/formulas.ts`):
   - Implement `calculateDateAffectionGain` exactly as in `DESIGN.md` §3.2
   - Implement `getAffectionTier(affection)` → returns the tier name
   - Pure functions, no side effects

4. **Phone screen** (`src/components/screens/PhoneScreen.tsx`):
   - Lists girls the player has met (M2: only Rin)
   - On selection: shows day picker (Saturday/Sunday) and location picker (only unlocked locations for current week)
   - Implements `calculateInvitationAcceptance` from `DESIGN.md` §6.1
   - On acceptance: schedules a date for the chosen weekend
   - Consumes the weekly phone call slot (1/week max)
   - Also includes a "Call Yoshi" option that opens a sub-screen for affection check on a girl

5. **Date screen** (`src/components/screens/DateScreen.tsx`):
   - Loads an ink script for the chosen girl × location
   - Short format: 1-2 dialogue questions per `BRIEF.md` §4.6
   - On completion, applies affection gain via the formula
   - Checks if any cutscene unlocks (`DESIGN.md` §7.1) — if yes, plays the cutscene ink instead of/after the regular date
   - Updates `girl.lastInteractionWeek`

6. **Ink scripts for Rin** (`src/ink/rin.ink`):
   - Write at least:
     - 1 first-meeting scene (auto-triggered when conditions met — see `DESIGN.md` §11)
     - 3 generic date scripts (variants for park, café, arcade — Rin's loved location)
     - 1 cutscene: `rin_arcade_chamber` (W4-8, affection 30+)
   - Use ink variables to receive game state (current week, affection tier) and conditionally branch dialogue
   - **Tone**: humor + dark per `CHARACTERS.md`. Rin is sarcastic, sharp. Use her exact dialogue samples from `CHARACTERS.md` §1 as voice reference.

7. **Ink-React adapter** (`src/ink-runtime/inkAdapter.ts`):
   - Loads compiled ink JSON
   - Bridges between ink Story object and React state
   - Handles passing variables in (game state) and reading variables out (dialogue choice scores, flags to set)
   - Compile ink at build time using `inklecate` or use the JS compiler — your call, simplest approach.

8. **Yoshi NPC** (`src/components/screens/YoshiScreen.tsx`):
   - Phone call screen sub-route
   - Player picks a girl to ask about
   - Returns qualitative dialogue per affection tier (`BRIEF.md` §4.3)
   - Uses Rin-specific lines from `CHARACTERS.md` Yoshi section

9. **Wire it all into the XState machine**:
   - Add `phone` state (player picks girl, day, location)
   - Add `weekend` state with branches: `date` | `solo_boost` | `weekend_rest` | `study_hard` | `club_practice` (M2 = no club yet, but data structure ready)
   - Add `cutscene` state for special scenes
   - Make sure week advancement still works after dates

10. **Meeting Rin**: implement the introduction flow per `DESIGN.md` §11
    - At week 4+, if player.charm ≥ 25 OR player chose athletics_club at W2, trigger `rin_meeting.ink`
    - Yoshi-introduction fallback at W10 if not met yet

**M2 deliverable confirmation**:
- Player can meet Rin somewhere between W4-W10
- Player can call Rin once per week and propose a day + location
- Rin accepts/refuses based on the formula
- Dates run as short ink scenes with 1-2 choices
- Affection updates per the formula (compat × location × dialogue × rep × bomb)
- At least the `rin_arcade_chamber` cutscene triggers when conditions are met
- Yoshi can be called for an affection check, gives correct qualitative response per tier
- All visible via debug overlay

**Do NOT in M2**: Naomi, Mio, clubs (just data structure), bomb system, full cutscene set, audio, fancy sprites.

---

## CRITICAL CONSTRAINTS (across all milestones)

- **Always read the docs first.** When in doubt about a value, formula, or behavior, check `DESIGN.md`. Don't invent.
- **Stay in scope.** If you find yourself wanting to add Naomi to M2 because it's "easy," **don't**. Stick to the milestone.
- **Use placeholder art.** Sprites = colored boxes with the girl's name. Backgrounds = solid colors. We don't waste time on art before M5.
- **English only in user-visible text.** Code comments can be French if helpful, but UI strings, ink dialogue, button labels = EN.
- **Confirm milestone completion before moving on.** Print a summary, list what works, ask "ready for next milestone?"
- **Commit after each milestone.** `M0:`, `M1:`, `M2:` commit prefixes.

---

## EXPECTED OUTPUT SHAPE PER MILESTONE

When finishing each milestone, output:

```
✅ MILESTONE M0 COMPLETE

Created files:
- package.json (deps: vite@..., react@..., ...)
- src/main.tsx
- src/App.tsx
- src/components/screens/TitleScreen.tsx
- ...

Folder structure:
src/
├─ assets/
│  ├─ sprites/  (empty)
│  ...

Working features:
- npm run dev starts dev server on :5173
- Title screen renders with fade-in
- "New Game" button visible (does nothing yet)

Open questions for the user:
- (anything you weren't sure about)

Ready to proceed to M1? [yes/no]
```

---

## RESOURCES

- Inkjs docs: https://github.com/y-lohse/inkjs
- XState v5 docs: https://stately.ai/docs
- Zustand docs: https://github.com/pmndrs/zustand
- Tokimeki Memorial wiki (mechanics reference): https://en.wikipedia.org/wiki/Tokimeki_Memorial

---

## FINAL WORD

This is a creative project. Take care with the writing. Rin's voice matters. Don't generate generic anime dialogue — re-read `CHARACTERS.md` §1 and match her tone.

When uncertain about a design decision: prefer the option that's **more honest, more specific, less melodramatic**. The game's identity is "humor and dark, balanced." Not "shojo classique."

Ready? Start with M0. Confirm completion before M1.
