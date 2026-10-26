# Self-hosted fonts

Served from `/fonts/` and declared in `assets/css/fonts.css`. Sources are the Google Fonts
`latin` subsets. Each family has a small `*-core.woff2` (printable ASCII plus the typographic
punctuation the site uses) and the unmodified `*-latin.woff2`, which browsers only download
when a page needs a character outside the core range.

| File | Family | License |
|---|---|---|
| `SCDisplay-core.woff2` | Subset of Cabin Sketch Bold, renamed: "Cabin Sketch" is a Reserved Font Name and a subset is a Modified Version under OFL §3 | SIL OFL 1.1, `CabinSketch-OFL.txt` |
| `CabinSketch-latin.woff2` | Cabin Sketch Bold, unmodified | SIL OFL 1.1, `CabinSketch-OFL.txt` |
| `PatrickHand-*.woff2` | Patrick Hand | SIL OFL 1.1, `PatrickHand-OFL.txt` |
| `Schoolbell-*.woff2` | Schoolbell | Apache 2.0, `Schoolbell-LICENSE.txt` |
| `CutiveMono-*.woff2` | Cutive Mono | SIL OFL 1.1, `CutiveMono-OFL.txt` |

Regenerate the core files with fontTools (`pyftsubset <font>-latin.woff2 --unicodes=...
--layout-features='kern,liga,calt,ccmp,locl,mark,mkmk' --no-hinting --desubroutinize
--flavor=woff2`), using the `unicode-range` declared for the core faces in `fonts.css`.
