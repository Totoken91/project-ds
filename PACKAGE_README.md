# Tokimemo Proto — Project Package

> A web-based dating sim inspired by Tokimeki Memorial.
> System-driven, hidden affection, location-based dating, bomb mechanic.
> 36 weeks. 3 girls. One year to fuck it up or not.

## Package Contents

```
tokimemo-package/
├─ README.md                  ← you are here
├─ CLAUDE_CODE_PROMPT.md      ← prompt to give to Claude Code for M0→M2
├─ package.json.template      ← reference dependencies (do not run as-is)
└─ docs/
   ├─ BRIEF.md                ← game design, scope, milestones (v2)
   ├─ CHARACTERS.md           ← 3 girls + Yoshi NPC, with twists
   └─ DESIGN.md               ← formulas, balance, save schema, tables
```

## How to use this package

### Step 1: Read the docs in order

1. **BRIEF.md** — understand the scope, the pillars, the milestones
2. **CHARACTERS.md** — meet Rin, Naomi, Mio, Yoshi
3. **DESIGN.md** — the technical reference for formulas and values

### Step 2: Create the project repo

```bash
mkdir tokimemo-proto
cd tokimemo-proto
mkdir docs
# Copy the three docs from this package into ./docs/
cp /path/to/tokimemo-package/docs/*.md ./docs/
git init
```

### Step 3: Hand off to Claude Code

Open Claude Code in the `tokimemo-proto/` directory. Paste the contents of `CLAUDE_CODE_PROMPT.md` as your initial prompt.

Claude Code will then:
- **M0** — bootstrap the project (Vite + TS + deps + structure + title screen)
- **M1** — implement the bare game loop (36 weeks, activities, exams, no girls)
- **M2** — implement Rin (meet, call, date, locations, one cutscene, Yoshi check)

After M2, you have a vertical slice you can play and iterate from.

### Step 4: Continue with M3 → M8

After M2 is solid, follow the rest of the milestones in `BRIEF.md` §10:
- **M3** — Naomi + Mio + clubs + Yoshi full
- **M4** — bomb system + special cutscenes + endings
- **M5** — actual sprites + backgrounds + UI polish
- **M6** — audio (BGM, SFX)
- **M7** — balance + QA
- **M8** — itch.io ship

You can run M3+ through Claude Code with a similar approach: write a focused prompt referencing the existing codebase + the relevant doc sections.

## Tech Stack (locked)

```
Vite + React 19 + TypeScript (strict)
+ Zustand (persist + immer)
+ XState v5
+ inkjs
+ Tailwind 4
+ Motion (framer-motion)
+ Howler.js
```

## Game Language

**English.** UI, dialogue, ink scripts — all EN. Character names are kept Japanese.

## Project Status

- ✅ Brief (v2) complete
- ✅ Characters complete (3 girls + Yoshi, with twists)
- ✅ Design doc complete (formulas, tables, balance)
- ⏳ M0 setup — to do via Claude Code
- ⏳ M1 → M8 — sequential milestones

## Estimated Scope

- **MVP**: 12-14 weeks solo, evening/weekend cadence
- **Total content**: 3 girls × ~5 ink scenes each + Yoshi + generics ≈ 25-30 ink scenes total
- **Endings**: 9 (3 good + 3 bittersweet + 1 solo + 2 game over)

## Post-Launch Roadmap (summary)

- **Wave 1**: Polish & QoL (galleries, achievements, skip)
- **Wave 2**: Rival NPC mechanic (Yoshi as antagonist)
- **Wave 3**: Fourth secret girl
- **Wave 4**: Year 2 (huge expansion)
- **Wave 5**: Misc stretch (NG+, localization, items, fashion)

See `docs/BRIEF.md` §7 for details.

## License & Credits

- Project owned by Kenny
- Inspired by Tokimeki Memorial (Konami, 1994) — no code or assets reused, design study only
- Yoshi character is an explicit homage to Yoshio (Tokimeki Memorial's best friend NPC)

---

*Ready to ship a real Tokimeki-like in 2026. Let's go.*
