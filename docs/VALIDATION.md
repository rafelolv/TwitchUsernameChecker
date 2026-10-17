# Validation

## Initial implementation — 2026-10-16

Local evidence, before publication:

- Five unit tests passed: normalization/validation, explicit availability,
  partial GraphQL errors/integrity challenges, HTTP 429, failed HTTP/JSON,
  abort propagation and credential omission. JavaScript syntax checks passed.
- Google Chrome 154.0.8037.97, headless Linux, temporary Playwright context:
  desktop 1440×1100 and mobile viewport 375×812. Simulated responses exercised
  taken/available/unavailable/unknown, invalid input, history after reload,
  fresh history queries, clearing and stale-result hiding. No JS errors or
  mobile horizontal overflow were observed. Screenshots were visually inspected.
- Separate live Chrome queries returned `taken` for `twitch` and `unknown` for
  `tuc_oct16_739152`. The endpoint returned `user: null` and
  `IntegrityCheckFailed` on availability for the latter name.

Limitations:

- Available/unavailable states were tested with simulated responses only. Live
  automatic distinction between free and withheld names was not confirmed.
- Browser automation was temporary, outside the project; it is not a committed
  browser test suite or a command run by CI.
- No Firefox, Safari, physical phone, screen-reader, signed-in Twitch rename,
  account registration or hosted Pages check was performed.
- No push, deployment verification or tagged release was performed. Live results
  are point-in-time observations, not a service guarantee.

## Maintenance standardization — 2026-10-16

- Added agent rules, maintenance/architecture/privacy guides, contribution
  templates and a changelog adapted from the maintainer's three projects.
- Standardized `npm run check` to include syntax checks and all unit tests.
- Separated read-only validation from main-only deployment; pull requests have
  no Pages publishing permissions.
- Runtime/UI behavior is unchanged. Browser/live evidence above is historical;
  these changes do not imply a new browser or Twitch check.
- `npm run check` passed; a direct unit run also reported all five cases passing.
- All 21 relative documentation links and local HTML asset paths resolved.
  Workflow and issue-template YAML parsed successfully; inspection confirmed
  read-only validation, deployment depending on checks and main-only deployment.
- A temporary static package was assembled successfully with only runtime files,
  assets and `.nojekyll`. This is local packaging evidence, not an Actions run.
- GitHub Actions execution and hosted deployment remain unverified until run on
  GitHub. The workflow has not been validated by GitHub's own runner.

## Release 1.0.0 publication — 2026-10-16

- Pushed the initial commit `73a1a9a` to `main` and an annotated `v1.0.0` tag.
- The [release workflow](https://github.com/rafelolv/TwitchUsernameChecker/actions/runs/38995231719)
  completed successfully, including validation and publication of the static ZIP
  and `SHA256SUMS`.
- Downloaded both assets from the
  [published release](https://github.com/rafelolv/TwitchUsernameChecker/releases/tag/v1.0.0).
  The checksum passed, the ZIP was byte-identical to the validated local package,
  and every runtime file and the MIT license matched the canonical source.
- The [initial Pages run](https://github.com/rafelolv/TwitchUsernameChecker/actions/runs/38995130457)
  passed checks but failed deployment configuration because Pages was disabled.
  Enabling GitHub Actions as the Pages source and a new deployment are pending.
- No published tags, release assets or release notes were replaced. Hosted browser
  testing remains pending; the earlier local live-query limits still apply.

## Hosted Pages verification — 2026-10-16

- The maintainer selected GitHub Actions as the repository's Pages source.
- The [subsequent Pages run](https://github.com/rafelolv/TwitchUsernameChecker/actions/runs/38995646118)
  completed successfully. The hosted site at
  [rafelolv.github.io/TwitchUsernameChecker](https://rafelolv.github.io/TwitchUsernameChecker/)
  returned HTTP 200.
- Chrome 154.0.8037.97, headless Linux, temporary context: loaded the hosted page
  at 1440×1000, queried `twitch` live and received `taken`. At mobile viewport
  375×812, queried `tuc_oct16_739152` live and received `unknown`. No JavaScript
  errors or horizontal overflow were observed. Desktop/mobile captures were saved
  temporarily outside the repository.
- Main pushes run checks and deploy automatically; pull requests validate only.
  No suggested Jekyll/Static HTML workflow or custom domain is needed.
- The availability restriction remains: this live test did not establish free
  versus withheld names. Firefox/Safari, physical devices, screen readers and
  signed-in Twitch registration/rename remain untested. The release tag and its
  assets remain unchanged.

## 1.0.1 profile-result clarity and English interface — 2026-10-16

- Reproduced the reported `falsiqdsaadsddsfffdsgdfg` lookup against Twitch:
  `user: null`, `isUsernameAvailable: null`, and an availability-field
  `IntegrityCheckFailed` response. The profile lookup succeeded; availability
  remained unverified.
- The internal `unknown` state now displays “No account found”, with separate
  “Profile: Not found” and “Availability: Not verified” facts. Failed lookups do
  not display a successful absent-profile fact. The existing history key/schema
  remains compatible with 1.0.0.
- Translated page copy, metadata, validation, timestamps, history, actions and
  accessibility labels to English. Updated project rules to require English for
  all documentation, comments, user-facing text, metadata and commit messages.
- Six unit cases and syntax checks passed, including a regression using the
  reported username and actual response shape.
- Chrome 154.0.8037.97, headless Linux, temporary context: local simulated tests
  covered all six result states, separate facts, English validation, Enter submit,
  old saved history, fresh queries, clearing and 320/375/768/1440px viewports.
  No JavaScript errors or horizontal overflow were observed. Desktop/mobile
  screenshots were inspected visually.
- Separate local live queries returned “No account found” for the reported name
  and “Taken” for `twitch`. Actual claimability was not confirmed; registration,
  signed-in renaming, Firefox/Safari and physical devices remain untested.
- Pushed `a773165` to `main`; the
  [1.0.1 Pages workflow](https://github.com/rafelolv/TwitchUsernameChecker/actions/runs/38996727668)
  completed successfully. The public page serves `lang="en"`.
- Repeated the six-state simulated browser matrix on the hosted page, including
  old history, keyboard submission and all four viewport widths. The live reported
  username displayed “No account found”, “Profile: Not found” and “Availability:
  Not verified”; `twitch` displayed “Taken”, “Profile: Found” and “Availability:
  Taken”. No JS errors or horizontal overflow were observed.
- Version 1.0.1 is deployed to Pages. The published v1.0.0 GitHub release tag and
  downloadable assets remain unchanged; this patch did not create a new tag.

## 1.0.2 branding and input limits

- Replaced the generic @ tile with the canonical `assets/logo.svg` nameplate
  mark shared by the header, favicon and README. Added branding guidance and an
  actual interface capture at `docs/images/preview.png`.
- Added the input's native 25-character maximum and a synchronized visible counter.
  Request-side length validation is unchanged.
- `npm run check` passed. Chrome 154.0.8037.97, headless Linux, disposable context:
  typing 30 characters and actual clipboard pasting beyond the limit both stopped
  at 25. Delete/retype, clear and selecting a saved 25-character name updated the
  counter correctly. Simulated lookup and logo/favicon loading passed.
- Viewports 320/375/768/1120px had no horizontal overflow or JS errors. Desktop
  and mobile screenshots were inspected. Tests use temporary browser automation
  outside the repository; the production app still has no npm dependencies.
- Pushed `e8f2b3e` to `main`; the
  [1.0.2 Pages workflow](https://github.com/rafelolv/TwitchUsernameChecker/actions/runs/38997718732)
  completed successfully. The public page serves the new logo and native input
  maximum.
- Repeated the browser matrix on the hosted site: shared logo/favicon loading,
  typing/pasting beyond 25, delete/retype/clear counters, saved maximum-length
  history and all four viewports passed without JS errors or overflow.
- No new live Twitch availability test was required; the integration and existing
  availability restriction are unchanged. Published release tags/assets remain
  intact; version 1.0.2 is deployed to Pages without creating a new tag.

## 1.0.3 English copy edit

- Replaced promotional slogans and urgency with short, conversational page,
  help and result text. Added the tone guideline to AGENTS.md and refreshed the
  README interface capture. Classification and request behavior are unchanged.
- Syntax/unit checks passed. One local Chrome smoke check covered the revised
  page, an absent-profile result, a 320px viewport and no JavaScript errors.
- No new live Twitch or full browser matrix was run for this copy-only change.

## 1.0.4 availability investigation and fallback — 2026-10-17

- Compared the maintainer-reported held `Falsiq` and claimable `Falsiqkdkdk34`.
  Current GraphQL and the persisted signup validator returned null availability
  with `IntegrityCheckFailed` for both. Legacy passport lookup returned 404 for
  both; the historical userOrError field was absent and introspection disabled.
- A fresh native signup page showed an email-first form, not a username field.
  No personal data was entered and no registration or username change was made.
  See [the full investigation](AVAILABILITY.md) for evidence and limitations.
- Preserved internal classification. Unconfirmed absent-profile lookups display
  amber “Possibly available” with an always-visible reservation warning and a
  signup link. Confirmed availability remains green; failed lookups never use
  the fallback. This does not establish which of the two names can be claimed.
- Syntax/unit checks passed. One temporary Chrome 154.0.8037.97 local smoke run
  checked the fallback warning, true/false availability, failed lookup, signup
  destination and 320px layout without JS errors. Separate live queries of both
  names showed the unverified fallback and visible warning. README preview updated.
- No signed-in rename, completed registration, personal browser profile, account
  change or bypass of integrity checks was involved.

## 1.0.5 requested Available fallback — 2026-10-17

- At the maintainer's request, absent-profile lookups with unconfirmed
  claimability now display “Available”, with “Not confirmed by Twitch” and an
  always-visible warning about reservations and the lack of a precise public
  availability check. Internal classification and error handling are unchanged.
- Syntax/unit checks passed. A targeted local Chrome smoke check verified the
  new label and warning, confirmed true/false results, failed lookups, signup link
  and 320px layout without JS errors. README preview refreshed. No new live API
  investigation was run for this presentation-only change.
