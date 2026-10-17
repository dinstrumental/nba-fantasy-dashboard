# Yahoo Fantasy Basketball Dashboard (H2H 9-Cat)

A lightweight Vue 3 web app built to manage and analyze a 16-team H2H 9-category fantasy basketball roster. It calculates daily active players and projects weekly matchup stats to help you make better lineup decisions.

## Tech Stack

- **Frontend**: Vue 3 (Composition API), Vite.
- **State Management**: Pinia.
- **Data Source**: Custom local JSON generated via a browser console scraper (no paid APIs required).

## Features

- **Custom Yahoo Scraper**: A vanilla JS script that extracts projected stats directly from your Yahoo league pages. It correctly handles Yahoo's table layouts and parses raw FGM/FGA and FTM/FTA from season totals.
- **Smart 9-Cat Math**: Accurately calculates weekly FG% and FT% by summing up total makes and attempts from active players, rather than just averaging their percentages.
- **Daily Roster Simulation**: The app doesn't just sum up weekly games. It looks at each day, sorts your players by priority, fills the available active slots (PG, SG, SF, PF, C, UTIL, etc.), and leaves the rest on the bench.
- **Matchup Projections**: Compares your projected weekly totals against your opponent's and highlights winning and losing categories.

## Roadmap

- **Visual Roster Builder**: A UI to add and drop players without touching the code.
- **Local Storage Persistence**: Save custom rosters and league settings in the browser's local storage.
