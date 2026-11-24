---
version: 1
slug: "frontend-src-pages-homepage-tsx"
primary_target: "frontend/src/pages/HomePage.tsx"
related_targets: ["frontend/src/pages/ReelsFeed.tsx","frontend/src/pages/PlaceDetails.tsx","frontend/src/pages/ExploreMap.tsx","frontend/src/pages/AddPlace.tsx","frontend/src/pages/ProfilePage.tsx","frontend/src/pages/LoginPage.tsx","frontend/src/pages/RegisterPage.tsx"]
---

# Surface brief — Travel Explorer web app (home + app screens)

## Scope and mode

Whole-frontend redesign. Home (`/`) is **Persuade**; browse, place detail, map, share-a-place, profile and auth are **Operate** surfaces in the same world, where the world shows up as precision and restraint.

## Audience, job, action

Travelers and locals in Indian cities, plus evaluators. Job: find a place worth going to and trust its facts. Primary action on home: search places (working field, live results). Secondary: pick a city or category, open a place, save it, plan a group visit, share a place.

## Proof and constraints

Counts come from `/api/stats`; unrated places say so. Sample seed data only, with no invented claims. Must degrade without Google Maps, Cloudinary or Google sign-in keys.

## Direction contract

THESIS: Every place is printed from the same carved block. The fact block (cost, hours, time to spend, rating) is one stamp inked with each place's real values, on every card, map row and detail page. Refuses the category default: a photo hero with a floating search bar over a grid of rounded heart cards.

OWN-WORLD: Hand block-printed cotton. Indigo-dyed bands own the masthead, hero and footer. Working fields are bleached cotton, cool and not cream, printed in iron-black. Madder red is the only action ink; turmeric marks highlights. Ajrakh-style geometric border bands (resist-white on indigo, as SVG repeats) separate passes. Rozha One (Indian fat face, wood-type lineage) for display, Mukta for text. Hard printed edges with 2–4px radii and ink rules, no soft floating cards. Stamps carry a 1–2px madder registration drift.

STORY: Within seconds the visitor understands this is a map of places across Indian cities, printed by people who went, with honest facts. They search or pick a city or category at once, open a place, trust its fact block and community (reviews, threads, group visits), then save it, join a visit, or share their own.

FIRST VIEWPORT: Full-width indigo cloth under a slim printed masthead. Rozha One headline in resist-white, with a working search field printed as a block and the primary action in madder. Real counts set as one printed line. All categories as carved outlines along the lower edge. The first row of real place swatches crosses the band edge into the cotton field below, so the cloth runs off the table and places are visible above the fold.

FORM: Block-Printed Cloth, position 4 of the ordered grounded list (1 station nameboards, 2 India Post ephemera, 3 tourism posters, 4 block print, 5 survey topo sheets, 6 hand-painted signage, 7 auto-rickshaw livery). seed:ae80f1d928593ad1. Raises: indigo floods whole bands (from the rebel collage); sections are horizontal printing passes (jacquard); state is a stamped mark, not a hue, so saved places carry a madder impression (cutting bench); every filter is present as an uninked outline and inks in one press (cathode gauze); the scroll is a measured descent from ornate end-band to plain field to printed border close (Versailles). Signature interaction: choosing a filter or saving a place prints. The outline inks in, or a madder stamp lands with one press and settles. Motion grammar: single presses, never floats.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Product name: working name "Travel Explorer" until the owner decides (see PRODUCT.md).
