# Twitch Username Checker

Maintained by rafelolv. Read [maintenance](docs/MAINTENANCE.md) and
[architecture](docs/ARCHITECTURE.md) before changing behavior.

- Keep the maintenance scope in README: simple and free, with no routine updates
  planned. The only planned future update depends on Twitch offering an official,
  more precise username-availability API. Do not promise a timeline or introduce
  a feature roadmap without the maintainer's instruction.
- Keep this a small static GitHub Pages site. Runtime code has no npm dependencies,
  remote executable code, telemetry or application backend.
- Use English for all project documentation, comments, user-facing text, metadata, and commit messages.
  Discuss work with the maintainer in Portuguese.
- Write natural, friendly English. Use short, practical messages; avoid marketing
  slogans, artificial urgency, unnecessary jargon and forced slang.
- Maintain `main` and canonical links to `rafelolv/TwitchUsernameChecker` and its
  issues. For requested commits, use repository-local Git identity
  `Rafael <82127878+rafelolv@users.noreply.github.com>`. Preserve history and do not
  add co-authors automatically.
- Preserve the MIT license and copyright/permission notices. Keep `package.json`
  license metadata consistent and include `LICENSE` in the deployed static files.
- Edit root HTML/CSS/JS and `assets/` directly. Do not introduce frameworks or a
  build pipeline without a concrete need. `dist/` is disposable deployment output.
- Preserve the cream/purple identity, one primary search, restrained decoration,
  explicit labels, keyboard access, visible focus, live result announcements,
  reduced motion and narrow layouts. Keep shared colors in CSS variables.
- Follow the browser/system theme with `prefers-color-scheme`. Keep both themes
  readable, including result warnings, input focus and error states. The header
  toggle can override the system theme; store only light/dark under `tuc:theme`.
  Apply the theme before styles paint and keep changes reload-free. The search
  card has no decorative drop shadow.
- `assets/logo.svg` is the canonical custom @/check mark for the header, favicon and
  README. Preserve the drawn @ spiral and its green check-shaped tail; do not
  maintain independently drawn copies or replace it with a font character/tile.
  Keep its light/dark SVG colors readable at favicon size.
- The username input must enforce its native 25-character maximum while typing
  and pasting. Keep the counter synchronized and retain request-side validation.
- `checker.js` owns requests and classification. Only a successful availability
  boolean with a confirmed absent user permits `available` or `unavailable`.
  Missing profiles, HTTP errors, timeouts and integrity challenges never prove
  availability. Preserve `unknown`, `error` and `rate-limited` states. An absent
  profile with blocked availability displays “Available”, accompanied by
  “Not confirmed by Twitch” and an always-visible reservation/accuracy warning.
  This is a user-requested presentation fallback; keep its internal `unknown`
  state and never describe it as confirmed. Use clear green for Available and red
  for Unavailable, with a uniform thin outline and no status dots or decorative
  side stripes. Keep these result colors in shared CSS variables. Use only Available/Unavailable
  for availability outcomes; request errors remain distinct. Do not restore the
  “What the results mean” section.
  Errors must not become available. Link confirmation to Twitch Settings → Profile
  and explain that the visitor needs to sign in there.
- Twitch GraphQL is internal and unsupported. Do not bypass integrity checks,
  embed credentials, promise availability or predict name-release dates. A proxy
  alone does not solve the integrity restriction.
- Validate before requests. Preserve one lookup in flight, the 12-second timeout
  and an explicit action per lookup or list. A user-started list may contain up to
  350 names, validated before any request and deduplicated. Keep one request in
  flight across both modes, start the next name when the previous response is
  handled without an artificial pause, allow immediate cancellation and stop the queue on errors or rate limits. No background scans,
  polling, automatic retries or saved lists. Allow an explicit Continue remaining
  action after cancellation/failure: retain completed results, query only pending
  or failed names, replace failed rows without duplicates and stop again on error.
  Keep the pending snapshot in memory only; edits, clearing or a new submission
  discard it. Remind visitors to wait after a rate limit.
- Keep list results compact: counters/filters, 20-row pages, stable focus and scroll
  during streaming, and visible unconfirmed labels. Copy available names includes
  completed available/unknown results across pages, with a confirmation reminder;
  never copy failed or unchecked names as available.
- Render through DOM/text APIs, never dynamic HTML parsing. Do not save searches
  or reintroduce recent-search UI. Remove only the legacy `tuc:history:v1` key on
  load; tolerate unavailable storage. Do not log raw API bodies or exceptions.
- Never store, print or commit credentials or cookies. Keep
  [privacy](docs/PRIVACY.md) accurate when external requests or storage change.
- Run `npm run check` after changes. For UI/integration changes, also check the
  actual page in a temporary browser profile. Record mocked and live evidence
  separately in [validation](docs/VALIDATION.md); tests do not prove live support.
- `package.json` is the sole public version source. Start at `1.0.0` and use
  three-part semver. Published app changes require a new version; documentation
  changes do not. Write concise English changelog bullets with validation and
  limitations separately. Never describe unreleased work as released.
- Pull requests validate only. Pages deploys `main` after checks on pushes or
  manual runs, with write permissions scoped to the deploy job. Website deployment
  is separate from tagged releases. Never move published tags or replace artifacts.

These rules adapt maintenance conventions from AdBonk, Wipecord and Treco. Their
extension code, store permissions and branding do not apply to this project.
