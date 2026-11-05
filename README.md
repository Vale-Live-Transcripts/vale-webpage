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

- `index.html` is the landing page, `style.css` the styles of both pages.
  Preview with `python3 -m http.server` in this folder and open
  `http://127.0.0.1:8000/`; check light and dark mode and a phone's width.
- **Name only what the app really does.** Until Vale! is on the App Store
  the page says "In development" and describes what it is *designed* to do.
  When it ships, replace the badge with the official App Store badge linking
  to the listing, and the design preview with a screenshot of the app.
- The palette in `:root` and its dark block is the app's chrome tokens from
  the master design canvas (see the app repo's CLAUDE.md, "Master design");
  change them together.
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
- `images/iphone-live.webp` is the iPhone board from the master design,
  drawn by the app repo's `design/generate.py` from the made-up sample
  conversation, rendered at 2× with headless Chrome and converted with
  `cwebp -q 86`. Images here always come from that sample data, never a real
  conversation or someone else's work.
- The icons are a placeholder until the app has its icon: `icon.svg` (a
  small bird on a speech bubble turning into text, as on the canvas's
  cover), and `icon-512.png`, `apple-touch-icon.png` (180 px) and
  `favicon.png` (64 px) rendered from it. Export them from the app icon once
  it exists.
- The footer links to the Impressum, privacy policy and terms of use in the
  public
  [vale-legal-docs](https://github.com/Vale-Live-Transcripts/vale-legal-docs)
  repo. If those pages move, update the links here too.
- System fonts only, so no font service sees a visitor; never link a font
  CDN.
- `.nojekyll` makes Pages serve the files exactly as committed.
- This repo has only `main`, and a push publishes: push only an approved
  change. Commits use the app repo's bracket tags (`[+]`, `[-]`, `[*]`,
  `[#]`), one line, no trailers.
