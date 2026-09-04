# API tests

Test the **HTTP contract** — status codes, headers, request/response shape.

Use Supertest against `createApp()`. No browser.

## Belongs here

- Full session journey over HTTP: create → start → stop → generate → `201`
- Auth: missing `x-user-id` returns `401`
- Quota enforced at the wire: 11th generate returns `402`
- Validation errors return the correct status (`400`, `422`, `409`)

## Does not belong here

- `canGenerate()` arithmetic — that is unit
- Sign-up form rendering — that is E2E

## Release gate

API tests on every PR — fast, high confidence on HTTP contracts.

