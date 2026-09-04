# NoteForge — QA Technical Interview

**Live pairing · partially built codebase · not a puzzle or algorithm test.**

Use your normal AI tools (Cursor, Copilot, ChatGPT). We want to see your real workflow — how you prompt, verify, and communicate.

## Before the session (~30 min prep)

Clone this repo and confirm it runs:

```bash
git clone git@github.com:oscerai/qa-interview-excercise.git
cd qa-interview-excercise
npm install
npm run verify   # runs tests, confirms setup
npm run dev      # http://localhost:3000 — sign-up form + API
```

You should see **7 passing tests** and the sign-up page in your browser. If anything fails, note it for the start of the call.

## What we're assessing

| Skill | How you'll show it |
| --- | --- |
| **Edge-case awareness** | Read the spec, find what's untested or broken |
| **Automation strategy** | Propose what to test at unit / API / E2E and why |
| **Framework from scratch** | Bootstrap Playwright yourself — it's not pre-installed |
| **Release confidence** | Say what must be green before ship; where each test runs |
| **Verification habits** | Write tests that prove behaviour, not just happy paths |
| **AI in QA** | Use AI if you want — we'll ask how you'd apply it on the job |
| **Communication** | Talk through your thinking as you go |

---

## The app

A minimal consult-note service:

| Surface | What it does |
| --- | --- |
| **Web** | Sign-up form (`user id` + `plan`) at `localhost:3000` |
| **API** | Session lifecycle + note generation (no UI) |

### Product spec (source of truth)

- Free users: **10 notes per calendar month**. Pro: unlimited.
- Session flow: `draft → recording → ready` before generate.
- `patientName` required (non-whitespace).
- Empty transcript fails **without** consuming quota.
- Failed generations must not change session status.

### API

```
POST /users                  { id, plan: "free" | "pro" }
POST /sessions               header x-user-id; body { patientName }
POST /sessions/:id/start
POST /sessions/:id/stop      { transcript }
POST /sessions/:id/generate  header x-user-id
```

---

## The test pyramid

Each layer has **one job**. Put each scenario in the lowest layer that can catch it.

```
        ┌─────────┐
        │   E2E   │  User clicks sign-up → sees success
        ├─────────┤
        │   API   │  HTTP status codes, headers, request chain
        ├─────────┤
        │  Unit   │  Business rules, math, state machine
        └─────────┘
```

| Layer | One job | Tool | Folder |
| --- | --- | --- | --- |
| Unit | Business rules | Vitest | `tests/unit/` |
| API | HTTP contract | Supertest | `tests/api/` |
| E2E | User-facing UI | Playwright *(you add)* | `tests/e2e/` |

See the README in each `tests/` folder for what belongs where.

### What exists today

| Layer | Command | Coverage |
| --- | --- | --- |
| Unit | `npm run test:unit` | Thin — happy paths + samples |
| API | `npm run test:api` | One happy-path 201 |
| E2E | — | **None — you add Playwright** |
| CI | `.github/workflows/ci.yml` | Unit only |

`npm test` runs unit + API.

---

## During the session

You'll pair with an interviewer for ~60 minutes. **Talk out loud.** Completeness matters less than judgement.

### Part 1 — Build a verification harness (~40 min)

1. **Read** the spec and existing tests. What's missing? What might be broken?
2. **Propose** an automation strategy — map gaps to unit / API / E2E before writing code.
3. **Bootstrap Playwright** (`npm init playwright@latest` or manual). Wire `webServer` to `npm run dev`.
4. **Write tests** — E2E for sign-up; API/unit for business logic and edge cases.
5. **Debug** collaboratively if you find bugs (write a failing test first).
6. **Gate the release** — what runs on every PR? What's nightly? What would you add to CI?

### Part 2 — Test review (~15 min)

Walk through `src/billing.ts` and `tests/unit/billing.test.ts`:

1. Which test is **flaky** and why?
2. What **coverage is missing**?

Reasoning out loud is enough — you don't have to fix unless asked.

### Part 3 — AI in QA (~5 min, if time)

Be ready to discuss: where AI helps QA, where it doesn't, and how you'd verify AI-generated tests.

---

## Commands

```bash
npm run dev          # start web + API
npm test             # unit + API
npm run test:unit    # unit only
npm run test:api     # API only
npm run test:watch   # watch mode
npm run verify       # prep check before the interview
```
