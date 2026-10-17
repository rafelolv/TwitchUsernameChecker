# Twitch Username Checker

Maintained by rafelolv. Read [maintenance](docs/MAINTENANCE.md) and
[architecture](docs/ARCHITECTURE.md) before changing behavior.

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
- `assets/logo.svg` is the canonical nameplate mark for the header, favicon and
  README. Preserve its cut corner, brackets and mint check; do not maintain
  independently drawn copies or replace it with a generic character/tile.
- The username input must enforce its native 25-character maximum while typing
  and pasting. Keep the counter synchronized and retain request-side validation.
- `checker.js` owns requests and classification. Only a successful availability
  boolean with a confirmed absent user permits `available` or `unavailable`.
  Missing profiles, HTTP errors, timeouts and integrity challenges never prove
  availability. Preserve `unknown`, `error` and `rate-limited` states. An absent
  profile with blocked availability displays plain “Available”, accompanied by
  “Not confirmed by Twitch” and an always-visible reservation/accuracy warning.
  This is a user-requested presentation fallback; keep its internal `unknown`
  state and never describe it as confirmed. Keep results neutral: no colored
  panels, status dots or decorative side stripes. Use only Available/Unavailable
  for availability outcomes; request errors remain distinct. Do not restore the
  “What the results mean” section.
  Errors must not become available. Link confirmation to Twitch Settings → Profile
  and explain that the visitor needs to sign in there.
- Twitch GraphQL is internal and unsupported. Do not bypass integrity checks,
  embed credentials, promise availability or predict name-release dates. A proxy
  alone does not solve the integrity restriction.
- Validate before requests. Preserve one lookup in flight, the 12-second timeout
  and an explicit action per lookup. No bulk scans, polling or automatic retries.
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
