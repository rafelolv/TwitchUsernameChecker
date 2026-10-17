# Privacy

No application analytics, telemetry, accounts or backend. The app does not request
Twitch login, passwords, OAuth tokens or cookies.

- Explicit lookups send the nickname to `gql.twitch.tv` with `credentials: omit`.
  Twitch receives normal connection metadata, including IP address. Its service
  policies apply. Typing does not send lookup requests.
- Up to six names, result states and timestamps are saved under `tuc:history:v1`
  in this origin's `localStorage`. This is not encrypted or secret storage.
  Other same-origin scripts can access it; GitHub Pages project paths share the
  `rafelolv.github.io` origin.
- **Limpar histórico** removes saved history and the in-memory list. It does not
  clear the current result, clipboard or third-party server logs.
- **Copiar nickname** writes only the consulted name to the clipboard on request.
- Google Fonts loads typefaces from Google domains, which receive normal request
  metadata. Local fallback fonts work if those requests fail.
- GitHub Pages receives normal hosting request metadata. External GitHub/Twitch
  links contact those services separately when opened.

The app does not log raw responses or exceptions. Reports should omit private
names, personal history screenshots, cookies, authorization headers and tokens.
Use status labels and reproduction steps instead.
