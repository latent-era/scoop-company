# 2026-10-16 — forwards restored, Meta pixel removed

**PENDING VAULT SYNC.** `docs/APP_JOURNAL.md` asks for this to live in the Crete
Obsidian vault at `Work/scoop-company/journal.md`. That vault is not on this
machine: `CRETE_VAULT_ROOT` is unset and the documented path
(`/Users/muzidube/...`) does not exist here. This file is the repo handoff in
its place and should be copied into the vault by whoever has it.

Branch `main`. Merge commit `91576d8`, built on `0c3b622` from GitHub.

## Why

Winston reported that Scoop Movies on thescoopcompanyevents.co.uk was reachable
again when it should forward to the new site.

Cause: five commits sat unpushed on his Mac, two of which were the forwarding
work (`2d1cfcb` 6 Oct, cinema; `c5f4f36` 10 Oct, every page). On 13 Oct at
16:40:33 `0c3b622` ("docs(infra): record app journal workflow (#1)") landed on
GitHub `main` and triggered a production deploy three seconds later, built from
GitHub's copy, which had never carried the forwards. That deploy put the whole
old site back: `/`, `/cinema`, `/menus`, `/careers`, `/cart-hire` and
`/wholesale` were all returning 200 with pre-migration content.

## Changes

- Merged `origin/main` into local `main` (clean, no conflicts), then pushed all
  six commits so the repo, GitHub and production finally agree.
- Removed the Meta pixel from this site entirely: loader and `<noscript>` beacon
  out of `app/layout.tsx` (and the now-unused `next/script` import), plus the
  guarded `fbq` calls in `app/success/page.tsx` (Purchase),
  `components/TicketFormSection.tsx` and `components/yule-log/OrderForm.tsx`
  (both InitiateCheckout). Pixel `547108697873362` is shared with
  thescoopcompany.co.uk, and two sites firing one pixel made the figures
  unreadable.

## Verified

- `npx tsc --noEmit` clean; `npm run build` clean.
- Live after deploy: every forwarded path returns 307/308 to its
  thescoopcompany.co.uk counterpart; no `connect.facebook.net` or `facebook.com/tr`
  left in any served HTML.

## Unresolved

- `/api` and `/admin` still run here on purpose, so late Stripe webhooks for old
  orders are not lost. `ORDER_NOTIFY_FROM` on Vercel may still be a
  `@thescoopcompanyevents.co.uk` address, which Resend now rejects (domain
  removed, 10-domain cap) — order notification mail from this site would fail
  silently. Not checked, needs someone with the Vercel env.
- Old Stripe tills (`create-checkout-session`, `create-gelato-cake-checkout`,
  `create-yule-log-checkout`) still exist behind the forwards. Nothing links to
  them now, but they are not disabled.

## Next

Decide whether to retire `/api` and `/admin` once no further Stripe events are
expected for pre-migration orders.
