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
