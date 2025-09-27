# NBA Fantasy H2H Schedule Optimizer

A Vue 3 web application for schedule planning and daily lineup optimization in Yahoo NBA Fantasy Basketball (Head-to-Head leagues).

It calculates the maximum possible active starting slots per day, tracks remaining season games, and compares daily game volume against matchup opponents.

## Features

- **Slot Optimizer**: Uses bipartite matching to assign multi-position players (`G`, `F`, `C`) into active starting slots (`[G, F, C, UTIL, UTIL, UTIL]`), preventing manual misallocations.
- **Live NBA & ESPN Sync**: Fetches league schedule and player rosters through local Vite proxy endpoints.
- **H2H Opponent Comparison**: Displays side-by-side daily lineups, active game counts, and bench overflows for both teams.
- **Extended Week Support**: Correctly handles 14-day merged weeks (e.g., All-Star Break) and marks fantasy playoff rounds (Weeks 18–20).
- **Rest-of-Season Counter**: Tracks total playable games remaining in the season from the current date onward.

## Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **State Management**: Pinia
- **Router**: Vue Router
- **Build Tool**: Vite (with API proxy setup for CORS)
- **Styling**: Native CSS variables

## Project Structure

```text
src/
├── assets/styles/      # Global CSS tokens and layout styles
├── components/          # Vue components (DayItem, WeekCard, SeasonTotal)
├── composables/         # Shared composition functions (useScroll)
├── stores/              # Pinia stores (scheduleStore, teamStore)
├── utils/               # Bipartite matching algorithm, date utilities, API services
└── views/               # Main dashboard view
```
