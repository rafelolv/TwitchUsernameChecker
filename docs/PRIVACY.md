# Privacy

No application analytics, telemetry, accounts or backend. The app does not request
Twitch login, passwords, OAuth tokens or cookies.

- Explicit lookups send the nickname to `gql.twitch.tv` with `credentials: omit`.
  Twitch receives normal connection metadata, including IP address. Its service
  policies apply. Typing does not send lookup requests. Starting a list sends up to 100 names
  sequentially to the same endpoint, with no credentials. Stop checking aborts
  the current lookup and prevents remaining requests; a sent name cannot be unsent.
  Lists and results are kept only in the current page, never in storage.
- Searches are not saved. On load, the app removes the legacy `tuc:history:v1`
  localStorage key used by older versions without reading its contents. Storage
  failure does not stop lookups. No other stored data is cleared.
- The theme button saves only `light` or `dark` under `tuc:theme` in localStorage.
  Without a saved choice, the site follows your device. Storage failure does not
  prevent switching themes. No search data is stored with this preference.
- **Copy username** writes only the consulted name to the clipboard on request.
- Google Fonts loads typefaces from Google domains, which receive normal request
  metadata. Local fallback fonts work if those requests fail.
- GitHub Pages receives normal hosting request metadata. External GitHub/Twitch
  links contact those services separately when opened.

The app does not log raw responses or exceptions. Reports should omit private
names, personal history screenshots, cookies, authorization headers and tokens.
Use status labels and reproduction steps instead.
