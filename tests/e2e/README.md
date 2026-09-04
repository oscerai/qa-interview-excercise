# E2E tests

**You create this folder** when you bootstrap Playwright during the interview.

## One job

Test **what the user sees and clicks** in a real browser.

## Setup hint

```bash
npm init playwright@latest
# Set webServer.command to "npm run dev"
# Set webServer.url to "http://localhost:3000"
```

## Belongs here

- Sign-up form: fill → submit → success message
- User-visible validation (required fields)

## Does not belong here

- Quota logic, session lifecycle, status codes — use unit or API

## Release gate

E2E smoke (sign-up) on every PR. Broader UI regression nightly if the app grows.
