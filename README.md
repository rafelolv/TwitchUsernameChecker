<p align="center">
  <img src="assets/logo.svg" width="88" height="88" alt="Twitch Username Checker logo" />
</p>

# Twitch Username Checker

Check a name before changing your Twitch username.

[**Open the checker**](https://rafelolv.github.io/TwitchUsernameChecker/)

![Twitch Username Checker showing an example result](docs/images/preview.png)

## How to use it

Enter a username and click **Check username**, or press Enter.
Use 4–25 letters, numbers or underscores.

- **Available:** no public account was found, or Twitch confirmed the name is free.
- **Unavailable:** an account already uses the name, or Twitch says it can't be used.

**Available doesn't always mean you can use it.** Twitch can hold names after a
rename, suspension or account deactivation. If the result says **Not confirmed by
Twitch**, we couldn't check whether the name is held.

Before choosing a name, sign in to Twitch and try it in
[Settings → Profile](https://www.twitch.tv/settings/profile).
This tool doesn't reserve names or tell you when they'll be released.

You don't need to sign in here, and searches aren't saved. The name you enter is
sent to Twitch when you run a check. See [privacy details](docs/PRIVACY.md).

## Found a problem?

[Open an issue](https://github.com/rafelolv/TwitchUsernameChecker/issues) with your
browser and what went wrong. Please leave out passwords, tokens and account details.

## Run locally

You'll need Node.js 24 and Python 3. There are no dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:5173. To run the checks, use another terminal:

```sh
npm run check
```

For changes to the project, see [Contributing](CONTRIBUTING.md),
[Maintenance](docs/MAINTENANCE.md) and [how the checks work](docs/AVAILABILITY.md).

## License

[MIT](LICENSE) · Made by [rafelolv](https://github.com/rafelolv).
Independent project, not affiliated with Twitch.
