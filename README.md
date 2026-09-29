# Wedding website

Static, responsive wedding invitation for Giang Thanh and Thành Vinh. Ready for GitHub Pages at `/wedding/` without a build step. The initial release deliberately leaves unconfirmed dates, locations and couple photos as visible placeholders.

## Update content

Edit only `content.js` for the names, wording, date, venue, event details and photo paths. Empty details appear as *đang được cập nhật*; no date or venue is invented. Put your own photos in a new `assets/photos/` folder and set `heroPhoto` and `photos`. The first photo is the main portrait; crop it with both faces visible on desktop and mobile. Update `pageTitle` if the names change.

For each event, set `date`, `arrival`, `start`, `venue`, `address` and a verified `mapUrl`. An event intended only for family should **not** be added to this public file. Public GitHub Pages cannot restrict individual guests or securely collect RSVPs; add a private service before enabling either of those features. Do not commit guest lists, bank details, personal contacts or private responses.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/wedding/` if this directory is named `wedding`; otherwise open the server's directory path. No dependencies are required.

## GitHub Pages

Push this directory to the `main` branch of `mahuha80/wedding`, then configure **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. The published URL should be `https://mahuha80.github.io/wedding/`. All local paths are relative, so the site works under the `/wedding/` prefix. GitHub Pages from a private repository requires an eligible paid GitHub plan; GitHub Free supports Pages for public repositories only. Keep the repository private as requested until that requirement is resolved.
