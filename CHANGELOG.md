# Changelog

Versions follow three-part semver; `package.json` is the version source.
Entries remain Unreleased until publication is verified.

## 1.0.4

- Show unconfirmed absent-profile lookups as amber “Possibly available”, with an
  explicit reservation warning and a link to Twitch signup.
- Keep green “Available” exclusive to confirmed availability responses.
- Document the live investigation of held versus claimable names.

## 1.0.3

- Simplify page and result copy with more natural English, shorter help text and
  no promotional slogans or urgency. Username checks and status rules are unchanged.

## 1.0.2

- Replace the generic @ tile with a custom nameplate mark shared by the header,
  favicon and README.
- Cap username entry at 25 characters and show a live character counter.
- Add an interface preview and branding guidance to the README and project docs.

Validation:

- Syntax/unit checks and hosted Chrome checks passed, including typing/pasting
  beyond 25 characters, counter updates, saved history and responsive layouts.
- Pages deployment completed successfully. Twitch's availability limitation is
  unchanged.

## 1.0.1 — 2026-10-16

- Show successful absent-profile lookups as “No account found”, with profile and
  availability facts displayed separately.
- Translate the entire interface, validation messages and metadata to English.
- Require English for all project text in agent and contribution rules.

Validation:

- Six unit cases and syntax checks passed. Hosted Chrome checks covered all six
  states, legacy history and 320–1440px layouts without JavaScript errors.
- The live reported username returned “No account found”; `twitch` returned
  “Taken”. Pages deployment completed successfully.

Limitations:

- Twitch still blocks the availability field with an integrity challenge. A
  successful absent-profile lookup does not establish that a name can be claimed.

## 1.0.0 — 2026-10-16

- Add a Portuguese nickname checker with a responsive cream/purple interface.
- Identify existing Twitch profiles and distinguish explicit availability,
  unavailability and unconfirmed responses.
- Keep six recent searches locally, with fresh lookups and history clearing.
- Add maintenance guides, contribution templates and pull-request validation.
- License the project under MIT and include the license in the Pages output.

Validation:

- Initial unit/syntax checks and Chrome desktop/mobile fixture checks passed.
- Two limited live queries were checked; see [validation](docs/VALIDATION.md).
- GitHub release validation and publication passed. Downloaded ZIP/checksums
  matched the validated local package byte-for-byte.
- GitHub Pages deployed successfully. Hosted Chrome desktop/mobile checks passed
  with live taken/unconfirmed results and no JavaScript errors.

Limitations:

- Twitch blocked availability confirmation with `IntegrityCheckFailed`; absent
  profiles are shown as unconfirmed when availability cannot be established.
- The first Pages deployment required one-time activation of GitHub Actions as
  the Pages source. Subsequent main pushes deploy automatically after checks.
