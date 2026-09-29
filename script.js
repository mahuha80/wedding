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

  document.title = data.pageTitle || `${data.bride} & ${data.groom} — Lời mời cưới`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `Lời mời cưới của ${data.bride} và ${data.groom}.`);
  setText('bride-name', data.bride);
  setText('groom-name', data.groom);
  setText('hero-message', data.heroMessage);
  setText('hero-date', text(data.dateLine, 'Ngày cưới đang được cập nhật'));
  setText('hero-location', text(data.locationLine, 'Địa điểm sẽ được thông báo'));
  setText('invitation-message', data.invitationMessage);
  setText('story-message', data.storyMessage);
  for (const id of ['signature', 'closing-signature', 'footer-names']) {
    if (id === 'footer-names') setText(id, `${data.bride} & ${data.groom}`);
    else {
      const element = document.getElementById(id);
      if (element) element.innerHTML = '';
      element?.append(document.createTextNode(`${data.bride} `), make('span', '', '&'), document.createTextNode(` ${data.groom}`));
    }
  }

  const heroFrame = document.getElementById('hero-photo-frame');
  if (data.heroPhoto?.trim() && heroFrame) {
    const image = make('img', 'hero-photo');
    image.src = data.heroPhoto;
    image.alt = `Ảnh cưới của ${data.bride} và ${data.groom}`;
    image.fetchPriority = 'high';
    image.addEventListener('error', () => { heroFrame.classList.remove('has-photo'); image.remove(); });
    heroFrame.prepend(image);
    heroFrame.classList.add('has-photo');
  }

  const eventList = document.getElementById('event-list');
  eventList.replaceChildren();
  (data.events || []).forEach((event, index) => {
    const card = make('article', 'event-card');
    const head = make('div', 'event-card-head');
    head.append(make('span', 'event-number', String(index + 1).padStart(2, '0')), make('span', 'eyebrow', event.label || 'THE CELEBRATION'));
    const body = make('div', 'event-card-body');
    body.append(make('h3', '', event.title));
    const date = make('p', 'event-date', text(event.date, 'Ngày tổ chức đang được cập nhật'));
    const timing = make('div', 'event-timing');
    if (event.arrival) timing.append(make('p', '', `Đón khách · ${event.arrival}`));
    if (event.start) timing.append(make('p', '', `Bắt đầu · ${event.start}`));
    const venue = make('div', 'event-venue');
    venue.append(make('strong', '', text(event.venue, 'Địa điểm sẽ được thông báo')));
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
    photoGrid.replaceChildren();
    data.photos.forEach((photo, index) => {
      const figure = make('figure', `photo-card ${index % 3 === 0 ? 'photo-card-large' : 'photo-card-small'}`);
      const image = make('img', 'gallery-photo');
      image.src = photo.src;
      image.alt = photo.alt || `Ảnh của ${data.bride} và ${data.groom}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.append(image, make('figcaption', '', photo.caption || 'Khoảnh khắc của chúng mình'));
      photoGrid.append(figure);
    });
  }
})();
