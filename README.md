# Wedding website

Static, responsive wedding invitation for Thành Vinh and Giang Thanh. Published at `https://mahuha80.github.io/wedding/` from the public `main` branch. The green, warm white and cream design leaves unconfirmed dates, locations and couple photos as clear placeholders.

## Update content

Edit only `content.js` for the names, wording, date, venue, event details and photo paths. Empty details appear as an update notice; no date or venue is invented. Put your own photos in a new `assets/photos/` folder and set `heroPhoto` and `photos`. The hero portrait is cropped to 4:5 on mobile; keep both faces in the central safe area. Update `pageTitle` if the names change.

The first visit presents a still envelope. Guests choose “Mở thiệp yên lặng” or “Mở thiệp cùng nhạc”; the envelope then opens, and a downward scroll, upward swipe, Down/PageDown/Space key, or “Vào xem lời mời” reveals the site. Escape and the visible buttons work at every step. Later visits in the same browser session go directly to the site; “Mở lại thiệp mời” replays it. Reduced-motion visitors see the still expanded invitation immediately.

Personalize the recipient with a query parameter, for example `https://mahuha80.github.io/wedding/?name=Anh%20A`. If the URL already has a query parameter, append `&name=Anh%20A`. The name appears on the expanded invitation and in the invitation section. A missing or empty name leaves the generic invitation intact. The form `/wedding&name=...` is a different path and does not route to this GitHub Pages site.

The music path is `musicSrc` in `content.js`. The included recording is Felix Mendelssohn's *Venetian Gondola Song No. 2*, performed and released into CC0 by Membeth ([source and license](https://commons.wikimedia.org/wiki/File:Mendelssohn.Venetianisches.Gondellied.opus.30.6.ogg)). The local MP3 is transcoded from that recording. Music starts only when a guest chooses the music opening or taps the fixed music control. A failed audio load is reported, and hiding the browser tab pauses playback. To change music, use a recording whose license allows redistribution and update the credit in the footer. Setting `musicSrc` to an empty string hides music controls while keeping the invitation animation.

For each event, set `date`, `arrival`, `start`, `venue`, `address` and a verified `mapUrl`. Set both `startAt` and `endAt` as ISO 8601 dates with a time-zone offset to show the downloadable calendar link. An event intended only for family should **not** be added to this public file. Public GitHub Pages cannot restrict individual guests or securely collect RSVPs; add a private service before enabling either of those features. Do not commit guest lists, bank details, personal contacts or private responses.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/wedding/` if this directory is named `wedding`; otherwise open the server's directory path. No dependencies are required.

## GitHub Pages

Changes committed to `main` are deployed automatically from the repository root. All local paths are relative, so the site works under the `/wedding/` prefix.
