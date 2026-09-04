# Unit tests

Test **business rules** in isolation — no HTTP, no browser.

Call functions from `src/` directly. Fast, deterministic, no network.

Folders:
- `quota.test.ts`, `session.test.ts` — app domain rules
- `billing.test.ts` — billing math (Part 2 review)

## Belongs here

- Quota boundary: does `canGenerate('free', 10)` return the right answer?
- Session state machine: is `draft → ready` rejected?
- Validation: does `createSession` reject whitespace-only names?
- Side effects: does a failed `generateNote` leave quota unchanged?

## Does not belong here

- Status codes (`401`, `402`) — that is API
- Clicking the sign-up button — that is E2E

## Release gate

Unit tests on every PR — fastest feedback on business rules.

