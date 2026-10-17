# Changelog

Versions follow three-part semver; `package.json` is the version source.
Entries remain Unreleased until publication is verified.

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

Limitations:

- Twitch blocked availability confirmation with `IntegrityCheckFailed`; absent
  profiles are shown as unconfirmed when availability cannot be established.
- The first Pages deployment failed because Pages was not enabled. Hosted-site
  verification remains pending activation and a successful deployment.
