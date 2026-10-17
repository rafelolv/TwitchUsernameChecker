# Branding

The **nameplate** mark combines a cut-corner tag, open username brackets and a
mint check. It represents a name being checked rather than Twitch's chat logo.
It is a project mark, not an indicator that a queried username is available.

`assets/logo.svg` is the canonical vector. Use that same asset in the header,
favicon and README. Its paths do not depend on a font. Keep the full 72×72 viewBox
and surrounding space; do not crop the folded corner or redraw individual uses.

The light palette stays cream (`#f7f6f2`), deep purple (`#452480`) and mint (`#c3e6ad`).
Use the mint inside the mark, retain text labels for result states and keep the
rest of the interface restrained. The mark should remain recognizable at favicon
size. Keep the full project name in the adjacent wordmark or accessible link name.

`docs/images/preview.png` shows the actual desktop interface. Refresh it after
material visual changes. It is documentation only and is not deployed with the
runtime files. The project is independent and not affiliated with Twitch.

The dark theme uses deep plum surfaces and a lighter purple accent. It follows
`prefers-color-scheme` without a toggle or saved preference. Available results use
green and Unavailable results use red in both themes, with uniform thin borders
and no decorative side stripe. Warnings must remain readable on each surface.
