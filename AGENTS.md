# Japan travel plan: maintenance

This repository powers the Japan trip website at:

https://xixi5527.github.io/japan-travel-plan-site/

## Maintenance rules

- Treat `trip-data.json` as the source of truth for flights, hotels, tickets, daily schedules, and preparation items.
- Preserve the mobile-first layout and the late-autumn Japanese ryokan visual direction.
- Do not publish passport numbers, booking references, phone numbers, email addresses, payment details, or other sensitive personal data.
- Hotel names and public addresses may appear; private booking details may not.
- Do not invent missing bookings, times, transport, or confirmation states. Keep unknown facts marked as pending.
- Preserve all 8 days from 2026-11-27 through 2026-12-04 and the group size of 2 unless the user provides an update.

## Before publishing

1. Run `node scripts/validate-cloud.mjs`.
2. Review the diff for accidental private information.
3. Commit the change on a task branch and open a pull request to `main`.
4. Merge only after validation succeeds, then verify GitHub Pages.

For itinerary updates, prefer changing only `trip-data.json`.
