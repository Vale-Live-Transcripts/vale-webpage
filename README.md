# Vale! website

The page for Vale!, live transcripts in large type for iPhone, iPad and Mac
(in development): a landing page, a support page with the feedback form,
and their stylesheet. Static HTML, no build step.

## Published at

GitHub Pages serves `main` from the repo root:
<https://vale-live-transcripts.github.io/vale-webpage/>

| Page | Address | Used as |
|---|---|---|
| `index.html` | `…/vale-webpage/` | Marketing URL in App Store Connect |
| `support.html` | `…/vale-webpage/support.html` | Support URL in App Store Connect and the app's Settings ▸ Support |

The app will name these addresses in one place, its `LegalLinks`, in the
private app repo. If a page is renamed or the site moves, change that in the
same release, and keep the old address answering until the builds that use
it are gone.

## Editing

- `index.html` is the landing page, `style.css` the styles of both pages,
  `scenes.js` the landing page's motion. Preview with
  `python3 -m http.server` in this folder and open `http://127.0.0.1:8000/`;
  check light and dark mode, a phone's width, Reduce Motion, and the page
  with JavaScript off.
- **The HTML is each section's finished frame.** Without JavaScript, nothing
  moves and that frame shows; `scenes.js` adds `js` (and `motion`, unless
  Reduce Motion is on) to `<html>`, and only rules under those classes hide,
  move or play anything. Under Reduce Motion the hero's controls still work,
  but nothing plays on its own. Keep both ways working when a section
  changes.
- **The landing page is drawn in big type, and it captions itself:** the
  hero plays the pitch, then the made-up dinner, in the caption theme its
  dots pick; headlines with `data-caption` arrive word by word in the
  partial shade and settle. Loops stop while their section is off screen.
- **Name only what the app really does.** Until Vale! is on the App Store
  the page says "In development". When it ships, add the official App Store
  badge linking to the listing.
- The palette in `:root` and its dark block is the app's chrome tokens from
  the master design canvas (see the app repo's CLAUDE.md, "Master design"),
  and the caption themes in `scenes.js` and the bands are ValeKit's
  `CaptionTheme`; change them together.
- The site is drawn on the master design's Website page (page 11): change a
  page here, and its boards change in the same task.
- `support.html` holds the questions people ask most, the contact email and
  the feedback form. The form posts to the same endpoint and contract as the
  app's Send Feedback, documented in
  [vale-feedback](https://github.com/Vale-Live-Transcripts/vale-feedback),
  and the report becomes an issue in the app's private repo. It sends the
  version as `? via website`. The function only answers browsers from this
  site's origin (`https://vale-live-transcripts.github.io`), so the form
  fails from a local preview, before the Vercel project exists, or if the
  site moves to another domain: add the new origin to `ALLOWED_ORIGINS` in
  the function first.
- `images/link-preview.png` (1200 × 630, `og:image`) is the hero's finished
  frame: the landing page rendered in headless Chrome at 1200 × 630 and 2×,
  with JavaScript off, then scaled to 1200 × 630 with `sips`. Render it again
  when the hero changes. Words on this site always come from the made-up
  sample dinner, never a real conversation.
- The icons come from the app icon (the app repo's `screenshots/app-icon/`):
  `favicon.png` (128 px) and `icon-512.png` from
  `vale-app-icon-rounded-1024.png`, `apple-touch-icon.png` (180 px) from
  `vale-app-icon-square-1024.png`, scaled with `sips -z`. Make them again
  when the app icon changes.
- The footer links to the Impressum, privacy policy and terms of use in the
  public
  [vale-legal-docs](https://github.com/Vale-Live-Transcripts/vale-legal-docs)
  repo. If those pages move, update the links here too.
- System fonts only, no scripts or styles from anywhere else, no analytics:
  no other service sees a visitor. Never link a font CDN.
- `.nojekyll` makes Pages serve the files exactly as committed.
- This repo has only `main`, and a push publishes: push only an approved
  change. Commits use the app repo's bracket tags (`[+]`, `[-]`, `[*]`,
  `[#]`), one line, no trailers.
