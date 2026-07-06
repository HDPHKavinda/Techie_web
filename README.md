# Techie Heshan — website

Free electronics education site. Twelve static HTML pages, one shared stylesheet, one shared JavaScript file. No build step, no framework, no dependencies. Drop the folder on any static host.

## What's inside

```
techie-heshan-site/
├── index.html                       Home — 3D board, live blink simulator, hero, all sections
├── learn.html                       Four learning paths with tutorial rows
├── projects.html                    Project write-ups (grid of cards)
├── blog.html                        Bench Notes index
├── resources.html                   The tools I use (affiliate zone)
├── hire.html                        Services, past work, process, contact
├── about.html                       You, the lab, the mission
├── sponsor.html                     Media kit for brands
├── legal.html                       Affiliate disclosure + privacy
├── 404.html                         Custom not-found page
├── tutorials/
│   └── esp32-smart-led.html         Full working example tutorial (the template)
├── blog/
│   └── esp32-c3-vs-s3.html          Sample Bench Notes post
└── assets/
    ├── style.css                    Whole site's styles (strict monochrome)
    ├── main.js                      Nav, reveals, copy, simulator, 3D board
    └── favicon.svg
```

## Deploying (any of these works)

- **Cloudflare Pages** — connect your repo, no build command, output directory: `/`. Free.
- **Netlify / Vercel** — drag-and-drop the folder. Free.
- **GitHub Pages** — push to a repo, enable Pages on the main branch.
- **Any web host** — upload via FTP/SFTP. It's just HTML.

Point `techieheshan.com` at whichever host you pick. Done.

## Editing new content

New tutorials and blog posts are just HTML files that copy the same structure. Duplicate an existing one and edit the content:

- **New tutorial** → duplicate `tutorials/esp32-smart-led.html`
- **New blog post** → duplicate `blog/esp32-c3-vs-s3.html`

The stylesheet and JS handle everything else automatically — copy buttons, reveal animations, table of contents styling, mobile menu, footer year.

## Before launch — the 23 EDIT markers

Search the codebase for `EDIT:` in comments and fill each one in. They're grouped:

- **Contact email** (2 files: `hire.html`, `sponsor.html`) → replace `hello@techieheshan.com` with your real address.
- **Affiliate links** (11 markers in `resources.html`, plus 5 in the sample tutorial) → replace `#` with the actual AliExpress / Amazon URLs once your affiliate programs are approved.
- **YouTube embed** (`tutorials/esp32-smart-led.html`) → replace the placeholder card with `<iframe class="video-embed" src="https://www.youtube-nocookie.com/embed/VIDEO_ID" …>`.
- **Wokwi embed** (same tutorial) → create the project on wokwi.com, paste the embed URL.
- **Buy me a coffee** (support strips + footer) → point to your Ko-fi or Buy Me a Coffee page.
- **Sponsor stats** (`sponsor.html`) → fill in your real YouTube subscriber count, monthly views, monthly site readers.

That's it — everything else is real content, ready to publish.

## Design ground rules (in case you edit the CSS)

- **Strict monochrome.** Every gray in the palette has equal R=G=B. No color ever, only white light.
- **Two type families.** Space Grotesk for display, Inter for body, JetBrains Mono for code and labels.
- **Section labels use PCB silkscreen notation** — `[ U1 ]`, `[ X1 ]`, `[ J2 ]` etc. — the visual signature of the site. Keep it consistent when adding sections.
- **Learning is free forever.** The rule is baked into copy across the site — don't accidentally paywall anything.

## Money placements (already built in)

- **Sponsor slot** — top of each tutorial. Delete the block when no deal is active.
- **Parts list** — inline, with affiliate links and required disclosure line.
- **Support strip** — after troubleshooting, once the reader has succeeded.
- **Hire me** — prominent nav button + homepage teaser + dedicated page + sidebar card on tutorials.
- **Ads** — not wired in yet. Once you're accepted into AdSense, insert `<ins class="adsbygoogle" …>` blocks between sections. House rule: never inside code blocks, wiring diagrams, or troubleshooting.

Built July 2026.
