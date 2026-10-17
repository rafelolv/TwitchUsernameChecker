# Architecture

Static HTML, CSS and native browser modules. No application backend, build tool
or runtime npm dependency.

| File                          | Responsibility                                                        |
| ----------------------------- | --------------------------------------------------------------------- |
| `index.html`                  | Structure, English copy, labels and help.                             |
| `theme.js`                    | Early theme selection, system preference and the header toggle.       |
| `styles.css`                  | Responsive layout, palette, focus and motion rules.                   |
| `app.js`                      | Single/list form lifecycle, results, clipboard and history cleanup.   |
| `checker.js`                  | Normalization, validation, Twitch requests, queue and classification. |
| `assets/logo.svg`             | Canonical @/check mark used by the header, favicon and README.        |
| `tests/checker.test.js`       | Network-independent request/classification tests.                     |
| `.github/workflows/pages.yml` | Validation and main-only deployment.                                  |

Submission trims a leading `@`, lowercases and validates the name before access.
The input uses native `maxlength="25"` to cap typing/pasting and a visible
character counter. Request validation still rejects out-of-range values supplied
programmatically or directly to the checker.
`app.js` prevents concurrent lookups and aborts after 12 seconds. Editing hides
stale results. Runtime content is inserted through DOM/text APIs.

## Twitch boundary

`checker.js` POSTs to `https://gql.twitch.tv/gql` with the public web-client
identifier and `credentials: omit`. This is an unsupported internal endpoint,
not the official Helix API. No login, token or client secret is used.

| State          | Required evidence                                                        |
| -------------- | ------------------------------------------------------------------------ |
| `taken`        | User object with a string ID and no user-field/global error.             |
| `available`    | Explicit `user: null` and availability `true`, without relevant errors.  |
| `unavailable`  | Explicit `user: null` and availability `false`, without relevant errors. |
| `unknown`      | Explicit absent user without a successful availability boolean.          |
| `error`        | Missing/failed lookup, failed request, invalid JSON or timeout.          |
| `rate-limited` | HTTP 429; no automatic retry.                                            |

The internal `unknown` state uses the user-requested **Available** display label,
in a green result panel, with **Profile: Not found**, **Availability: Not confirmed by Twitch**
and an always-visible warning about reserved/held names and imprecise lookup.
This is a best-effort presentation fallback, not evidence of claimability.
The two visible availability outcomes are **Available** and **Unavailable**;
existing accounts also use Unavailable with an In use fact. Errors stay separate.
Only a true response shows **Confirmed by Twitch**. Available uses green and
Unavailable uses red, with shared CSS variables and uniform thin outlines.
No status dots or side stripes are used. The result guide has been removed. Confirmation links go to Twitch Settings → Profile
and require signing in to Twitch. Errors never
enter this fallback.
See [the availability investigation](AVAILABILITY.md) for tested approaches.

An availability-field integrity error does not invalidate a separately successful
user lookup. It prevents available/unavailable classification. Links to Twitch
allow final confirmation; the site does not reserve names. See
[recorded live limitations](VALIDATION.md).

## Storage and output

Searches are not persisted and there is no recent-search UI. On load, `app.js`
removes the legacy `tuc:history:v1` key without reading saved values. Storage
exceptions are ignored; the checker does not depend on storage.

Deployment copies HTML, CSS, the runtime JS files and `assets/` into `dist/`, plus
`.nojekyll` and `LICENSE`. Docs, tests and development metadata are excluded. Runtime source
is not generated. `package.json` owns the public version.

## Theme

`theme.js` runs before the stylesheet. It applies a validated `tuc:theme` choice
(light/dark), or follows `prefers-color-scheme` when no choice is saved. The header
sun/moon button changes the theme and remembers the override. Blocked storage
falls back to memory. System changes apply automatically until a manual override.
CSS variables use the root `data-theme`; no reload is needed. The early script
also updates browser theme-color, while color-scheme styles native controls and
the shared SVG logo. Include `theme.js` in Pages and release packages.

## List checks

The secondary “Check a list” disclosure accepts up to 100 names separated by
whitespace or commas. All entries must pass the same 4–25 character validation
before any request is sent. Case-insensitive duplicates are checked once; the
100-entry limit applies before deduplication. No entry is silently truncated.

`checker.js` runs a user-started sequential queue without an artificial pause
between requests, with the same 12-second per-request timeout and no retries. Both forms share
a busy lock, so they cannot overlap. Stop aborts the active request;
completed rows stay visible. Any lookup error or rate limit stops the queue and
leaves remaining entries unchecked. Each row preserves the existing internal
classification, with a visible “Not confirmed by Twitch” label for unknown names
and an always-visible shared reservation warning. Lists and results stay in memory
only. Closing the disclosure does not cancel a running list; use Stop checking.
