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
  const requestedName = new URLSearchParams(window.location.search).get('name');
  const recipientName = requestedName?.normalize('NFC').trim().replace(/^['“”\"]+|['“”\"]+$/g, '').replace(/\s+/g, ' ').slice(0, 60);
  if (recipientName) {
    for (const [wrapperId, nameId] of [['sheet-recipient', 'sheet-recipient-name'], ['invitation-recipient', 'invitation-recipient-name']]) {
      const wrapper = document.getElementById(wrapperId);
      const name = document.getElementById(nameId);
      if (wrapper && name) { name.textContent = recipientName; wrapper.hidden = false; }
    }
  }
  const audio = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle');
  const openInvitation = document.getElementById('open-invitation');
  const gate = document.getElementById('invitation-gate');
  const gateSkip = document.getElementById('gate-skip');
  const gateMusic = document.getElementById('gate-music');
  const gateContinue = document.getElementById('gate-continue');
  const hero = document.querySelector('.hero');
  const sheet = gate?.querySelector('.gate-transition-sheet');
  if (gate) {
    gate.setAttribute('aria-label', `Thiệp mời cưới của ${data.groom} và ${data.bride}`);
    const gateNames = gate.querySelector('.gate-heading span:last-child');
    if (gateNames) gateNames.textContent = `${data.groom} & ${data.bride}`;
    gate.querySelectorAll('.gate-card strong, .gate-transition-sheet strong').forEach((cardNames) => {
      const ampersand = make('i', '', '&');
      cardNames.replaceChildren(document.createTextNode(data.groom), document.createElement('br'), ampersand, document.createElement('br'), document.createTextNode(data.bride));
    });
    const sheetMessage = gate.querySelector('.sheet-message');
    if (sheetMessage) sheetMessage.textContent = data.heroMessage;
  }
  const background = document.querySelectorAll('.site-header, main, .footer, #music-toggle');
  const musicLabel = musicToggle?.querySelector('.music-label');
  const musicSrc = data.musicSrc?.trim();
  if (audio && musicSrc) {
    audio.src = musicSrc;
    audio.volume = 0.32;
  } else {
    if (musicToggle) musicToggle.hidden = true;
    if (gateMusic) gateMusic.hidden = true;
  }
  const syncMusic = () => {
    const playing = audio && !audio.paused;
    musicToggle?.setAttribute('aria-pressed', String(Boolean(playing)));
    musicToggle?.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    if (musicLabel) musicLabel.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
    if (gateMusic) gateMusic.hidden = !musicSrc || Boolean(playing);
  };
  let optedOut = false;
  const tryMusic = () => {
    if (!audio || !musicSrc || optedOut || !audio.paused) return;
    const attempt = audio.play();
    attempt?.catch(() => { syncMusic(); });
  };
  const toggleMusic = () => {
    if (!audio || !musicSrc) return;
    if (!audio.paused) { optedOut = true; audio.pause(); return; }
    optedOut = false;
    tryMusic();
  };
  musicToggle?.addEventListener('click', toggleMusic);
  gateMusic?.addEventListener('click', (event) => { event.stopPropagation(); optedOut = false; tryMusic(); });
  let gateTimers = [];
  const clearGateTimers = () => { gateTimers.forEach(window.clearTimeout); gateTimers = []; };
  const finishGate = (fromGesture = false) => {
    if (!gate || gate.hidden || gate.classList.contains('is-leaving')) return;
    clearGateTimers();
    if (fromGesture) tryMusic();
    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      sheet?.removeEventListener('transitionend', onSheetEnd);
      clearGateTimers();
      gate.hidden = true;
      gate.classList.remove('is-opening', 'is-expanding', 'is-expanded', 'is-leaving');
      if (sheet) { sheet.removeAttribute('style'); sheet.setAttribute('aria-hidden', 'true'); }
      if (gateContinue) gateContinue.hidden = true;
      document.body.classList.remove('gate-active', 'gate-leaving');
      background.forEach((element) => { element.inert = false; });
      hero?.classList.add('is-open');
      hero?.classList.remove('is-revealing');
      hero?.focus({ preventScroll: true });
    };
    const onSheetEnd = (event) => {
      if (event.target === sheet && event.propertyName === 'transform') complete();
    };
    hero?.classList.add('is-revealing');
    gate.classList.add('is-leaving');
    document.body.classList.add('gate-leaving');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) complete();
    else {
      sheet?.addEventListener('transitionend', onSheetEnd);
      gateTimers.push(window.setTimeout(complete, 1250));
    }
  };
  const fullSheetBounds = () => {
    const inset = window.innerWidth <= 760 ? 10 : 24;
    return { left: `${inset}px`, top: `${inset}px`, width: `${window.innerWidth - inset * 2}px`, height: `${window.innerHeight - inset * 2}px` };
  };
  const holdInvitation = () => {
    if (!gate || gate.hidden || gate.classList.contains('is-leaving')) return;
    gate.classList.add('is-expanded');
    sheet?.removeAttribute('aria-hidden');
    if (gateSkip?.firstChild) gateSkip.firstChild.textContent = 'Vào website ';
    if (gateContinue) { gateContinue.hidden = false; gateContinue.focus({ preventScroll: true }); }
  };
  const expandCard = () => {
    if (!gate || gate.hidden || !sheet) return;
    const card = gate.querySelector('.gate-card');
    const start = card.getBoundingClientRect();
    Object.assign(sheet.style, { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px` });
    gate.classList.add('is-expanding');
    // One rendered frame is needed for the paper to travel from its envelope position.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (gate.hidden || !gate.classList.contains('is-expanding')) return;
      Object.assign(sheet.style, fullSheetBounds());
    }));
    gateTimers.push(window.setTimeout(holdInvitation, 1000));
  };
  const launchGate = () => {
    if (!gate || !gate.hidden) return;
    gate.hidden = false;
    hero?.classList.remove('is-revealing');
    wheelTravel = 0;
    gate.classList.remove('is-opening', 'is-expanding', 'is-expanded', 'is-leaving');
    if (gateSkip?.firstChild) gateSkip.firstChild.textContent = 'Bỏ qua hiệu ứng ';
    document.body.classList.add('gate-active');
    document.body.classList.remove('gate-leaving');
    background.forEach((element) => { element.inert = true; });
    gateSkip?.focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(sheet.style, fullSheetBounds());
      gate.classList.add('is-expanding');
      holdInvitation();
    }
    else {
      gate.classList.add('is-opening');
      gateTimers.push(window.setTimeout(expandCard, 1450));
    }
    syncMusic();
  };
  openInvitation?.addEventListener('click', launchGate);
  gateSkip?.addEventListener('click', () => finishGate(true));
  gateContinue?.addEventListener('click', () => finishGate(true));
  gate?.addEventListener('click', (event) => { if (event.target === gate || event.target.classList.contains('gate-petals')) finishGate(true); });
  gate?.addEventListener('wheel', (event) => {
    if (!gate.classList.contains('is-expanded')) return;
    event.preventDefault();
    wheelTravel = event.deltaY > 0 ? wheelTravel + event.deltaY : 0;
    if (wheelTravel > 35) { wheelTravel = 0; finishGate(); }
  }, { passive: false });
  let wheelTravel = 0;
  let touchStartY = null;
  gate?.addEventListener('touchstart', (event) => { touchStartY = event.touches[0]?.clientY ?? null; }, { passive: true });
  gate?.addEventListener('touchmove', (event) => {
    if (gate.classList.contains('is-expanded')) event.preventDefault();
  }, { passive: false });
  gate?.addEventListener('touchend', (event) => {
    if (gate.classList.contains('is-expanded') && touchStartY !== null && touchStartY - event.changedTouches[0].clientY > 45) finishGate();
    touchStartY = null;
  });
  document.addEventListener('keydown', (event) => {
    if (!gate || gate.hidden) return;
    if (event.key === 'Escape') finishGate(true);
    if (gate.classList.contains('is-expanded') && ['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault(); finishGate(true); return;
    }
    if (event.key === 'Tab') {
      const focusable = [gateSkip, gateMusic, gateContinue].filter((element) => element && !element.hidden);
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); focusable[0]?.focus(); }
    }
  });
  audio?.addEventListener('play', syncMusic);
  audio?.addEventListener('pause', syncMusic);
  audio?.addEventListener('ended', syncMusic);
  document.addEventListener('visibilitychange', () => { if (document.hidden && audio && !audio.paused) audio.pause(); });
  launchGate();
  tryMusic();
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
