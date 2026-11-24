---
name: Travel Explorer
description: Places across Indian cities, printed from one carved block on hand block-printed cotton.
colors:
  madder: "#a3262a"
  madder-deep: "#861c20"
  madder-wash: "#f5e2df"
  dye: "#1b2550"
  dye-deep: "#121936"
  dye-raised: "#27336b"
  turmeric: "#d9a11e"
  turmeric-wash: "#f8eed3"
  cotton: "#eff1f2"
  paper: "#fafbfc"
  resist: "#f2f3f6"
  resist-dim: "#c4c8dc"
  iron: "#1d1a17"
  iron-2: "#4b4640"
  iron-3: "#6b655d"
  rule: "#d4d7d9"
  rule-strong: "#868b91"
typography:
  display:
    fontFamily: "Rozha One, Georgia, serif"
    fontSize: "4.25rem"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Rozha One, Georgia, serif"
    fontSize: "2.8rem"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Rozha One, Georgia, serif"
    fontSize: "1.45rem"
    fontWeight: 400
    lineHeight: 1.15
  lead:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.2
  fact:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    fontFeature: "'tnum'"
  label:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.08em"
  stamp:
    fontFamily: "Mukta, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  tag: "2px"
  print: "3px"
  stamp: "4px"
  avatar: "9999px"
spacing:
  chip-gap: "8px"
  card-pad: "16px"
  grid-gap: "20px"
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  section: "96px"
  section-wide: "128px"
components:
  button-ink:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.resist}"
    typography: "{typography.button}"
    rounded: "{rounded.print}"
    padding: "0.55rem 1.15rem"
    height: "44px"
  button-ink-hover:
    backgroundColor: "{colors.madder-deep}"
    textColor: "{colors.resist}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.iron}"
    typography: "{typography.button}"
    rounded: "{rounded.print}"
    padding: "0.55rem 1.15rem"
    height: "44px"
  button-line-hover:
    backgroundColor: "{colors.iron}"
    textColor: "{colors.paper}"
  button-line-dye:
    backgroundColor: "transparent"
    textColor: "{colors.resist}"
    typography: "{typography.button}"
    rounded: "{rounded.print}"
    padding: "0.55rem 1.15rem"
    height: "44px"
  ink-chip:
    backgroundColor: "transparent"
    textColor: "{colors.iron-2}"
    rounded: "{rounded.print}"
    padding: "0 14px"
    height: "40px"
  ink-chip-dye:
    backgroundColor: "transparent"
    textColor: "{colors.resist}"
    rounded: "{rounded.print}"
    padding: "0 14px"
    height: "40px"
  ink-chip-active:
    backgroundColor: "{colors.madder}"
    textColor: "{colors.resist}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.iron}"
    typography: "{typography.body}"
    rounded: "{rounded.print}"
    padding: "0.65rem 0.9rem"
    height: "48px"
  masthead:
    backgroundColor: "{colors.dye}"
    textColor: "{colors.resist}"
    height: "64px"
  place-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.iron}"
    rounded: "{rounded.print}"
    padding: "{spacing.card-pad}"
  fact-block:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.iron}"
    typography: "{typography.fact}"
    rounded: "{rounded.print}"
    padding: "14px 16px"
  category-tag:
    backgroundColor: "{colors.dye}"
    textColor: "{colors.resist}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.madder}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "0.22rem 0.6rem 0.16rem"
  sample-tag:
    backgroundColor: "transparent"
    textColor: "{colors.iron-3}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
  date-block:
    backgroundColor: "{colors.dye}"
    textColor: "{colors.resist}"
    rounded: "{rounded.print}"
    width: "64px"
---

# Design System: Travel Explorer

## Overview

**Creative North Star: "The Carved Block"**

Every place is printed from the same carved block. The fact block (cost, stay, rating, hours) is one impression, inked with each place's real values, and it repeats in the same cells on every swatch, map row and detail page, so a Mughal tomb and a food crawl line up side by side. The material is hand block-printed cotton. Indigo dye floods whole bands: the masthead, the page heads, the map pane and the footer. The working field is bleached cotton, cool rather than cream, printed in iron-black. Madder red is the one action ink and turmeric (harda) marks highlights. Ajrakh-style lattice bands and a kangura stepped-tooth fringe, printed resist-white on indigo, mark where one printing pass ends and the next begins.

Each page is a measured descent: an ornate dyed end-band at the top, a plain cotton field where the work happens, and a printed border to close. The home page persuades, so its indigo cloth runs large and the first row of swatches crosses the band's edge onto the cotton. Browse, map, place detail, sharing, profile and sign-in are operating surfaces. There the world shows up as precision and restraint: paper swatches, iron rules and tabular facts. Edges are hard and printed (2–4px radii) and depth is carried by ink rules, not shadows. The motion grammar is single presses, never floats: a filter inks in with one press, and a stamp lands and settles.

Confirmed rejection: the category default, which is a photo hero with a floating search bar over a grid of rounded heart cards, and soft floating cards in general. Facts come before adjectives, and the system never prints a number that does not exist.

**Key Characteristics:**
- Indigo bands, cool cotton field, iron-black print, with madder as the only action ink and turmeric for highlights.
- One fact block, identical everywhere a place appears.
- State is printed as a stamp or an inked fill, never tinted.
- Lattice end-band at the top, kangura fringe at band edges, lattice and fringe again at the close.
- Rozha One (wood-type fat face) for names and headlines, Mukta for everything you read and operate.
- Flat surfaces with hard 3px corners, separated by ink rules.
- Motion as presses: ink-in, stamp-land, a 1px button press.

## Colors

The palette uses a printer's dyes and mordants: one blue ground, one red ink, one yellow highlight, on cool undyed cotton.

### Primary
- **Madder Red** (#a3262a): the only action ink. Ink buttons, active filters, the saved toggle, stamps, the selected tab's underline, map dots, text links, the caret and the focus ring on cotton. Because it is the system's only red, it also carries validation errors.
- **Madder Deep** (#861c20): hover and press for Ink buttons, and the text of form-level error panels.
- **Madder Wash** (#f5e2df): the 3px focus halo around fields, the selected row on the map list, and the ground of form-level error panels.

### Secondary
- **Indigo Dye** (#1b2550): the cloth. It fills full-width bands (masthead, page heads, footer, map pane) and the grounds behind photos. On cotton it only appears as small printed pieces such as the category tag, the date block and a photo's frame.
- **Deep Indigo** (#121936): the carved block of the mark, and the overlay scrim behind dialogs (70%) and the photo lightbox (95%).
- **Raised Indigo** (#27336b): the hover fill for quiet controls that sit on the dye (menu button, profile link, sign-out).

### Tertiary
- **Turmeric** (#d9a11e): highlights only. Text selection, the focus ring inside indigo regions, the active nav underline and mobile diamond, the focus border of search fields on dye, rating stars, the selected-place ring on the map, and the dots in the lattice band.
- **Turmeric Wash** (#f8eed3): notice banners (for example a published place whose photo upload failed) and the hover ground of the star-rating input.

### Neutral
- **Bleached Cotton** (#eff1f2): the page field. Cool, never cream.
- **Swatch Paper** (#fafbfc): the face of every swatch, fact block, field, panel and dialog. On cotton it reads as a printed card stock.
- **Resist White** (#f2f3f6): the undyed cotton showing through on indigo. Headlines and text on dye, the strokes of the lattice, and text on madder.
- **Resist Dim** (#c4c8dc): secondary text on indigo (leads, counts, idle nav links, footer links).
- **Iron Black** (#1d1a17): primary print. Headlines and body on cotton, Line buttons, the 2px rules of the full fact block, dialogs and empty or error panels.
- **Iron 2** (#4b4640): secondary text such as cities, leads on cotton, breadcrumbs and idle chip text.
- **Iron 3** (#6b655d): tertiary text: small-caps labels, notes under fact values, placeholders, the Sample traveler tag.
- **Rule** (#d4d7d9): the resting 1px border of swatches and panels, list dividers, and skeleton blocks.
- **Rule Strong** (#868b91): field and idle-chip strokes, the tab baseline, the cell dividers inside the fact block, dashed "nothing here yet" panels, and the outlines of unfilled stars.

### Named Rules
**The One Ink Rule.** Madder is the only action ink. Nothing else on a screen is red, and no second accent hue is introduced: the leaf-green ink was removed and stays out.

**The Turmeric Highlight Rule.** Turmeric marks and highlights. It never fills a button or carries an action, and it is never text on cotton or paper (2.2:1).

**The Ring Swap Rule.** Focus is a 2px madder outline offset 2px on cotton. Inside any indigo region (`.on-dye`) it switches to turmeric, because madder on indigo measures 2.0:1.

## Typography

**Display Font:** Rozha One (with Georgia, serif)
**Body Font:** Mukta (with ui-sans-serif, system-ui, sans-serif)

**Character:** Rozha One is an Indian fat face in the wood-type tradition: heavy, high-contrast, a poster headline pulled from a block. Mukta is an open, even sans drawn for Indian scripts. It reads well at phone size, so facts and controls stay plain. Both are self-hosted as woff2 (latin and latin-ext): Rozha One at 400 only, Mukta at 400–800, all with `font-display: swap`.

### Hierarchy
- **Display** (Rozha One 400, 2.6rem → 3.4rem at 640px → 4.25rem at 1024px, line-height 1.02, -0.015em): the home hook, held to about 16ch. Page heads on dye use 2.6rem → 3.4rem at line-height 1. A place's name on its detail page uses 2.5rem → 3.6rem at -0.01em.
- **Headline** (Rozha One 400, 2.2rem → 2.8rem, line-height 1.05): section heads on cotton ("Same block, every place", "Going soon", "Cities in the collection"). The results heading on dye is 1.7rem → 2rem. Section heads on the share form are 1.9rem at line-height 1.
- **Title** (Rozha One 400, 1.45rem, line-height 1.15): swatch names and the wordmark. Event titles are 1.3–1.35rem, map list rows 1.15rem, and the city ledger 1.65rem at line-height 1.
- **Lead** (Mukta 400, 1.1–1.2rem, line-height 1.625): the paragraph under a display or headline, 46–56ch wide.
- **Body** (Mukta 400, 1rem, line-height 1.55): running text. Review text is 1.05rem relaxed, capped at 60ch. Paragraphs use `text-wrap: pretty`, and h1–h3 use `balance`.
- **Button** (Mukta 700, 0.95rem, line-height 1.2): every button label. Filter chips use 600 weight at 0.95rem.
- **Fact** (Mukta 800, 1.5rem, line-height 1.25, tabular): values in the full fact block. Hours drops to 1.125rem. The compact block uses 700 at 0.875rem.
- **Label** (Mukta 700, 0.75rem, 0.08em, uppercase, Iron 3): names a datum. Fact names, filter-group names, category tags (resist on indigo) and the month in a date block (0.1em).
- **Stamp** (Mukta 800, 0.72rem, 0.12em, uppercase): text inside a rubber stamp.

### Named Rules
**The Wood-Type Rule.** Rozha One sets names and headlines: places, cities, people's initials, section heads, and big standalone numerals like a review average, a date or a 404. It never sets running text, labels, buttons or the values inside a fact block, and it is never bolded.

**The Tabular Facts Rule.** Every number meant for comparison uses tabular figures: costs, fares, durations, ratings, counts and dates.

**The Labels Name Data Rule.** The uppercase small-caps label names a datum. It never sits above a heading as a kicker.

## Layout

The page is a centred column, max 1240px, with gutters of 16px on phones, 24px from 640px and 32px from 1024px. Breakpoints are Tailwind's defaults: 640px, 768px and 1024px. A sticky 64px masthead sits on top, and `scroll-padding-top` is the masthead height plus 1.5rem so anything focused or scrolled into view clears it.

Swatches sit in a grid of 1 column, then 2 at 640px and 3 at 1024px, with a 20px gap. On home, sections are separated by 96px (128px from 768px), and pages end with 96–128px of field before the footer. Place detail and the share form use a main column plus a 340px aside at 1024px. The map page is a 380px list beside a full-height map at 1024px (the viewport minus the masthead). On phones the map comes first at 52vh and the list follows.

Dyed-top pages (Discover, All places, Share a place, Profile) open with the lattice end-band directly under the masthead, then a dyed head that ends in a kangura fringe. On home, the first row of swatches crosses that edge: the cards section pulls up by the band's bottom padding (112px → 150px → 190px), so the cloth runs off the table and places are visible above the fold. Filter rows scroll sideways on phones behind a 2.5rem right-edge fade and wrap from 640–768px. Controls stay at or above 40px (chips), 44px (buttons) and 48px (fields, mobile menu rows).

### Named Rules
**The Measured Descent Rule.** Every page reads ornate at the top, plain in the middle and bordered at the close: lattice end-band or fringe, cotton field, fringe and lattice footer.

**The Printing Pass Rule.** Sections are full-width horizontal passes divided by a printed band or a 2px iron rule. They are not stacks of boxed cards.

## Elevation & Depth

The system is flat. Depth comes from ink weight and from the contrast between dye and cotton, not from light. A resting swatch has a 1px Rule border that darkens to iron on hover. The compact fact block is ruled at 1.5px. The full fact block, dialogs, the map's selected-place card and the empty or error panels are ruled at 2px iron. Overlays separate from the page with an indigo scrim (Deep Indigo at 70% behind a dialog, 95% behind the lightbox) and a 2px iron edge. The one offset in the system is registration drift: a second madder impression printed a hair off-register.

### Shadow Vocabulary
- **Field focus halo** (`box-shadow: 0 0 0 3px var(--color-madder-wash)`): a field's focus state only, paired with a madder border.
- **Registration drift** (not a shadow: a `::before` 1.5px madder border, `translate(2px, 2px)`, opacity 0.45, behind the element): on the full fact block. Stamps carry their own ghost ring at `translate(1.5px, 1px)`, opacity 0.35.

`--shadow-lift` is still in the stylesheet and appears on three overlay spots (the group-visit dialog, the map's floating selected card and the photo-remove button on Share a place). It is a leftover from the build, not part of this vocabulary. New surfaces don't use it.

### Named Rules
**The Printed-Not-Floating Rule.** Surfaces sit flat at rest and on hover. Hover answers with a darker rule or an inked fill, never a lift or a soft shadow.

**The Registration Drift Rule.** The only offset in the system is a madder second impression 1–2px off-register, on stamps and the full fact block. It is crisp, never blurred.

## Shapes

Almost everything is cut at 3px (`print`): buttons, chips, fields, swatches, fact blocks, panels, photo frames and dialogs. Small printed pieces (the category tag, the Sample traveler tag, the inner top corners of a swatch's photo, skeleton lines) use 2px, and stamps use 4px. Circles are for avatars only. The 3px nav underline has rounded ends. When controls join, the shared corners go square: the home search field and its Ink button meet flush from 640px.

The recurring geometry is the diamond, which appears in the lattice band, the lattice field, the carved block mark and the mobile menu's active marker. Alongside it are the kangura's stepped teeth (16px pitch, a madder dot under each tooth) and the tilt of a stamp (−4° to −9°). Dashed Rule Strong borders mean "nothing here yet, here is how": empty visit lists, sign-in prompts and the photo-upload target.

## Components

### Buttons
Tactile and certain: a block pressed onto cloth.
- **Shape:** hard print corners (3px), 1.5px border, minimum 44px tall (40px in the masthead), padding 0.55rem 1.15rem, Button type, 16px line icons with a 0.5rem gap.
- **Ink (primary):** a madder fill and border with resist text. Hover deepens to Madder Deep. It is used for the one main act in a region: Search places, Join, Share a place, Post review, Publish place.
- **Line:** transparent with a 1.5px iron border and iron text. Hover inverts to an iron fill with paper text. Used for second acts such as Directions, Clear filters and Browse all.
- **Line on Dye:** transparent with a resist border at 55% and resist text. Hover takes the border to full resist over an 8% resist wash.
- **Press / Disabled:** active is `translateY(1px) scale(0.985)` over 120ms; colors transition over 160ms, both on `cubic-bezier(0.16, 1, 0.3, 1)`. Disabled is 50% opacity with a not-allowed cursor.
- **Toggle:** Save on a place's page is a Line button that becomes an Ink button when saved (`aria-pressed`), and its bookmark fills.
- **Quiet outline:** the Helpful vote is 36px tall with a 1px Rule Strong border, 0.875rem text and Iron 2, darkening to iron on hover.

### Chips
- **Style:** the Ink Chip. Every option is visible as an uninked outline: 1.5px border, 3px corners, 40px tall, 14px side padding, Mukta 600 at 0.95rem. On cotton it has a Rule Strong border with Iron 2 text, going to iron on hover. On dye the border is resist at 45% with resist text, going to full resist on hover.
- **State:** choosing one inks it madder (madder fill and border, resist text) with one press: scale 0.92 → 1.03 → 1 over 260ms. One chip per group is active, "All places" included.

### Cards / Containers
- **Corner Style:** 3px, with 2px on the photo's inner top corners.
- **Background:** Swatch Paper on the cotton field. The photo sits at 4:3 on an indigo ground.
- **Shadow Strategy:** none (see Elevation & Depth). Hover darkens the border to iron over 200ms, and the photo scales to 1.03 inside its clipped frame over 500ms.
- **Border:** 1px Rule at rest.
- **Internal Padding:** 16px, with 12px between the name row and the compact fact block, which is pinned to the card's foot.
- **Anatomy:** the category tag sits top-left on the photo. A madder Saved stamp at −8° sits bottom-right when saved. The name is in Title type and is the card's single stretched link (the focus ring draws on the whole card). The city has a 14px pin. A 40px Save toggle ends the name row.
- **Entrance:** on home, each swatch presses in from scale 1.03 and a 3px blur to rest over 320ms, staggered 50ms per card up to 400ms.
- **Other containers:** a paper panel with a 1px Rule (review form, event rows). A 2px iron panel for empty and error states. A madder-wash panel with a 1.5px madder border for form errors. Skeletons are Rule blocks at the swatch's proportions, breathing between opacity 1 and 0.55 over 1.6s.

### Inputs / Fields
- **Style:** Swatch Paper fill, a 1.5px Rule Strong stroke, 3px corners, at least 48px tall, padding 0.65rem 0.9rem, 1rem Mukta, Iron 3 placeholder, madder caret. Textareas start at 120px with line-height 1.6 and resize vertically. Selects drop native styling for an iron chevron set 0.9rem from the right. Labels sit 0.4rem above in Mukta 600 at 0.95rem.
- **Focus:** the border turns madder and gains the 3px Madder Wash halo, with no outline. Hover takes the border to Iron 3.
- **Error / Disabled:** `aria-invalid` turns the border madder, and the message below is madder at 600 weight, 0.95rem.
- **On dye:** search fields on indigo have a 2px resist border on paper, and the border turns turmeric on focus. Home's is 56px tall and joins its Ink button; the browse page's is 48px.

### Navigation
- **Masthead:** sticky indigo, 64px. The block mark (30px) and a 1.45rem Rozha wordmark sit at the left. Centre links are Mukta 600 at 0.98rem in Resist Dim, turning resist on hover. The active link is resist with a 3px turmeric underline that scales in from the centre (200ms). On the right: Sign in plus a Join Ink button, or Share a place, avatar with first name, and sign-out. Hover on dye fills Raised Indigo.
- **Close:** on dyed-top pages the masthead runs straight into the page's lattice end-band. Elsewhere it ends in a kangura fringe backed with opaque cotton, so content scrolling underneath never shows between the teeth.
- **Mobile (below 768px):** a 44px menu button opens a panel of 48px rows (Mukta 600, 1.125rem), with a turmeric diamond on the active row. Full-width Ink and Line on Dye buttons sit under a faint resist rule. Escape closes it and returns focus.
- **Tabs:** text tabs in Mukta 600 at 1.05rem. The selected tab is iron with a 3px madder underline sitting on a 1px Rule Strong baseline; idle tabs are Iron 3. Arrow keys move between them.
- **Footer:** a kangura fringe rising from the cotton, then an indigo field with 1.25rem Rozha group heads and Resist Dim links (resist and underlined on hover), a lattice band, and a small colophon line.

### Fact Block (signature)
The carved block. **Compact** (swatches, the map's selected card) has three cells (Cost, Stay, Rating) over a full-width Hours row. The border is 1.5px iron at 80%, with cells divided by 1px Rule Strong at 70%. Labels are in Label type and values in Mukta 700 tabular. Hours clamps at two lines so the closed day is never cut. **Full** (place detail, home's demonstration) is two columns on phones and four from 768px (1fr 1fr 1fr 1.6fr). It is ruled 2px iron on paper, with Fact-type values over Iron 3 notes ("suggested visit", "from 2 reviews"), and it carries the registration drift. On a place page it is stamped onto the lower edge of the photographs from 768px, overlapping by 56px with a 32px inset. Map list rows print the same three facts inline, separated by dots. Cost always prints as Free, ₹, ₹₹ or ₹₹₹. A place with no reviews reads **New** (compact) or **Unrated / no reviews yet** (full), never a number.

### Stamp
A rubber stamp, used for state and never for decoration: **Saved**, **You're going**, **Cheapest**. It has a 2px madder border and a 1px outline 2px outside it, plus a ghost ring printed 1.5px/1px off at 35%. Corners are 4px, the fill is paper at 92%, the text is Stamp type, and it is rotated −4° to −9°. It lands with one press: from 1.5× and transparent, through 0.96, to rest over 320ms. An indigo tone exists; madder is the default.

### Border Bands
- **Lattice band** (26px): an Ajrakh diamond lattice in resist strokes at 70% on indigo, with madder centres, turmeric dots at the joins and 1.2px resist rules top and bottom. It opens dyed-top pages and sits above the footer's colophon.
- **Kangura fringe** (20px): a 6px indigo strip with 16px stepped teeth and madder dots, hanging into the cotton below a dyed band and rising out of it above the footer.
- **Lattice field:** a 44px diamond repeat in resist at 8–20% opacity, the texture of every indigo region.

### Sample Tag
A quiet "Sample traveler" label in Mukta 700 at 0.7rem, uppercase, 0.06em, Iron 3, with a 1px Rule Strong border and 2px corners. It sits beside the name of any seeded account on reviews, threads, replies, visit hosts and place bylines.

### Rating Stars
Five line stars, filled with turmeric to the exact value over Rule Strong outlines, so 4.5 prints four and a half. The input is five 44px radio buttons with 26px stars and a Turmeric Wash hover.

### Place Art and Date Block
- **Place Art:** shown when a place has no photo. Indigo with the lattice field at 20% and the place's initial in Rozha One, resist. Screen readers hear "No photo yet".
- **Date block:** a 64px indigo block with the day in Rozha One at 1.9rem and the month in Label type, Resist Dim.

## Do's and Don'ts

### Do:
- **Do** print every place's facts through the Fact Block, in the same cells and order (Cost as Free/₹/₹₹/₹₹₹, Stay, Rating, Hours), on swatches, map rows and detail pages.
- **Do** say plainly when a fact doesn't exist yet: **New**, **Unrated**, **No reviews yet**, **Not listed**. Fill rating stars to the exact fractional value.
- **Do** label every contribution from a seeded account with the Sample Tag, and add "includes sample data" to any count that includes it.
- **Do** degrade optional integrations in the world's own materials. With no Google Maps key, plot places by coordinates on the indigo lattice and say in one line that the street map needs a key. With no Google client id, leave the Google sign-in block out entirely. When a place has no photo, show Place Art. When a photo upload fails, explain it in a Turmeric Wash notice.
- **Do** print state as a Stamp or an inked fill: a saved swatch gets a madder Saved stamp and a filled bookmark, and a joined visit and the cheapest fare get stamps.
- **Do** switch the focus ring to turmeric inside every indigo region (`.on-dye`).
- **Do** keep chips at 40px or more, buttons at 44px and fields at 48px.
- **Do** collapse every animation and transition to about 0ms under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** build the category default: a photo hero with a floating search bar over a grid of rounded heart cards.
- **Don't** print a number that doesn't exist: no invented counts, ratings, testimonials or fallback ratings.
- **Don't** add a second action hue. Madder is the only action ink.
- **Don't** put a soft or blurred shadow on a card, or lift it on hover.
- **Don't** warm the field to cream or beige. Cotton is cool (#eff1f2).
- **Don't** round buttons, chips, fields or containers beyond 4px. Circles are for avatars only.
- **Don't** use indigo as a panel or card fill on the cotton field. There it appears only as small printed pieces (category tag, date block, photo ground).
- **Don't** set running text, labels, buttons or fact values in Rozha One, and never bold it.
- **Don't** put an uppercase kicker above a heading. Uppercase labels name data.
- **Don't** show state as a colored badge or tint alone.
