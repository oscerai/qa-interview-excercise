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

---

## Interview question bank

Pick 8–10 questions across the session — you don't need all of them.

### Must-ask (core)

| # | Question | What good sounds like |
| --- | --- | --- |
| 4 | What would you want green before you'd sign off a release? | Names edge cases before coding |
| 6 | Free user generates 10 notes, then tries an 11th. What should happen? Where do you test it? | 402 at API or unit boundary — not E2E |
| 9 | Walk me through your test strategy — unit vs API vs E2E, and why? | Pyramid: one job per layer |
| 13 | Bootstrap Playwright and write one sign-up test. | `data-testid`, `webServer`, narrates choices |
| 19 | Open `billing.test.ts` — which test is flaky and why? | `new Date()` — fails on last day of month |
| 21 | Open `ci.yml` — what's wrong with CI for release confidence? | Only unit runs; should add API + E2E smoke |

### Opening — prep & orientation (0–5 min)

1. Did prep go smoothly? Anything surprise you in the repo?
2. In one sentence — what does NoteForge do?
3. You have ~60 minutes and AI is fine. How do you want to spend the time?

*Listen for: they ran the repo, read the spec, have a plan.*

### Edge cases & problem framing (5–12 min)

4. **What would you want green before you'd sign off a release of this app?**
5. Read the business rules — **what's tested today vs what's missing?**
6. A free user generates 10 notes, then tries an 11th. **What should happen? Where would you test that?**
7. A user tries to generate with an **empty transcript**. What should happen to their quota?
8. Patient name is `"   "` (spaces only). **Is that valid? How would you verify?**

### Automation strategy & test pyramid (12–18 min)

9. **Walk me through your test strategy** — unit vs API vs E2E, and why?
10. Why is sign-up a good E2E candidate, but quota logic isn't?
11. We have Supertest and Vitest. **Why add Playwright? What does it give us that API tests don't?**
12. If you only had time for **three tests** before ship, which three and why?

### Live coding — Playwright E2E (18–28 min)

13. **Bootstrap Playwright** and write one test: free user signs up and sees success.
14. Why did you pick those selectors? What would break them?
15. How do you wire the dev server so CI can run this headless?

### Live coding — API & unit tests (28–42 min)

16. Write a test that proves a free user **cannot** generate an 11th note.
17. You found a bug — **walk me through report and fix.** (Failing test first?)
18. Missing `x-user-id` on `/sessions` — what status code? Which layer?
19. Open `src/billing.ts` and `tests/unit/billing.test.ts`. **Which test is flaky and why?**
20. **What test cases are missing** for those two functions?

### Release gating (42–50 min)

21. Open `.github/workflows/ci.yml`. **What's wrong with CI for release confidence?**
22. What runs on **every PR**? What's **nightly**? What runs **before production**?
23. A PR touches only sign-up CSS. **Do you still run the full API suite? Why?**
24. E2E is slow and sometimes flaky. **How do you keep confidence without blocking every PR for 20 minutes?**

### AI in QA (50–58 min)

25. You used AI today (or would have). **Where did it help, and where did you not trust it?**
26. A dev says "just have Copilot write all the tests." **What do you say?**
27. How would you use AI to **find edge cases** without unreviewed assertions?
28. **What would you never automate with AI** in a clinical context?

### Close (58–60 min)

29. If you joined tomorrow, **what's the first thing you'd add to this test suite?**
30. Any questions for us?

### Quick scoring

| Strong | Weak |
| --- | --- |
| Names edge cases before coding | Jumps to Playwright for quota |
| E2E = sign-up only | Can't explain pyramid |
| Failing test → fix bug | Fixes code without a test |
| Spots flaky date test | "All tests look fine" on billing |
| Concrete CI proposal | "Just run more tests" |
| AI as assistant, not autopilot | Pastes AI output unread |

## After the call

Reset `main` to seed commit for next candidate.
