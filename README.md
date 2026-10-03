# Wedding website

Static, responsive wedding invitation for Thành Vinh and Giang Thanh. Published at `https://mahuha80.github.io/wedding/` from the public `main` branch. The green, warm white and cream design leaves unconfirmed dates, locations and couple photos as clear placeholders.

## Update content

Edit only `content.js` for the names, wording, date, venue, event details and photo paths. Empty details appear as an update notice; no date or venue is invented. Put your own photos in a new `assets/photos/` folder and set `heroPhoto` and `photos`. The hero portrait is cropped to 4:5 on mobile; keep both faces in the central safe area. Update `pageTitle` if the names change.

The first visit presents an envelope. Guests choose “Mở thiệp yên lặng” or “Mở thiệp cùng nhạc”; the envelope opens into a personalized card and stays open until the guest chooses “Vào xem lời mời”, scrolls down, swipes up, or presses Down/PageDown/Space. Escape opens the site directly. The viewed state is remembered per recipient name for the current browser session; “Mở lại thiệp mời” replays it. Reduced-motion visitors see the expanded invitation immediately.

Personalize the recipient with a query parameter, for example `https://mahuha80.github.io/wedding/?name=Anh%20A`. If the URL already has a query parameter, append `&name=Anh%20A`. The name appears on the open card and in the invitation section. A missing or empty name leaves the generic invitation intact. The form `/wedding&name=...` is a different path and does not route to this GitHub Pages site.

The music path is `musicSrc` in `content.js`. The included track is *Daily Beetle* by Kevin MacLeod featuring Brett VanDonsel, licensed under CC BY 4.0 ([track and license](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500025)). Its credit appears in the footer. Music starts only when a guest chooses the music opening or taps a music control. A failed audio load is reported, and hiding the browser tab pauses playback. To change music, use a recording whose license allows redistribution and update its credit in the footer. Setting `musicSrc` to an empty string hides music controls while keeping the invitation animation.

For each event, set `date`, `arrival`, `start`, `venue`, `address` and a verified `mapUrl`. Set both `startAt` and `endAt` as ISO 8601 dates with a time-zone offset to show the downloadable calendar link. An event intended only for family should **not** be added to this public file. Public GitHub Pages cannot restrict individual guests or securely collect RSVPs; add a private service before enabling either of those features. Do not commit guest lists, bank details, personal contacts or private responses.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/wedding/` if this directory is named `wedding`; otherwise open the server's directory path. No dependencies are required.

## GitHub Pages

Changes committed to `main` are deployed automatically from the repository root. All local paths are relative, so the site works under the `/wedding/` prefix.
