<p align="center">
  <img src="assets/logo.svg" width="88" height="88" alt="Twitch Username Checker nameplate logo" />
</p>

# Twitch Username Checker

A small, independent Twitch nickname checker with an English
interface and a cream/purple identity. Built with HTML,
CSS and native JavaScript modules for GitHub Pages. No runtime npm dependencies,
application backend or login.

[**Open the checker ↗**](https://rafelolv.github.io/TwitchUsernameChecker/)

![Twitch Username Checker interface](docs/images/preview.png)

The custom nameplate mark combines a folded corner, username brackets and a mint
check. One vector is used across the site, favicon and this README. See
[branding](docs/BRANDING.md) for the source and palette.

## Using the checker

Enter a username and press **Check username** or Enter. The input caps typing and
pasting at 25 characters, with a live counter. Names must have 4–25 letters,
numbers or underscores. Searches are not saved.

## What it can confirm

| Result                              | Meaning                                                          |
| ----------------------------------- | ---------------------------------------------------------------- |
| Taken                               | Twitch returned an existing account.                             |
| Available · Not confirmed by Twitch | No public profile found; the name may still be reserved or held. |
| Available · Confirmed by Twitch     | Twitch explicitly confirmed availability.                        |
| Unavailable                         | Twitch explicitly rejected availability.                         |
| Failed / rate-limited               | The lookup failed or Twitch limited requests.                    |

**“Available” based on an absent profile is a best-effort label, not a guarantee.**
It appears in green with **“Not confirmed by Twitch”** and a visible warning.
Some names cannot be used after a rename, suspension or deactivation even when
no profile is visible. Twitch does not provide a precise public claimability
check. Confirm the name on Twitch before choosing it.

The **“Confirmed by Twitch”** field requires an actual positive
availability response. The internal GraphQL endpoint is unsupported and may block
that check with `IntegrityCheckFailed`. Failed requests are never labeled available.

To confirm a name, sign in to Twitch and try it in
[Settings → Profile](https://www.twitch.tv/settings/profile). Availability can change; this tool does not reserve names or predict release
dates. See [architecture](docs/ARCHITECTURE.md) and
[actual validation results](docs/VALIDATION.md).
The [availability investigation](docs/AVAILABILITY.md) compares the methods tested
with user-reported held and free names and explains why they can share a result.

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

Nicknames are sent directly to Twitch on explicit submission. Searches are not
saved. Old history from previous versions is removed when the page loads.
Fonts load from Google Fonts, with local fallbacks. There is no application telemetry.

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
