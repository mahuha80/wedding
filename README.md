# Wedding website

Static, responsive wedding invitation for Thành Vinh and Giang Thanh. Published at `https://mahuha80.github.io/wedding/` from the public `main` branch. The green, warm white and cream design leaves unconfirmed dates, locations and couple photos as clear placeholders.

## Update content

Edit only `content.js` for the names, wording, date, venue, event details and photo paths. Empty details appear as an update notice; no date or venue is invented. Put your own photos in a new `assets/photos/` folder and set `heroPhoto` and `photos`. The hero portrait is cropped to 4:5 on mobile; keep both faces in the central safe area. Update `pageTitle` if the names change.

For each event, set `date`, `arrival`, `start`, `venue`, `address` and a verified `mapUrl`. An event intended only for family should **not** be added to this public file. Public GitHub Pages cannot restrict individual guests or securely collect RSVPs; add a private service before enabling either of those features. Do not commit guest lists, bank details, personal contacts or private responses.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/wedding/` if this directory is named `wedding`; otherwise open the server's directory path. No dependencies are required.

## GitHub Pages

Changes committed to `main` are deployed automatically from the repository root. All local paths are relative, so the site works under the `/wedding/` prefix.
