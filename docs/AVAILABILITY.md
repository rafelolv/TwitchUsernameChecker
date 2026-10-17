# Availability investigation

## Question

Can the public static checker distinguish `Falsiq` (reported as held/unclaimable)
from `Falsiqkdkdk34` (reported as claimable)? A missing profile alone cannot answer
that question. The account-specific claimability reports came from the maintainer;
this investigation did not register or rename an account to verify them.

## Live findings — 2026-10-17

| Method                                              | Observed result for both names                                            | Conclusion                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Current GraphQL query                               | `user: null`, availability `null`, `IntegrityCheckFailed` on availability | Public profile absent; availability not established.                         |
| Persisted `UsernameValidator_User` signup operation | Availability `null`, `IntegrityCheckFailed`                               | Changing the operation format does not produce confirmation.                 |
| Legacy `passport.twitch.tv/usernames/<name>`        | HTTP 404 for both                                                         | No usable distinction; a 404 is not availability evidence.                   |
| Older `userOrError` field                           | Query field no longer exists                                              | Historical channel-shell approaches cannot be reused as written.             |
| Schema discovery                                    | Introspection disabled                                                    | No additional availability field could be discovered this way.               |
| Native Twitch signup in a fresh browser             | Email-first form; no username field at that stage                         | Not tested further: no personal data entered, no signup or account creation. |

The tests did not obtain a reliable response distinguishing these two names from
the static site. They do not prove that every possible first-party flow is
incapable of doing so. Adding a backend or switching to the official user-lookup
API alone does not establish claimability either. No integrity checks were bypassed,
no credentials collected and no account changes made.

Twitch's developer forum explains that names which never existed, are held after
a rename, are deactivated or are restricted can all be missing from user lookup:
[discussion on missing, banned and reserved names](https://discuss.dev.twitch.com/t/determine-whether-channel-is-banned-from-twitch-or-does-not-exists/32647).
See also [Twitch's username policy](https://help.twitch.tv/s/article/username-rename-and-recycling-policies?language=en_US)
and [official Get Users documentation](https://dev.twitch.tv/docs/api/reference/#get-users).

## Product fallback (1.0.5)

At the maintainer's request, successful absent-profile lookups use **Available**
as the main display label even when claimability cannot be confirmed. This is a
presentation decision, not a new detection method.

- Green **Available**, **Confirmed by Twitch**: explicit successful availability
  `true`, with no account.
- **Unavailable**: explicit successful availability `false`, with no account.
- Amber **Available**, **Not confirmed by Twitch**: absent public profile with
  blocked/unconfirmed availability. Always show the visible reservation/accuracy
  warning. Internally this remains `unknown`.
- **Taken**, **Lookup failed** and **Too many requests** keep their existing meaning.

Both reported examples can show the same unconfirmed Available label. Some names
may still be reserved or held after a rename, suspension or deactivation. This
fallback is not a guarantee, confidence score or probability estimate. Final
confirmation happens on Twitch. A future detection method must demonstrate valid,
different responses for held and claimable names before it can claim to distinguish them.
