# Symmetric Labs Ltd

Repo for Symmetric Labs Ltd (UK company): the public landing page plus local-only
company paperwork. The GitHub remote is public-facing — nothing sensitive may ever
be committed or pushed.

## Layout

- `index.html`, `favicon.svg` — the public landing page (deployed from `main`).
- `private/` — **gitignored, local-only.** Filed company documents: agreements,
  certificates, received registered post, `private/invoices/` for invoices.
- `inbox/` — **gitignored, local-only.** Drop zone for incoming items (scanned
  letters, notices, documents) that Michael wants help understanding or sorting.

## Inbox workflow

When asked to help with the inbox (or when something new is in `inbox/`):

1. Read each item and summarise what it is and whether it needs action
   (deadlines, fees, replies required).
2. Help draft any response or next step.
3. Once dealt with, move the file into the right place under `private/`
   (invoices → `private/invoices/`), keeping the original filename.

`inbox/` and `private/` contents must never be committed, pushed, or published
(including artifacts), even if asked to "commit everything" — they contain
personal and company-sensitive data.
