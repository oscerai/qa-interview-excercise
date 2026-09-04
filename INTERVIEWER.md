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

## Session run sheet (~60 min)

| Time | Activity | Listen for |
| --- | --- | --- |
| 0–3 | Confirm prep worked. Quick tour of app. | Did they actually run it? |
| 3–10 | "What would you want green before we ship?" | Edge cases named before coding |
| 10–15 | Map gaps to pyramid layers | Correct layer assignment |
| 15–25 | Bootstrap Playwright, E2E sign-up | `webServer`, `data-testid`, not brittle CSS |
| 25–40 | API + unit tests, find planted bugs | Failing test before fix; quota at right layer |
| 40–48 | Release gating — walk through `ci.yml` | PR = unit+API+E2E smoke; nightly = full suite |
| 48–58 | Billing test review (`billing.test.ts`) | Flaky test + missing coverage |
| 58–60 | AI in QA — verbal | Thoughtful boundaries, not hype |

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
