# Interviewer guide — do not share with the candidate

Send the candidate the repo **30 minutes before** the session. They should run `npm install && npm run verify && npm run dev` and confirm 7 tests pass.

---

## JD → exercise mapping

| JD requirement | How the exercise tests it |
| --- | --- |
| Live pairing, partially built codebase | Thin tests, planted bugs, incomplete CI, no Playwright |
| Surface edge cases | Spec vs tests gap; quota, validation, flaky billing test |
| Build verification harness | They write unit/API/E2E tests during the session |
| Debug collaboratively | 4 planted bugs — expect failing test → fix flow |
| AI tools encouraged | Observe prompting, verification, whether they read generated code |
| Automation strategy / release confidence | Pyramid discussion + CI gating exercise |
| Spin up framework from scratch | Playwright not installed — they bootstrap it |
| Where/when tests run | `ci.yml` only runs unit — ask what they'd change |
| AI in QA | 5-min verbal at end |

---

## Pre-session checklist

- [ ] Candidate has repo link 30 min ahead
- [ ] `INTERVIEWER.md` not on branch they clone (or on separate branch)
- [ ] You can screen-share if their env fails

```bash
npm install && npm run verify && npm run dev
# Expect: 7 tests pass, sign-up form at :3000
```

---

## 60-minute session script

**Do not try to ask 30 questions.** Use 7 prompts + 2 live tasks. Everything else is backup if they finish early or get stuck.

| Time | Phase | Do this |
| --- | --- | --- |
| 0–3 | Warm-up | Confirm prep worked. Quick app tour. |
| 3–12 | **Discuss** | Q1 + Q2 + Q3 (strategy, no coding yet) |
| 12–40 | **Build** | Task 1 + Task 2 (live coding) |
| 40–50 | **Review** | Q4 + Q5 (billing flaky test) |
| 50–58 | **Gate + AI** | Q6 + Q7 |
| 58–60 | Close | "Any questions for us?" |

---

## Must-ask (7 questions + 2 tasks)

### Discuss (~10 min)

**Q1.** What would you want green before you'd sign off a release of this app?

*Good:* Names edge cases (quota, empty transcript, validation) before typing.

**Q2.** What's your **test and automation strategy** for taking this app live? How would you split unit, API, and E2E — and what would run on every PR vs nightly?

*Good:* Sign-up → E2E (Playwright). Session/quota/validation → API (Supertest) or unit (Vitest). PR = fast smoke (unit + API + one E2E). Nightly = fuller regression. Mentions README web vs API flows.

**Q3.** A free user generates 10 notes, then tries an 11th — what should happen, and **which test layer** would you use?

*Good:* 402 at API or unit. Not E2E.

### Build (~30 min)

**Task 1.** Bootstrap Playwright and write one E2E test: free user signs up and sees a success message.

*Good:* `webServer` → `npm run dev`, `data-testid` selectors, narrates choices.

**Interviewer notes — Task 1 (Playwright / framework maturity)**

AI-assisted setup is **fine** — we want to see their real workflow. Using Cursor/Copilot to scaffold `playwright.config.ts` or the first spec is not a negative. What matters is whether they **understand and can explain** what was generated.

After the test runs (or while they work), probe framework maturity — they do **not** need to build all of this in 60 minutes, but strong candidates should articulate it:

| Topic | What to listen for |
| --- | --- |
| **Page Object Model** | Locators and actions live in a page class (e.g. `SignUpPage`), not raw selectors in every test. Tests read like user journeys. |
| **Helpers / utils** | Shared setup (e.g. `signUpAsFreeUser()`) extracted from the spec. Fixtures for `page` / authenticated state. |
| **Config** | `webServer`, `baseURL`, retries, trace/screenshot on failure, sensible timeouts — not only defaults. |
| **Folder structure** | e.g. `tests/e2e/pages/`, `tests/e2e/specs/`, `tests/e2e/fixtures/` — separation of concerns. |
| **Mature framework** | Stable selectors (`data-testid`), no hard-coded sleeps, CI-ready, readable reports, easy to add the next test without copy-paste. |

**Follow-up prompts (pick 1–2 if they finish fast or only paste AI output):**

- "If we added a second page tomorrow, how would you structure the repo?"
- "Where would you put the sign-up flow so the next test doesn't duplicate these steps?"
- "What would you change before handing this framework to a team of five QAs?"
- "Page Object Model vs bare specs — when is each appropriate?"

| Signal | Strong | Weak |
| --- | --- | --- |
| AI usage | Scaffolds with AI, then refactors and explains | Pastes config/spec verbatim, can't explain `webServer` or selectors |
| Structure | Mentions POM, fixtures, or helpers even if not fully built | Everything in one flat `.spec.ts` with no plan to scale |
| Selectors | `getByTestId` / role-based | Brittle CSS or XPath tied to layout |
| Scale | Describes how framework grows (pages, utils, CI) | "One test file is enough for this app" with no forward view |

*Do not fail them for not implementing POM in the session — assess whether they **know** what good looks like and would refactor toward it.*

**Task 2.** Write a test that proves a free user **cannot** generate an 11th note (or any API/unit edge case from the spec).

*Good:* Failing test before fix if they hit a planted bug. Correct pyramid layer.

### Review (~10 min)

**Q4.** Open `tests/unit/billing.test.ts` — which test is flaky and why?

*Good:* `daysRemainingInMonth()` with no date → depends on today → fails on last day of month.

**Q5.** What test cases are missing for `daysRemainingInMonth` and `prorateMonthlyPrice`?

*Good:* Last day → 0, invalid inputs throw, mid-month proration. See answer key below.

### Gate + AI (~8 min)

**Q6.** Open `.github/workflows/ci.yml` — what's wrong with CI for release confidence? What runs on PR vs nightly?

*Good:* Only unit today. PR should add API + E2E smoke; nightly = full regression. Should align with what they said in Q2.

**Q7.** You used AI today (or would have) — where did it help, and where would you **not** trust it?

*Good:* AI for ideas/boilerplate; human owns assertions and sign-off.

---

## Optional prompts (backup only)

Use if they finish early, freeze, or you need to probe deeper. **Do not schedule these.**

| If… | Ask |
| --- | --- |
| They skip strategy | Walk me through unit vs API vs E2E for this app — see README flows. |
| E2E done fast | Why sign-up for E2E but not quota? / How would you structure POM if we added a dashboard? |
| Stuck on Playwright | How would you wire the dev server for CI? |
| Found a bug | Walk me through fix — failing test first? |
| Empty transcript | Should quota change? Where to test? |
| Whitespace name `"   "` | Valid? Which layer? |
| CI discussion thin | PR only touches CSS — still run API suite? |
| AI discussion thin | Dev says "Copilot writes all our tests" — your response? |

---

## Test pyramid rubric

| Scenario | Correct layer |
| --- | --- |
| Sign-up success message | E2E |
| 11th note → 402 | Unit or API |
| `canGenerate('free', 10)` | Unit |
| Missing `x-user-id` → 401 | API |
| Whitespace name / empty transcript | Unit (+ API for status) |

**Red flags:** all Playwright; all Supertest; can't explain layer choice; no CI opinion.

---

## Planted bugs (`BUG (` in `src/`)

| Bug | Location | Expected test layer |
| --- | --- | --- |
| quota-off-by-one | `quota.ts` | Unit at count 10 |
| quota-on-failure | `sessions.ts` | Unit (side effect) or API (422) |
| whitespace-name | `sessions.ts` | Unit or API 400 |
| skip-ready | `sessions.ts` | Unit or API 409 |

---

## Part 2 — flaky test answer key

**Test:** `daysRemainingInMonth › always has at least one day left in the billing period`

```typescript
expect(daysRemainingInMonth()).toBeGreaterThan(0);
```

**Why flaky:** defaults to `new Date()` — returns `0` on the last day of the month.

**Missing coverage they should name:**
- `daysRemainingInMonth`: last day → 0, first day, explicit date, leap year
- `prorateMonthlyPrice`: mid-month, invalid inputs throw, zero price, rounding edges

---

## Release gating — strong answer

| Gate | What runs |
| --- | --- |
| Every PR | Unit + API + E2E smoke (sign-up) |
| Pre-prod / nightly | Full API regression, E2E suite |
| Post-deploy | Synthetic smoke (optional) |

They should notice `ci.yml` only runs `test:unit` and propose adding `test:api` + Playwright job.

---

## AI observation rubric

| Strong | Weak |
| --- | --- |
| Prompts for edge cases, reviews output | Pastes whole files blindly |
| Uses AI to enumerate cases, writes assertions themselves | Can't explain generated test |
| Says where AI helps (boilerplate, coverage ideas) vs hurts (trust without verify) | "AI writes all our tests" |

---

## Scoring summary

| Area | Strong signal |
| --- | --- |
| Problem-solving | Failing test → diagnose → fix planted bug |
| Edge cases | Names quota boundary, empty transcript, flaky date test |
| Clean code | Readable tests, stable selectors, no duplication without reason |
| Communication | Narrates strategy before typing |
| Release confidence | Concrete CI proposal, not vague "more tests" |

## After the call

Reset `main` to seed commit for next candidate.
