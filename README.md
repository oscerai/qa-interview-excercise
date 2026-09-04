# NoteForge — QA Lead tech exercise

Tiny consult-note API. Pair with the interviewer. You may use AI (Copilot, ChatGPT, Cursor) the way you would at work. Talk out loud about what you are doing and why.

## Product spec (source of truth)

Free users may generate **10 notes per calendar month**. Pro users are unlimited.

A session must move `draft → recording → ready` before a note can be generated.

`patientName` is required and must contain a non-whitespace character.

Generation with an **empty transcript** must fail and **must not** consume quota.

Failed generations must not change session status.

## API

```
POST /users                  { id, plan: "free" | "pro" }
POST /sessions               header x-user-id; body { patientName }
POST /sessions/:id/start
POST /sessions/:id/stop      { transcript }
POST /sessions/:id/generate  header x-user-id
```

In-memory store. `npm run dev` listens on `:3000`.

## What already exists

| Layer | Command | Coverage today |
| --- | --- | --- |
| Unit | `npm run test:unit` | Happy path only |
| API | `npm run test:api` | One 201 |
| CI | `.github/workflows/ci.yml` | Unit job only |

`npm test` runs unit + API.

## During the session

1. Read the spec and the existing tests. Say what is missing.
2. Add the tests you would trust before a release. Fix product bugs if you find them.
3. Say where each test should run (local, PR, nightly, pre-prod) and why.

Timebox: about 45 minutes of pairing. Completeness is less important than judgement.
