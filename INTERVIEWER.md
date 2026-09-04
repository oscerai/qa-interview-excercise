# Interviewer guide — do not share this branch/file with the candidate

Private notes for the live session. Keep this on the `interviewer-guide` branch (or locally) if the candidate has repo access before the call.

## Setup (2 min)

```bash
git clone git@github.com:oscerai/qa-tech-exercise.git
cd qa-tech-exercise
npm install
npm test          # should be green (happy path only)
npm run dev       # optional
```

Share screen. Candidate drives. AI tools allowed — watch *how* they use them.

## Session shape (45–60 min)

| Time | What |
| --- | --- |
| 0–5 | They skim README + tests. Ask: “What would you want green before we ship this?” |
| 5–15 | They name gaps: quota 10 vs 11, empty transcript, whitespace name, generate-from-recording, CI missing API tests. |
| 15–40 | They write tests (and optionally fix bugs). Prefer they write a failing test *before* the fix. |
| 40–50 | Pyramid / release: unit vs API vs E2E, what belongs on PR vs nightly. Point at `ci.yml` only running `test:unit`. |
| 50–60 | AI: would they prompt for the missing cases, or paste the whole file? How do they review generated tests? |

You do **not** need a browser E2E here. If they reach for Playwright first, ask why that is the right layer for quota arithmetic.

## Planted bugs

All marked `BUG (` in `src/`.

1. **quota-off-by-one** (`src/quota.ts`) — `generatedCount <= 10` allows an 11th free note. Spec is 10.
2. **quota-on-failure** (`src/sessions.ts`) — `incrementUsage` runs before the empty-transcript throw. A failed generate still burns quota.
3. **whitespace-name** (`src/sessions.ts`) — `if (!patientName)` lets `"   "` through.
4. **skip-ready** (`src/sessions.ts`) — generate blocked only for `draft`, so `recording` can generate.

## Strong vs weak signal

**Strong:** starts from spec vs tests; picks unit for quota and API for HTTP/auth; writes a failing test for the 11th note; notices CI does not run `test:api`; talks PR smoke vs nightly; uses AI to enumerate cases then edits assertions.

**Weak:** only happy-path E2E; cannot explain why unit tests exist; copies AI output without reading; never mentions release gating; “add more tests” with no layering.

## If they freeze

Prompt: “A free user generates 10 notes, then one more. What should happen?”  
Then: “Same user, empty transcript. Quota?”

## After the call

Reset `main` to the seed commit so the next candidate sees the same gaps (`git reset --hard <seed>` / force-push if this repo is interview-only).
