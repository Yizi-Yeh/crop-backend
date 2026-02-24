# Analysis 12-Month Mock Data Design

## Context
The API reads data from PostgreSQL via Prisma. Mock data is loaded into the database by `prisma/seed.js`, which imports `src/data/mockData.js`. The `analysis` payload the user wants to expand lives under `calendarDetails[0].analysis` in `src/data/mockData.js`.

## Goal
Provide full 12-month daily `analysis` data for the indicators in `calendarDetails[0].analysis` so the API returns complete monthly daily details.

## Approach Options
1. Update `src/data/mockData.js` directly with full 12-month daily values. (Recommended)
2. Generate daily values dynamically in `prisma/seed.js` at seed time.
3. Move `analysis` into a separate JSON file and load it in `prisma/seed.js`.

Recommendation: Option 1 for deterministic, self-contained mock data.

## Data Generation Rules
- Use the provided 5-day samples as the base pattern.
- For each month, generate entries for all days (1..last day of month).
- For each day, derive `current_value` and `future_value` from the base sample day with small, reasonable variations.
- Preserve value ranges implied by the samples and avoid unrealistic spikes.

## Scope
- Edit only `src/data/mockData.js` under `calendarDetails[0].analysis`.
- No changes to routes, services, or Prisma schema.

## Risks
- File size increase in `src/data/mockData.js`.
- Potential for value range assumptions to be too aggressive; keep deltas small.

## Validation
- Re-run the API and confirm the response for `/api/crop-calendars/crops/:cropId/calendars/:calendarId` returns 12 months with daily details.
- Spot-check a few days to ensure values follow the expected small-variation pattern.
