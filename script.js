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
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', data.heroMessage || `Lời mời cưới của ${data.groom} và ${data.bride}.`);
  const initial = (name) => [...(name || '')].find((letter) => /[\p{L}\p{N}]/u.test(letter))?.toLocaleUpperCase('vi-VN') || '';
  for (const [id, value] of [['brand-groom-initial', initial(data.groom)], ['brand-bride-initial', initial(data.bride)], ['invite-groom-initial', initial(data.groom)], ['invite-bride-initial', initial(data.bride)], ['seal-groom-initial', initial(data.groom)], ['seal-bride-initial', initial(data.bride)]]) setText(id, value);
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
    if (gateMusic) gateMusic.hidden = !musicSrc || Boolean(playing) || Boolean(gate?.classList.contains('is-expanding') || gate?.classList.contains('is-expanded'));
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
  let gateTimers = [];
  const clearGateTimers = () => { gateTimers.forEach(window.clearTimeout); gateTimers = []; };
  const finishGate = () => {
    if (!gate || gate.hidden || gate.classList.contains('is-leaving')) return;
    clearGateTimers();
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
      try { sessionStorage.setItem('wedding-invitation-opened', 'yes'); } catch {}
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
  window.addEventListener('resize', () => {
    if (gate && !gate.hidden && (gate.classList.contains('is-expanding') || gate.classList.contains('is-expanded'))) {
      Object.assign(sheet.style, fullSheetBounds());
    }
  });
  const holdInvitation = () => {
    if (!gate || gate.hidden || gate.classList.contains('is-leaving')) return;
    finishGate();
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
  const launchGate = (withMusic = false) => {
    if (!gate || gate.hidden || gate.classList.contains('is-opening') || gate.classList.contains('is-expanding') || gate.classList.contains('is-expanded') || gate.classList.contains('is-leaving')) return;
    gate.hidden = false;
    hero?.classList.remove('is-revealing');
    wheelTravel = 0;
    gate.classList.remove('is-opening', 'is-expanding', 'is-expanded', 'is-leaving');
    if (gateMusic) gateMusic.hidden = false;
    if (gateSkip?.firstChild) gateSkip.firstChild.textContent = 'Mở thiệp yên lặng ';
    if (withMusic) { optedOut = false; tryMusic(); }
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
      gateTimers.push(window.setTimeout(expandCard, 720));
    }
    syncMusic();
  };
  openInvitation?.addEventListener('click', () => {
    if (gate.hidden) {
      try { sessionStorage.removeItem('wedding-invitation-opened'); } catch {}
      gate.hidden = false;
      gate.classList.remove('is-opening', 'is-expanding', 'is-expanded', 'is-leaving');
      document.body.classList.add('gate-active');
      background.forEach((element) => { element.inert = true; });
      gateSkip?.focus({ preventScroll: true });
    }
    launchGate(false);
  });
  gateSkip?.addEventListener('click', () => gate.classList.contains('is-expanded') ? finishGate() : launchGate(false));
  gateMusic?.addEventListener('click', () => launchGate(true));
  gateContinue?.addEventListener('click', () => finishGate());
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
    if (event.key === 'Escape') finishGate();
    if (gate.classList.contains('is-expanded') && ['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault(); finishGate(); return;
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
  audio?.addEventListener('error', () => {
    if (musicLabel) musicLabel.textContent = 'Nhạc chưa khả dụng';
    musicToggle?.setAttribute('aria-label', 'Nhạc chưa khả dụng');
    musicToggle?.setAttribute('aria-pressed', 'false');
  });
  let pausedForHiddenTab = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && audio && !audio.paused) { pausedForHiddenTab = true; audio.pause(); }
    else if (!document.hidden && pausedForHiddenTab) { pausedForHiddenTab = false; }
  });
  const deepLink = Boolean(window.location.hash && document.querySelector(window.location.hash));
  let alreadyOpened = false;
  try { alreadyOpened = sessionStorage.getItem('wedding-invitation-opened') === 'yes'; } catch {}
  if (alreadyOpened || deepLink) gate.hidden = true;
  else {
    gate.hidden = false;
    document.body.classList.add('gate-active');
    background.forEach((element) => { element.inert = true; });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(sheet.style, fullSheetBounds());
      gate.classList.add('is-expanding', 'is-expanded');
      sheet?.removeAttribute('aria-hidden');
      if (gateSkip?.firstChild) gateSkip.firstChild.textContent = 'Vào website ';
      if (gateMusic) gateMusic.hidden = true;
      gateSkip?.focus({ preventScroll: true });
      if (gateContinue) gateContinue.hidden = false;
    } else gateSkip?.focus({ preventScroll: true });
  }
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
    image.alt = data.heroPhotoAlt || `Ảnh cưới của ${data.groom} và ${data.bride}`;
    image.width = data.heroPhotoWidth || 1200;
    image.height = data.heroPhotoHeight || 1500;
    image.fetchPriority = 'high';
    image.style.objectPosition = data.heroPhotoPosition || 'center';
    heroFrame.setAttribute('role', 'img');
    heroFrame.setAttribute('aria-label', image.alt);
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
      image.width = photo.width || 1200;
      image.height = photo.height || 1500;
      if (photo.srcSet) image.srcset = photo.srcSet;
      if (photo.sizes) image.sizes = photo.sizes;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.style.objectPosition = photo.position || 'center';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Xem ảnh lớn: ${image.alt}`);
      figure.append(image, make('figcaption', '', photo.caption || 'Khoảnh khắc của chúng mình'));
      photoGrid.append(figure);
    });
  }
  const galleryImages = [...document.querySelectorAll('.gallery-photo')];
  galleryImages.forEach((image) => image.addEventListener('error', () => {
    const figure = image.closest('figure');
    const fallback = make('div', 'photo-error-card', 'Ảnh đang được chuẩn bị');
    image.replaceWith(fallback);
    const index = galleryImages.indexOf(image);
    if (index >= 0) galleryImages.splice(index, 1);
    if (galleryTrigger === image) galleryTrigger = null;
  }));
  const galleryDialog = document.getElementById('gallery-dialog');
  const dialogImage = document.getElementById('gallery-dialog-image');
  const dialogCaption = document.getElementById('gallery-dialog-caption');
  let galleryIndex = 0;
  let galleryTrigger = null;
  const showGalleryImage = (index) => {
    if (!galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[galleryIndex];
    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || '';
    const controlsHidden = galleryImages.length < 2;
    document.getElementById('gallery-previous').hidden = controlsHidden;
    document.getElementById('gallery-next').hidden = controlsHidden;
  };
  const openGallery = (image) => {
    galleryTrigger = image;
    showGalleryImage(galleryImages.indexOf(image));
    galleryDialog?.showModal();
  };
  galleryImages.forEach((image, index) => {
    image.addEventListener('click', () => openGallery(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openGallery(image); }
    });
  });
  document.getElementById('gallery-close')?.addEventListener('click', () => galleryDialog.close());
  document.getElementById('gallery-previous')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  document.getElementById('gallery-next')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  galleryDialog?.addEventListener('close', () => galleryTrigger?.focus());
  galleryDialog?.addEventListener('click', (event) => { if (event.target === galleryDialog) galleryDialog.close(); });
  let galleryTouchStart = null;
  galleryDialog?.addEventListener('touchstart', (event) => { galleryTouchStart = event.touches[0]?.clientX ?? null; }, { passive: true });
  galleryDialog?.addEventListener('touchend', (event) => {
    if (galleryTouchStart === null || galleryImages.length < 2) return;
    const delta = event.changedTouches[0].clientX - galleryTouchStart;
    if (Math.abs(delta) > 45) showGalleryImage(galleryIndex + (delta < 0 ? 1 : -1));
    galleryTouchStart = null;
  });
  document.addEventListener('keydown', (event) => {
    if (!galleryDialog?.open) return;
    if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
    if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
  });
  (data.events || []).forEach((event, index) => {
    const card = eventList?.children[index];
    if (!card) return;
    const body = card.querySelector('.event-card-body');
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    if (event.startAt && event.endAt && Number.isFinite(start.valueOf()) && Number.isFinite(end.valueOf()) && end > start) {
      const pad = (value) => String(value).padStart(2, '0');
      const format = (date) => `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
      const escapeIcs = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//VI', 'BEGIN:VEVENT', `UID:${index + 1}-${start.valueOf()}@wedding`, `DTSTAMP:${format(new Date())}`, `DTSTART:${format(start)}`, `DTEND:${format(end)}`, `SUMMARY:${escapeIcs(event.title)}`, `LOCATION:${escapeIcs([event.venue, event.address].filter(Boolean).join(', '))}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const calendar = make('a', 'event-map event-calendar', 'Lưu vào lịch ↓');
      calendar.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
      calendar.download = 'loi-moi-cuoi.ics';
      calendar.style.minHeight = '48px';
      body.append(calendar);
    }
  });
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
