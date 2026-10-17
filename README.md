# Twitch Username Checker

A small, independent Twitch nickname checker with a Brazilian Portuguese
interface, a cream/purple identity and local search history. Built with HTML,
CSS and native JavaScript modules for GitHub Pages. No runtime npm dependencies,
application backend or login.

## What it can confirm

| Result                | Evidence                                                         |
| --------------------- | ---------------------------------------------------------------- |
| Taken                 | Twitch returned an existing account.                             |
| Available             | No account and an explicit successful availability response.     |
| Unavailable           | No account and an explicit successful rejection of availability. |
| Unconfirmed           | No account, but Twitch did not allow availability confirmation.  |
| Failed / rate-limited | The lookup failed or Twitch limited requests.                    |

**A missing profile does not mean a free name.** This app uses Twitch's
unsupported internal GraphQL endpoint. During initial live checks, profile
lookup worked, but availability returned `IntegrityCheckFailed`. The app shows
**“Não confirmado”** in that case and links to Twitch for final confirmation.
It does not bypass integrity checks. A proxy alone does not remove that restriction.

Only Twitch registration or username editing can confirm that you can claim a
name. Availability can change; this tool does not reserve names or predict release
dates. See [architecture](docs/ARCHITECTURE.md) and
[actual validation results](docs/VALIDATION.md).

## Run locally

Use Node.js 24 (`.nvmrc`) for checks and Python 3 for the local server. There are
no dependencies to install and no build step.

```sh
npm run dev
```

Open `http://127.0.0.1:5173`. Serve over HTTP; browser modules do not work through
`file://`.

```sh
npm run check
```

This checks JavaScript syntax and runs all unit tests. `npm test` runs tests only.
Tests use simulated network responses; they do not prove live Twitch compatibility.

## Deploy to GitHub Pages

GitHub Pages supports this static site on GitHub Free when the repository is
public. No paid domain or application server is required. See
[GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

1. Push the files to `main` in `rafelolv/TwitchUsernameChecker`.
2. Choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Validate and publish GitHub Pages**, or push another change to `main`.
4. Verify the workflow's deployment result and URL.

Expected URL after successful deployment:
`https://rafelolv.github.io/TwitchUsernameChecker/`.

Pull requests validate only. Main pushes and manual runs on main deploy after
checks pass. Only runtime files are uploaded; asset paths are relative so the
site works under the repository subpath. A future rename should update canonical
links and documented URLs. Authorized version tags publish validated release ZIPs
and checksums through a separate workflow; no store publishing is configured.

## Privacy

Nicknames are sent directly to Twitch on explicit submission. The six most recent
lookups are saved only in this browser's local storage; they can be cleared.
Selecting history always performs a new lookup. Fonts load from Google Fonts,
with local fallbacks. There is no application telemetry.

See [privacy and external requests](docs/PRIVACY.md) for hosting, storage and
clipboard details. Do not put credentials or private history into issue reports.

## Project guides

- [Agent rules](AGENTS.md) and [contributing](CONTRIBUTING.md).
- [Maintenance, versions and deployment](docs/MAINTENANCE.md).
- [Architecture and classification rules](docs/ARCHITECTURE.md).
- [Validation and known limits](docs/VALIDATION.md).
- [Changelog](CHANGELOG.md).
- [Report a problem](https://github.com/rafelolv/TwitchUsernameChecker/issues).

Maintenance conventions are adapted from rafelolv's AdBonk, Wipecord and Treco;
their runtime code, branding and extension/store workflows are separate.

Twitch references: [official Get Users API](https://dev.twitch.tv/docs/api/reference/#get-users),
[account creation](https://help.twitch.tv/s/article/creating-an-account-with-twitch?language=en_US)
and [username policy](https://help.twitch.tv/s/article/username-rename-and-recycling-policies?language=en_US).

## License

[MIT](LICENSE) — Copyright (c) 2026 Rafael (rafelolv). Use, modification,
redistribution and commercial use are permitted under the license's terms,
including preservation of the copyright and permission notices.

Maintained by [rafelolv](https://github.com/rafelolv). Independent project, not
affiliated with Twitch.
