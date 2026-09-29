(() => {
  const data = window.WEDDING_CONTENT;
  if (!data) return;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  };
  const text = (value, fallback) => value?.trim() || fallback;
  const make = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value) element.textContent = value;
    return element;
  };

  document.title = data.pageTitle || `${data.groom} & ${data.bride} — Lời mời cưới`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `Lời mời cưới của ${data.groom} và ${data.bride}.`);
  setText('bride-name', data.bride);
  setText('groom-name', data.groom);
  setText('hero-message', data.heroMessage);
  setText('hero-date', text(data.dateLine, 'Thông tin ngày cưới sẽ được cập nhật'));
  const heroLocation = document.getElementById('hero-location');
  if (heroLocation) {
    heroLocation.hidden = !data.locationLine?.trim();
    if (!heroLocation.hidden) heroLocation.textContent = data.locationLine;
  }
  setText('invitation-message', data.invitationMessage);
  setText('story-message', data.storyMessage);
  const audio = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle');
  const openInvitation = document.getElementById('open-invitation');
  const openSilent = document.getElementById('open-silent');
  const gate = document.getElementById('invitation-gate');
  const gateSkip = document.getElementById('gate-skip');
  const musicLabel = musicToggle?.querySelector('.music-label');
  const musicSrc = data.musicSrc?.trim();
  if (audio && musicSrc) {
    audio.src = musicSrc;
    audio.volume = 0.32;
  } else {
    if (musicToggle) musicToggle.hidden = true;
    if (openSilent) openSilent.hidden = true;
    if (openInvitation) openInvitation.querySelector('.open-label').textContent = 'Mở thiệp';
  }
  const syncMusic = () => {
    const playing = audio && !audio.paused;
    musicToggle?.setAttribute('aria-pressed', String(Boolean(playing)));
    musicToggle?.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    if (musicLabel) musicLabel.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  };
  const toggleMusic = async () => {
    if (!audio || !musicSrc) return;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); }
    catch { musicToggle?.setAttribute('aria-label', 'Không thể phát nhạc, chạm để thử lại'); }
  };
  musicToggle?.addEventListener('click', toggleMusic);
  let hasOpened = false;
  let gateTimers = [];
  const clearGateTimers = () => { gateTimers.forEach(window.clearTimeout); gateTimers = []; };
  const finishGate = () => {
    if (!gate || gate.hidden) return;
    clearGateTimers();
    gate.hidden = true;
    gate.classList.remove('is-opening', 'is-leaving');
    document.body.classList.remove('gate-active');
    document.querySelector('.hero')?.classList.add('is-open');
    hasOpened = true;
    if (openInvitation) openInvitation.querySelector('.open-label').textContent = 'Xem lại hiệu ứng mở thiệp';
    if (openSilent) openSilent.hidden = true;
    openInvitation?.focus({ preventScroll: true });
  };
  const launchGate = (withMusic) => {
    if (!gate || !gate.hidden) return;
    // Play must be requested directly from the tap/click for mobile browsers.
    if (withMusic && audio?.paused) toggleMusic();
    gate.hidden = false;
    gate.classList.remove('is-opening', 'is-leaving');
    document.body.classList.add('gate-active');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finishGate(); return; }
    gate.classList.add('is-opening');
    gateSkip?.focus({ preventScroll: true });
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    gateTimers.push(window.setTimeout(() => gate.classList.add('is-leaving'), mobile ? 980 : 1300));
    gateTimers.push(window.setTimeout(finishGate, mobile ? 1350 : 1700));
  };
  openInvitation?.addEventListener('click', () => launchGate(!hasOpened));
  openSilent?.addEventListener('click', () => launchGate(false));
  gateSkip?.addEventListener('click', finishGate);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && gate && !gate.hidden) finishGate(); });
  audio?.addEventListener('play', syncMusic);
  audio?.addEventListener('pause', syncMusic);
  audio?.addEventListener('ended', syncMusic);
  document.addEventListener('visibilitychange', () => { if (document.hidden && audio && !audio.paused) audio.pause(); });
  for (const id of ['signature', 'closing-signature', 'footer-names']) {
    if (id === 'footer-names') setText(id, `${data.groom} & ${data.bride}`);
    else {
      const element = document.getElementById(id);
      if (element) element.innerHTML = '';
      element?.append(document.createTextNode(`${data.groom} `), make('span', '', '&'), document.createTextNode(` ${data.bride}`));
    }
  }

  const heroFrame = document.getElementById('hero-photo-frame');
  if (data.heroPhoto?.trim() && heroFrame) {
    const image = make('img', 'hero-photo');
    image.src = data.heroPhoto;
    image.alt = `Ảnh cưới của ${data.groom} và ${data.bride}`;
    image.fetchPriority = 'high';
    image.addEventListener('load', () => heroFrame.classList.add('has-photo'));
    image.addEventListener('error', () => { heroFrame.classList.remove('has-photo'); image.remove(); });
    heroFrame.prepend(image);
  }

  const eventList = document.getElementById('event-list');
  eventList.replaceChildren();
  (data.events || []).forEach((event, index) => {
    const card = make('article', 'event-card');
    const head = make('div', 'event-card-head');
    head.append(make('span', 'event-number', String(index + 1).padStart(2, '0')), make('span', 'eyebrow', event.label || 'THE CELEBRATION'));
    const body = make('div', 'event-card-body');
    body.append(make('h3', '', event.title));
    const hasDetails = [event.date, event.arrival, event.start, event.venue, event.address].some(value => value?.trim());
    if (!hasDetails) {
      body.append(make('p', 'event-pending', 'Ngày, giờ và địa điểm sẽ được cập nhật.'));
      card.append(head, body);
      eventList.append(card);
      return;
    }
    const date = make('p', 'event-date', text(event.date, 'Ngày tổ chức sẽ được cập nhật'));
    const timing = make('div', 'event-timing');
    if (event.arrival) timing.append(make('p', '', `Đón khách · ${event.arrival}`));
    if (event.start) timing.append(make('p', '', `Bắt đầu · ${event.start}`));
    const venue = make('div', 'event-venue');
    venue.append(make('strong', '', text(event.venue, 'Địa điểm sẽ được cập nhật')));
    if (event.address) venue.append(make('span', '', event.address));
    body.append(date, timing, venue);
    if (event.mapUrl) {
      const link = make('a', 'event-map', 'Xem đường đi ↗');
      link.href = event.mapUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      body.append(link);
    }
    card.append(head, body);
    eventList.append(card);
  });

  const photoGrid = document.getElementById('photo-grid');
  if (data.photos?.length) {
    photoGrid.classList.remove('is-placeholder');
    photoGrid.replaceChildren();
    data.photos.forEach((photo, index) => {
      const figure = make('figure', `photo-card ${index % 3 === 0 ? 'photo-card-large' : 'photo-card-small'}`);
      const image = make('img', 'gallery-photo');
      image.src = photo.src;
      image.alt = photo.alt || `Ảnh của ${data.groom} và ${data.bride}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.append(image, make('figcaption', '', photo.caption || 'Khoảnh khắc của chúng mình'));
      photoGrid.append(figure);
    });
  }
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = document.querySelectorAll('.invitation-body, .events-heading, .event-card, .story-heading, .photo-card, .closing h2');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    targets.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight * 0.9) {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    });
  }
})();
