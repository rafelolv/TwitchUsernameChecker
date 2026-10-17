# Maintenance

Read [AGENTS.md](../AGENTS.md). Maintain
[rafelolv/TwitchUsernameChecker](https://github.com/rafelolv/TwitchUsernameChecker)
on `main`. Keep the source readable and the site static.

## Development

Use Node.js 24 (`.nvmrc`) and Python 3 for the optional local server. There are no
npm dependencies to install and no build step.

```sh
npm run dev
npm run check
```

Open `http://127.0.0.1:5173`. Browser modules require HTTP, not `file://`.
`npm run check` checks syntax and runs all unit tests; `npm test` runs tests only.
Use the same check locally and in CI. Edit root HTML/CSS/JS and `assets/` directly.

For API changes, reproduce the response and add targeted classification tests.
Never infer availability from an absent profile or integrity error. For UI
changes, check keyboard submit, validation, loading, results, copying,
clearing and narrow layouts in a disposable browser profile. Simulate responses
for deterministic states and make limited live queries separately. Record actual
checks, browsers and untested cases in [validation](VALIDATION.md).

## Versions and changes

Keep focused changes and update affected docs. `package.json` owns the version:
patch for compatible fixes, minor for compatible features, major for breaking
changes. Documentation-only changes need no bump. Before the first publication,
keep `1.0.0` and record work under Unreleased in [CHANGELOG.md](../CHANGELOG.md).
For subsequent published app changes, advance the version. Date release entries
only after verification; preserve historical entries.

## Pages deployment

1. Enable **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push prepared changes to `main`, or run **Validate and publish GitHub Pages**
   manually against `main`.
3. The read-only `check` job must pass. Pull requests run only this job. The deploy
   job copies runtime files and `LICENSE` into `dist/`; docs and tests are excluded.
4. Verify the Actions deployment result and its exact URL, then check assets and
   a lookup on the hosted site before reporting live behavior.

Expected URL after successful deployment:
`https://rafelolv.github.io/TwitchUsernameChecker/`. A workflow file or local
HTTP check is not evidence of deployment. Keep runtime paths relative for the
repository subpath. Renaming requires updating repository/support links and
documented URLs; GitHub determines the actual deployment URL.

Tagged releases use `.github/workflows/release.yml` on new `v*` tags. Push a
version tag only when release publication is authorized. Prepare the version,
changelog and `docs/releases/<tag>.md` first. The read-only validation job verifies
the tag, runs checks and packages the static ZIP plus `SHA256SUMS`; its dependent
publishing job alone receives `contents: write`. Verify the release and downloaded
assets after publication. Never reuse published tags or replace their artifacts.
No store automation is configured.

## Shared conventions

Adapted from [AdBonk](https://github.com/rafelolv/AdBonk/blob/main/AGENTS.md),
[Wipecord](https://github.com/rafelolv/Wipecord/blob/main/AGENTS.md) and
[Treco](https://github.com/rafelolv/Treco/blob/main/AGENTS.md): English docs,
repository-local Git identity, canonical sources, one version source, one check
command and explicit validation limits. All project text, including the UI and
metadata, uses English. Extension and store workflows remain specific to those projects.
