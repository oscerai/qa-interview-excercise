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

---

## What the app does

**NoteForge** is a minimal consult-note service for clinicians.

| Surface | Purpose |
| --- | --- |
| **Web** (`localhost:3000`) | Sign-up form — user picks an id and plan (`free` or `pro`) |
| **API** | Create a session, record a visit, generate a consult note |

**Business rules**

- Free users: **10 notes per calendar month**. Pro: unlimited.
- A session must go `draft → recording → ready` before a note can be generated.
- `patientName` is required (non-whitespace).
- Generating with an empty transcript must fail and must **not** consume quota.

---

## Web flow (E2E)

The web UI is a **single sign-up page** at `http://localhost:3000`. There is no UI for sessions or note generation.

| Step | User action | What happens |
| --- | --- | --- |
| 1 | Open `localhost:3000` | Sign-up form loads |
| 2 | Enter a user id | e.g. `qa-candidate` |
| 3 | Select a plan | `free` (10 notes/month) or `pro` (unlimited) |
| 4 | Click **Sign up** | Browser sends `POST /users` with `{ id, plan }` |
| 5 | See success message | e.g. `Signed up as qa-candidate (free)` |

On error (e.g. invalid input), an error message is shown instead.

The form uses `data-testid` attributes for stable selectors: `user-id`, `plan`, `signup-submit`, `signup-success`, `error-message`.

---

## API flow (no UI)

After sign-up, the consult-note workflow is **API-only**. A typical happy path:

| Step | Request | Result |
| --- | --- | --- |
| 1 | `POST /users` `{ id, plan }` | User created (`201`) |
| 2 | `POST /sessions` + header `x-user-id` + `{ patientName }` | Session created, status `draft` (`201`) |
| 3 | `POST /sessions/:id/start` | Status → `recording` (`200`) |
| 4 | `POST /sessions/:id/stop` + `{ transcript }` | Status → `ready` (`200`) |
| 5 | `POST /sessions/:id/generate` + header `x-user-id` | Note returned, status → `note_generated` (`201`) |

Example generate response:

```json
{
  "note": "Consult note for Jane Doe: Patient reports a sore throat.",
  "session": { "id": "ses_...", "status": "note_generated", ... }
}
```

### Endpoints

```
POST /users                  { id, plan: "free" | "pro" }
POST /sessions               header x-user-id; body { patientName }
POST /sessions/:id/start
POST /sessions/:id/stop      { transcript }
POST /sessions/:id/generate  header x-user-id
```

In-memory store. `npm run dev` serves the web UI and API on port 3000.

---

### Billing helpers (`src/billing.ts`)

Two pure functions used for billing calculations (covered by sample unit tests in `tests/unit/billing.test.ts`):

**`daysRemainingInMonth(asOf?)`**
- **Input:** optional `Date` (defaults to today)
- **Output:** number of days left in that calendar month, including today
- Example: Sep 4 → `26`; Sep 30 → `0`

**`prorateMonthlyPrice(fullPrice, dayOfMonth, daysInMonth)`**
- **Input:** monthly price, which day billing starts (1-based), days in the month
- **Output:** prorated price for the rest of the month, rounded to cents
- Throws if the day or month length is invalid
- Example: `$100` from day 1 of a 30-day month → `$100`; from day 30 → `$3.33`
