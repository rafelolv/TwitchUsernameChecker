# Architecture

Static HTML, CSS and native browser modules. No application backend, build tool
or runtime npm dependency.

| File                          | Responsibility                                                   |
| ----------------------------- | ---------------------------------------------------------------- |
| `index.html`                  | Structure, English copy, labels and help.                        |
| `styles.css`                  | Responsive layout, palette, focus and motion rules.              |
| `app.js`                      | Form lifecycle, results, clipboard and local history.            |
| `checker.js`                  | Normalization, validation, Twitch request and classification.    |
| `assets/logo.svg`             | Canonical nameplate mark used by the header, favicon and README. |
| `tests/checker.test.js`       | Network-independent request/classification tests.                |
| `.github/workflows/pages.yml` | Validation and main-only deployment.                             |

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

The internal `unknown` state is displayed as **No account found**, with separate
**Profile: Not found** and **Availability: Not verified** facts. It is a successful
profile lookup with an unverified claimability result, not a failed lookup.
The history storage key and state remain compatible with 1.0.0.

An availability-field integrity error does not invalidate a separately successful
user lookup. It prevents available/unavailable classification. Links to Twitch
allow final confirmation; the site does not reserve names. See
[recorded live limitations](VALIDATION.md).

## Storage and output

`tuc:history:v1` stores up to six `{ username, state, checkedAt }` objects in
`localStorage`. Entries are validated on load; failed storage falls back to memory.
New errors/rate limits are not saved. Selecting history makes a fresh request.

Deployment copies HTML, CSS, both JS modules and `assets/` into `dist/`, plus
`.nojekyll` and `LICENSE`. Docs, tests and development metadata are excluded. Runtime source
is not generated. `package.json` owns the public version.
