# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed equally important:

- **Travelers and locals in Indian cities** looking for places worth going to (landmarks, food lanes, backwater trips, quiet corners) and the practical facts to act on them: what it costs, when it is open, how long to stay, what a ride there costs, and who else is going.
- **Evaluators** (course reviewers, recruiters) assessing it as a full-stack project. It must demo end to end and read as a real product, not a class exercise.

## Product Purpose

A community travel explorer: people share places, and every place carries structured, comparable facts (GPS, budget band, hours, suggested visit length, tags) plus a per-place layer of reviews, discussion threads and group visits. Success means a visitor finds a place, trusts what they read about it, and acts on it: saves it, plans a group visit, checks a ride fare, or adds a place of their own.

## Positioning

Places come from travelers, not advertisers. Each one is described in the same structured shape and backed by the community around it (reviews, threads, group visits), with built-in ride-fare comparison across Uber, Ola and Rapido for getting there.

## Operating Context

- Indian context throughout: prices in ₹, Indian ride providers, Indian cities.
- Browsed on phones while out, and on laptops when planning or evaluating.
- Routes: Home/discover (`/`), community feed (`/uploads`), map (`/map`), place detail (`/place/:id`, with Overview, Community, Reviews and Events tabs), share a place (`/add-place`), profile (`/profile`), login and register.

## Capabilities and Constraints

- Stack: React 19 + Vite + Tailwind v4 + Framer Motion + React Router 7 (frontend); Express + MongoDB (backend). Service-class OOP layer on both sides.
- Working features: email/password auth, browsing with search/category/city filters, place detail, reviews with helpful votes, threads with replies, group visits with RSVP, bookmarks, ride-fare comparison (needs login), community and per-user counts (`/api/stats`, `/api/stats/me`).
- Optional integrations, not configured locally: Google Maps (map page needs `VITE_GOOGLE_MAPS_API_KEY`), Cloudinary (photo uploads), Google sign-in. The UI must degrade gracefully without them.
- Reels/video UI is not built; `/uploads` is the place feed.
- Open decision: the product name. The repo uses "Tourism", "TravelExplorer", "Tourism Explorer" and "Travel Explorer". The working name is **Travel Explorer** (backend, docs, API message) until the owner decides.

## Evidence on Hand

- Local sample data from `npm run seed`: 12 real Indian landmarks and food spots with real coordinates and verified Unsplash photos of each landmark, plus synthetic sample travelers, reviews, threads and one group visit. All people and reviews are sample content.
- No real user counts, testimonials, ratings, press or partnerships. Never show invented numbers; counts come from `/api/stats`. Unrated places show as unrated, never a fallback rating.

## Product Principles

1. Facts over flattery: show what a place costs, when it is open and how long it takes before any adjective.
2. Every number is real. If the data doesn't exist yet, say so plainly.
3. The community is the proof. Reviews, threads and group visits sit with the place, not on separate pages.
4. Works without the extras. Missing map keys, upload keys or Google sign-in never leave a broken screen.
