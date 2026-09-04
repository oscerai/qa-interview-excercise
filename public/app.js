const form = document.querySelector('[data-testid="signup-form"]');
const successEl = document.querySelector('[data-testid="signup-success"]');
const errorEl = document.querySelector('[data-testid="error-message"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  successEl.hidden = true;
  errorEl.hidden = true;

  const data = new FormData(form);
  const id = String(data.get('userId') ?? '').trim();
  const plan = String(data.get('plan') ?? '');

  try {
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, plan }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error ?? `Sign up failed (${res.status})`);
    }

    successEl.textContent = `Signed up as ${body.id} (${body.plan})`;
    successEl.hidden = false;
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});
