/* Cancer Imaging Lab - interactions */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const publications = Array.isArray(window.CAIG_PUBLICATIONS) ? window.CAIG_PUBLICATIONS : [];
  const authorProfiles = window.CAIG_AUTHORS || {};
  const newsData = window.CAIG_NEWS || {};
  const researchData = window.CAIG_RESEARCH || {};
  const memberData = window.CAIG_MEMBERS || {};
  const groupData = window.CAIG_GROUP || {};
  const manualAnnouncements = newsData.manualAnnouncements || { paper: [], alumni: [] };
  const defaultPublicationLink = newsData.defaultPublicationLink || '#home';
  const defaultAnnouncementDate = newsData.defaultAnnouncementDate || '01 Aug 2026';
  const publicationState = { year: 'all', type: 'all' };

  const header = $('#header');
  const nav = $('#site-nav');
  const toggle = $('.nav-toggle');
  const navLinks = $$('.nav-link');
  const sections = ['home','about','announcements','research','team','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const memberIconMarkup = {
    portfolio: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Z" stroke="currentColor" stroke-width="2" opacity=".9"/><path d="M2 12h20" stroke="currentColor" stroke-width="2" opacity=".7"/><path d="M12 2c3 3.4 3 16.6 0 20" stroke="currentColor" stroke-width="2" opacity=".7"/><path d="M12 2c-3 3.4-3 16.6 0 20" stroke="currentColor" stroke-width="2" opacity=".7"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M6.5 6.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" fill="currentColor"/><path d="M4 9h2.7v11H4z" fill="currentColor"/><path d="M10 9h2.6v1.5h.04c.36-.68 1.24-1.9 3.1-1.9 3.3 0 3.9 2.2 3.9 5v6.4H17V14.3c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V20H10z" fill="currentColor"/></svg>',
    github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.35-1.17-3.35-1.17-.45-1.14-1.1-1.45-1.1-1.45-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.64-1.32-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.97 1.03-2.66-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.69 1.03 1.58 1.03 2.66 0 3.81-2.34 4.65-4.57 4.9.36.31.69.92.69 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" fill="currentColor" opacity=".9"/></svg>',
    'google-scholar': '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M12 3 2 8l10 5 10-5-10-5Z" fill="currentColor" opacity=".9"/><path d="M6 10v4.4c0 .7 3 3.1 6 3.1s6-2.4 6-3.1V10l-6 3-6-3Z" fill="currentColor" opacity=".65"/></svg>',
    orcid: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12"></circle><path d="M9 7.8h1.8V16H9V7.8Zm2.9 0h3.1c2.2 0 3.8 1.5 3.8 4.1S17.2 16 15 16h-3.1V7.8Zm1.8 1.6V14.4H15c1.3 0 2.1-.9 2.1-2.5s-.8-2.5-2.1-2.5h-1.3Z" fill="currentColor" opacity=".9"/></svg>',
    email: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M4 6h16v12H4V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  const asArray = value => Array.isArray(value) ? value : [];

  function renderResearchAreas(){
    const root = $('[data-research-areas]');
    if (!root) return;

    const cards = asArray(researchData.areas).map(area => {
      const article = document.createElement('article');
      article.className = 'feature-card';

      const icon = document.createElement('div');
      icon.className = 'feature-icon';
      icon.setAttribute('aria-hidden', 'true');

      if (area.image?.src){
        const img = document.createElement('img');
        img.className = 'feature-img';
        img.setAttribute('src', area.image.src);
        img.setAttribute('alt', area.image.alt || '');
        icon.append(img);
      }

      const title = document.createElement('h3');
      title.textContent = area.title || '';

      const description = document.createElement('p');
      description.textContent = area.description || '';

      article.append(icon, title, description);
      return article;
    });

    root.replaceChildren(...cards);
  }

  function renderResearchProjects(){
    const root = $('[data-research-projects]');
    if (!root) return;

    const cards = asArray(researchData.projects).map(project => {
      const article = document.createElement('article');
      article.className = 'project-card';

      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.setAttribute('href', project.href || '#');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Project link');
      link.textContent = project.title || '';
      heading.append(link);
      article.append(heading);

      asArray(project.tagGroups).forEach(group => {
        const tags = document.createElement('div');
        tags.className = 'tags';
        asArray(group).forEach(text => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = text;
          tags.append(tag);
        });
        article.append(tags);
      });

      return article;
    });

    root.replaceChildren(...cards);
  }

  function createMemberLink(member, linkData){
    const link = document.createElement('a');
    link.className = 'icon-link';
    link.setAttribute('href', linkData.href || '#');
    link.setAttribute('aria-label', linkData.label || 'Profile');

    const isMailLink = /^mailto:/i.test(linkData.href || '');
    if (!isMailLink){
      link.target = '_blank';
      link.rel = member.id !== 'sneha' && ['linkedin', 'github'].includes(linkData.icon)
        ? 'noopener'
        : 'noopener noreferrer';
    }

    link.innerHTML = memberIconMarkup[linkData.icon] || '';
    return link;
  }

  function createPublicationsAccordion(member){
    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    accordion.dataset.accordion = '';

    const button = document.createElement('button');
    button.className = 'accordion-trigger';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', member.publicationsPanelId || `${member.id}-pubs`);

    const label = document.createElement('span');
    label.textContent = 'See publications';
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.append(label, icon);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.id = member.publicationsPanelId || `${member.id}-pubs`;
    panel.hidden = true;

    const list = document.createElement('ol');
    list.className = 'pub-list compact';
    list.dataset.publicationList = member.publicationTarget || member.id || 'all';
    panel.append(list);

    accordion.append(button, panel);
    return accordion;
  }

  function createMemberArticle(member, options = {}){
    const article = document.createElement('article');
    article.className = member.className || 'spotlight spotlight-sm';

    const media = document.createElement('div');
    media.className = member.mediaClassName || 'spotlight-media';
    const image = document.createElement('img');
    image.setAttribute('src', member.image?.src || '');
    image.setAttribute('alt', member.image?.alt || member.name || '');
    image.setAttribute('loading', member.image?.loading || 'eager');
    media.append(image);

    const body = document.createElement('div');
    body.className = 'spotlight-body';

    const title = document.createElement('h3');
    title.textContent = member.name || '';
    const role = document.createElement('p');
    role.className = 'role';
    role.textContent = member.role || '';

    if (options.featured){
      const top = document.createElement('div');
      top.className = 'spotlight-top';
      top.append(title, role);
      body.append(top);
    } else {
      body.append(title, role);
    }

    const bio = document.createElement('p');
    bio.className = member.bioClassName || 'bio bio-sm';
    bio.textContent = member.bio || '';
    body.append(bio);

    const contact = document.createElement('div');
    contact.className = 'contact-row';
    contact.append(...asArray(member.links).map(link => createMemberLink(member, link)));
    body.append(contact, createPublicationsAccordion(member));

    article.append(media, body);
    return article;
  }

  function renderMembers(){
    const root = $('[data-members-root]');
    if (!root) return;

    const nodes = [];
    if (memberData.faculty){
      nodes.push(createMemberArticle(memberData.faculty, { featured: true }));
    }

    const students = asArray(memberData.students);
    if (students.length){
      const wrap = document.createElement('div');
      wrap.className = 'pg-wrap reveal';

      const accordion = document.createElement('div');
      accordion.className = 'accordion';
      accordion.dataset.accordion = '';

      const button = document.createElement('button');
      button.className = 'accordion-trigger';
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'pg-members-panel');

      const label = document.createElement('span');
      label.textContent = 'View Research Group';
      const icon = document.createElement('span');
      icon.className = 'accordion-icon';
      icon.setAttribute('aria-hidden', 'true');
      button.append(label, icon);

      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.id = 'pg-members-panel';
      panel.hidden = true;

      const list = document.createElement('div');
      list.className = 'member-list';
      list.append(...students.map(member => createMemberArticle(member)));
      panel.append(list);

      accordion.append(button, panel);
      wrap.append(accordion);
      nodes.push(wrap);
    }

    root.replaceChildren(...nodes);
  }

  function renderGroupGallery(){
    const root = $('[data-group-gallery-root]');
    const items = asArray(groupData.items);
    if (!root || !items.length) return;

    let activeIndex = 0;
    let trackIndex = 0;
    let timer = 0;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const interval = Number(groupData.interval) > 0 ? Number(groupData.interval) : 5200;

    const section = document.createElement('section');
    section.className = 'team-gallery reveal';
    section.setAttribute('aria-label', groupData.title || 'Memorable Moments');

    const head = document.createElement('div');
    head.className = 'team-gallery-head';

    const title = document.createElement('h3');
    title.textContent = groupData.title || 'Memorable Moments';

    const description = document.createElement('p');
    description.textContent = groupData.description || '';
    if (groupData.eyebrow){
      const eyebrow = document.createElement('span');
      eyebrow.className = 'team-gallery-eyebrow';
      eyebrow.textContent = groupData.eyebrow;
      head.append(eyebrow);
    }
    head.append(title);
    if (groupData.description) head.append(description);

    const slider = document.createElement('div');
    slider.className = 'group-slider';
    slider.setAttribute('aria-roledescription', 'carousel');

    const stage = document.createElement('div');
    stage.className = 'group-slider-stage';
    stage.setAttribute('aria-live', 'polite');

    function createGroupSlide(item, index){
      const figure = document.createElement('figure');
      figure.className = 'group-slide';
      figure.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');

      const image = document.createElement('img');
      image.setAttribute('src', item.image || '');
      image.setAttribute('alt', item.alt || item.title || 'CAIG Lab group moment');
      image.setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      image.addEventListener('error', () => {
        figure.classList.add('is-missing');
        image.removeAttribute('src');
        image.setAttribute('alt', 'Add this image in img_group');
      }, { once: true });

      const caption = document.createElement('figcaption');
      const captionText = document.createElement('p');
      captionText.textContent = item.description || '';
      caption.append(captionText);

      figure.append(image, caption);
      return figure;
    }

    const slides = items.map(createGroupSlide);
    const firstSlideClone = createGroupSlide(items[0], 0);
    firstSlideClone.dataset.clone = 'true';
    firstSlideClone.setAttribute('aria-hidden', 'true');

    const dots = document.createElement('div');
    dots.className = 'group-dots';
    dots.setAttribute('aria-label', 'Gallery slides');

    const dotButtons = items.map((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'group-dot';
      button.setAttribute('aria-label', `Show ${item.title || `slide ${index + 1}`}`);
      button.setAttribute('aria-current', index === 0 ? 'true' : 'false');
      button.addEventListener('click', () => showSlide(index));
      dots.append(button);
      return button;
    });

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'group-nav group-nav-prev';
    prev.setAttribute('aria-label', 'Previous group photo');
    prev.textContent = '<';

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'group-nav group-nav-next';
    next.setAttribute('aria-label', 'Next group photo');
    next.textContent = '>';

    function updateSlideState(){
      const visibleIndex = trackIndex === slides.length
        ? 0
        : (trackIndex + slides.length) % slides.length;
      activeIndex = visibleIndex;

      [...slides, firstSlideClone].forEach((slide, index) => {
        const active = index === trackIndex || (trackIndex === slides.length && slide === firstSlideClone);
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dotButtons.forEach((button, index) => {
        button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
      });
    }

    function moveTrack(nextIndex, animate = true){
      if (!animate) stage.classList.add('is-jump');
      trackIndex = nextIndex;
      stage.style.transform = `translate3d(-${trackIndex * 100}%, 0, 0)`;
      updateSlideState();
      if (!animate){
        void stage.offsetHeight;
        stage.classList.remove('is-jump');
      }
    }

    function showSlide(nextIndex){
      if (nextIndex < 0){
        moveTrack(slides.length, false);
        window.requestAnimationFrame(() => moveTrack(slides.length - 1));
        return;
      }

      moveTrack(nextIndex);
    }

    function startTimer(){
      if (reduceMotion || slides.length < 2 || timer) return;
      timer = window.setInterval(() => showSlide(activeIndex + 1), interval);
    }

    function startWhenVisible(){
      if (!('IntersectionObserver' in window)){
        startTimer();
        return;
      }

      const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          startTimer();
          galleryObserver.disconnect();
        });
      }, { threshold: 0.24 });

      galleryObserver.observe(section);
    }

    stage.addEventListener('transitionend', (event) => {
      if (event.target !== stage || trackIndex !== slides.length) return;
      moveTrack(0, false);
    });

    prev.addEventListener('click', () => showSlide(trackIndex - 1));
    next.addEventListener('click', () => showSlide(trackIndex + 1));
    stage.append(...slides, firstSlideClone);
    slider.append(stage, prev, next, dots);
    section.append(head, slider);
    root.replaceChildren(section);
    moveTrack(0, false);
    startWhenVisible();
  }

  renderResearchAreas();
  renderResearchProjects();
  renderMembers();
  renderGroupGallery();

  // -------------------------
  // Mobile menu
  // -------------------------
  function closeMenu(){
    if (!nav) return;
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
  function openMenu(){
    if (!nav) return;
    nav.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
  }
  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    (isOpen ? closeMenu : openMenu)();
  });
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('is-open')) return;
    const within = nav.contains(e.target) || toggle.contains(e.target);
    if (!within) closeMenu();
  }, { passive:true });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // -------------------------
  // Smooth scroll with header offset
  // -------------------------
  function headerOffset(){
    return header ? header.getBoundingClientRect().height : 0;
  }
  function scrollToId(id){
    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - headerOffset() + 1;
    pendingNavTarget = id;
    pendingNavY = Math.max(0, Math.round(y));
    clearTimeout(pendingNavTimer);
    pendingNavTimer = window.setTimeout(() => {
      pendingNavTarget = '';
      pendingNavY = null;
      onScroll();
    }, 1200);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      e.preventDefault();
      closeMenu();
      // update active immediately to prevent flicker
      setActive(id);
      scrollToId(id);
    });
  });

  // -------------------------
  // Scrollspy (no flicker)
  // -------------------------
  let ticking = false;
  let lastActive = 'home';
  let pendingNavTarget = '';
  let pendingNavY = null;
  let pendingNavTimer = 0;

  function setActive(sectionId){
    lastActive = sectionId;
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      const is = href === `#${sectionId}`;
      a.classList.toggle('is-active', is);
      if (is) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // Stable scrollspy: choose the last section whose top is above the header line.
  // This avoids "fluctuating" between two items around boundaries.
  function computeActiveSection(){
    const y = window.scrollY + headerOffset() + 20;
    if (window.scrollY < 10) return 'home';

    let current = 'home';
    for (const s of sections){
      if (s.offsetTop <= y) current = s.id;
      else break;
    }
    return current;
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      if (pendingNavTarget){
        const reachedTarget = pendingNavY !== null && Math.abs(window.scrollY - pendingNavY) <= 6;
        if (reachedTarget){
          setActive(pendingNavTarget);
          pendingNavTarget = '';
          pendingNavY = null;
          clearTimeout(pendingNavTimer);
        }
        ticking = false;
        return;
      }
      const next = computeActiveSection();
      if (next && next !== lastActive) setActive(next);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll, { passive:true });
  setActive('home');
  onScroll();

  // -------------------------
  // Publications
  // -------------------------
  function publicationBelongsTo(pub, target){
    return target === 'all' || (Array.isArray(pub.showIn) && pub.showIn.includes(target));
  }

  function publicationTypes(pub){
    if (Array.isArray(pub.type)) return pub.type;
    return pub.type ? [pub.type] : [];
  }

  function publicationTypeLabel(type){
    return type === 'journal' ? 'Journal' : 'Conference';
  }

  function isJournalPublication(pub){
    return publicationTypes(pub).includes('journal');
  }

  function publicationVenueText(pub){
    const venue = [pub.name, pub.year].filter(Boolean).join(', ');
    const details = [venue];
    if (!isJournalPublication(pub) && pub.location) details.push(pub.location);
    return details.filter(Boolean).join(' | ');
  }

  function isCaigAuthor(authorName){
    return Object.values(authorProfiles).some(author => author?.name === authorName);
  }

  function sanitizePublicationAuthorName(authorName){
    return String(authorName || '').replace(/^Dr\.?\s+/i, '').trim();
  }

  function publicationAuthorsText(pub){
    if (!Array.isArray(pub.authors) || !pub.authors.length) return '';
    return `[${pub.authors.map(sanitizePublicationAuthorName).join(', ')}]`;
  }

  function publicationYear(pub){
    return Number(pub.year) || null;
  }

  function publicationVenueCode(pub){
    const name = pub.venueCode || pub.name || '';
    const matches = [...name.matchAll(/\(([^)]+)\)/g)];
    if (matches.length) return matches[matches.length - 1][1];
    return name.trim();
  }

  function latestPublicationYear(){
    const years = publications.map(publicationYear).filter(Boolean);
    return years.length ? Math.max(...years) : null;
  }

  function availablePublicationYears(){
    return [...new Set(publications.map(publicationYear).filter(Boolean))].sort((a, b) => b - a);
  }

  function authorPronoun(authorName){
    const profile = Object.values(authorProfiles).find(author => author?.name === authorName);
    return profile?.pronoun || 'their';
  }

  function announcementPrimaryAuthor(authors){
    if (!Array.isArray(authors) || !authors.length) return '';
    if (isCaigAuthor(authors[0])) return authors[0];
    return authors.find(isCaigAuthor) || authors[0];
  }

  function uniqueAuthors(publicationsForVenue){
    const seen = new Set();
    const authors = [];
    publicationsForVenue.forEach(pub => {
      (Array.isArray(pub.authors) ? pub.authors : []).forEach(author => {
        if (!author || seen.has(author)) return;
        seen.add(author);
        authors.push(author);
      });
    });
    return authors;
  }

  function formatAuthorList(authors){
    if (!authors.length) return 'CAIG Lab';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors.slice(0, -1).join(', ')} & ${authors[authors.length - 1]}`;
  }

  function announcementPronoun(authors){
    if (authors.length > 1) return 'their';
    return authors.length ? authorPronoun(authors[0]) : 'their';
  }

  function announcementLocationText(location){
    const cleanLocation = (location || '').trim();
    if (!cleanLocation) return '';
    const locationParts = cleanLocation.split(',').map(part => part.trim()).filter(Boolean);
    if (locationParts.length > 1) return locationParts[locationParts.length - 1];
    return cleanLocation;
  }

  const announcementMonthIndex = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11
  };

  function parseAnnouncementDate(dateText){
    const raw = String(dateText || '').trim();
    if (!raw) return 0;

    const match = raw.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
    if (match){
      const day = Number(match[1]);
      const month = announcementMonthIndex[match[2].slice(0, 3).toLowerCase()];
      const year = Number(match[3]);
      if (Number.isFinite(day) && Number.isFinite(year) && month !== undefined){
        return Date.UTC(year, month, day);
      }
    }

    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normalizeAnnouncementEntry(entry, fallbackKind){
    if (!entry) return null;
    if (typeof entry === 'string'){
      return { kind: fallbackKind, date: defaultAnnouncementDate, text: entry };
    }

    return {
      kind: entry.kind || fallbackKind,
      date: entry.date || defaultAnnouncementDate,
      text: entry.text || '',
      name: entry.name || '',
      prefix: entry.prefix || '',
      role: entry.role || '',
      locationLabel: entry.location || '',
      suffix: entry.suffix || '',
      authors: Array.isArray(entry.authors) ? entry.authors : [],
      venueName: entry.venueName || '',
      year: entry.year || '',
      location: entry.location || '',
      type: entry.type || ''
    };
  }

  function sortAnnouncements(entries){
    return [...entries].sort((a, b) => parseAnnouncementDate(b.date) - parseAnnouncementDate(a.date));
  }

  function buildLatestPaperAnnouncements(){
    const latestYear = latestPublicationYear();
    if (!latestYear) return [];

    const latestPubs = publications.filter(pub => publicationYear(pub) === latestYear);
    const grouped = new Map();

    latestPubs.forEach(pub => {
      const venueCode = publicationVenueCode(pub);
      const key = `${venueCode}::${publicationTypes(pub).join('|')}`;
      if (!grouped.has(key)){
        grouped.set(key, {
          venueName: venueCode,
          year: publicationYear(pub),
          location: pub.location || '',
          type: publicationTypes(pub),
          date: pub.date || defaultAnnouncementDate,
          authors: []
        });
      }

      const group = grouped.get(key);
      const firstAuthor = announcementPrimaryAuthor(pub.authors);
      if (firstAuthor && !group.authors.includes(firstAuthor)) group.authors.push(firstAuthor);
      if (!group.location && pub.location) group.location = pub.location;
      if (parseAnnouncementDate(pub.date) > parseAnnouncementDate(group.date)) group.date = pub.date;
    });

    return Array.from(grouped.values()).map(group => ({
      kind: 'paper',
      date: group.date || defaultAnnouncementDate,
      authors: group.authors,
      venueName: group.venueName || '',
      year: group.year,
      location: group.location || '',
      type: group.type.includes('journal') ? 'journal' : 'conference'
    }));
  }

  function buildAnnouncementEntries(kind){
    const manualEntries = Array.isArray(manualAnnouncements?.[kind]) ? manualAnnouncements[kind] : [];
    const normalizedManualEntries = manualEntries
      .map(entry => normalizeAnnouncementEntry(entry, kind))
      .filter(Boolean);

    if (kind === 'paper'){
      return sortAnnouncements([...buildLatestPaperAnnouncements(), ...normalizedManualEntries]);
    }

    return sortAnnouncements(normalizedManualEntries);
  }

  function buildAllAnnouncementEntries(){
    return sortAnnouncements([
      ...buildAnnouncementEntries('paper'),
      ...buildAnnouncementEntries('alumni')
    ]);
  }

  function isExternalLink(url){
    return /^https?:\/\//i.test(url);
  }

  function createPublicationItem(pub){
    const item = document.createElement('li');

    const title = document.createElement('span');
    title.className = 'pub-title';
    title.textContent = pub.title || '';
    item.append(title);

    const linkUrl = pub.link || defaultPublicationLink;
    if (linkUrl){
      const link = document.createElement('a');
      link.className = 'pub-link';
      link.href = linkUrl;
      link.textContent = '[DOI]';
      if (isExternalLink(linkUrl)){
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      title.append(document.createTextNode(' '), link);
    }

    const venueText = publicationVenueText(pub);
    if (venueText){
      const meta = document.createElement('span');
      meta.className = 'pub-meta';
      meta.textContent = venueText;
      item.append(meta);
    }

    const authorsText = publicationAuthorsText(pub);
    if (authorsText){
      const authors = document.createElement('span');
      authors.className = 'pub-authors';
      authors.textContent = authorsText;
      item.append(authors);
    }

    return item;
  }

  function createAnnouncementItem(entry){
    const item = document.createElement('li');
    item.className = 'ann-card';

    const date = document.createElement('span');
    date.className = 'ann-date';
    date.textContent = `🗓️ ${entry.date || defaultAnnouncementDate}`;

    const text = document.createElement('span');
    text.className = 'ann-text';

    if (entry.kind === 'paper' && Array.isArray(entry.authors) && entry.authors.length && entry.venueName){
      const author = document.createElement('strong');
      author.className = 'ann-author';
      author.textContent = formatAuthorList(entry.authors);

      const venue = document.createElement('strong');
      venue.className = 'ann-venue';
      const preposition = entry.type === 'journal' ? 'in' : 'at';
      const paperKind = entry.type === 'journal' ? 'journal paper' : 'conference paper';
      const location = entry.type === 'journal' ? '' : announcementLocationText(entry.location);
      const venueWithYear = entry.year ? `${entry.venueName} ${entry.year}` : entry.venueName;
      venue.textContent = location ? `${venueWithYear}, ${location}` : venueWithYear;
      text.append('Congratulations to ', author, ` on ${announcementPronoun(entry.authors)} ${paperKind} being accepted ${preposition} `, venue);
      text.append('! 🎉');
    } else if (entry.kind === 'alumni' && entry.name && entry.locationLabel){
      const name = document.createElement('strong');
      name.className = 'ann-author';
      name.textContent = entry.name;

      const location = document.createElement('strong');
      location.className = 'ann-venue';
      location.textContent = entry.locationLabel;

      if (entry.prefix) text.append(`${entry.prefix} `);
      text.append(name);
      if (entry.role) text.append(` ${entry.role} `);
      text.append(location);
      if (entry.suffix) text.append(` ${entry.suffix}`);
    } else {
      text.textContent = entry.text || '';
    }

    item.append(date, text);

    return item;
  }

  function publicationMatchesResearchFilters(pub){
    const yearMatch = publicationState.year === 'all' || publicationYear(pub) === Number(publicationState.year);
    const types = publicationTypes(pub);
    const typeMatch =
      publicationState.type === 'all' ||
      (publicationState.type === 'journal' && types.includes('journal')) ||
      (publicationState.type === 'conference' && types.includes('conference'));
    return yearMatch && typeMatch;
  }

  function renderPublicationList(){
    $$('[data-publication-list]').forEach(list => {
      const target = list.dataset.publicationList || 'all';
      const entries = publications.filter(pub => {
        if (!publicationBelongsTo(pub, target)) return false;
        return target !== 'all' || publicationMatchesResearchFilters(pub);
      });
      list.replaceChildren(...entries.map(createPublicationItem));
    });
  }

  function renderFilterButtons(container, values, labelForValue, currentValue, onSelect){
    if (!container) return;
    container.replaceChildren();
    values.forEach((value) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-pill';
      button.dataset.filterValue = value;
      button.textContent = labelForValue(value);
      button.classList.toggle('is-active', value === currentValue);
      button.setAttribute('aria-pressed', value === currentValue ? 'true' : 'false');
      button.addEventListener('click', () => onSelect(value));
      container.append(button);
    });
  }

  function syncFilterButtonState(container, currentValue){
    if (!container) return;
    $$('.filter-pill', container).forEach(button => {
      const active = button.dataset.filterValue === currentValue;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function renderPublicationFilters(){
    const yearContainer = $('[data-publication-year-filters]');
    const typeContainer = $('[data-publication-type-filters]');

    if (yearContainer && !yearContainer.dataset.initialized){
      renderFilterButtons(
        yearContainer,
        ['all', ...availablePublicationYears().map(String)],
        value => (value === 'all' ? 'All' : value),
        publicationState.year,
        value => {
          publicationState.year = value;
          syncFilterButtonState(yearContainer, value);
          renderPublicationList();
        }
      );
      yearContainer.dataset.initialized = 'true';
    }

    if (typeContainer && !typeContainer.dataset.initialized){
      renderFilterButtons(
        typeContainer,
        ['all', 'conference', 'journal'],
        value => (value === 'all' ? 'All' : publicationTypeLabel(value)),
        publicationState.type,
        value => {
          publicationState.type = value;
          syncFilterButtonState(typeContainer, value);
          renderPublicationList();
        }
      );
      typeContainer.dataset.initialized = 'true';
    }
  }

  renderPublicationFilters();
  renderPublicationList();

  function renderAnnouncementLists(){
    $$('[data-announcements-list]').forEach(list => {
      const kind = list.dataset.announcementsList || 'all';
      const entries = kind === 'paper'
        ? buildAnnouncementEntries('paper')
        : kind === 'alumni'
          ? buildAnnouncementEntries('alumni')
          : buildAllAnnouncementEntries();
      list.replaceChildren(...entries.map(createAnnouncementItem));
    });

    const heading = $('[data-announcements-heading]');
    if (heading){
      heading.textContent = 'Recent News';
    }
  }

  renderAnnouncementLists();

  // -------------------------
  // Tabs
  // -------------------------
  const tabs = $$('[data-tabs]');
  tabs.forEach(tabset => {
    const triggers = $$('[data-tab]', tabset);
    const panels = $$('[data-panel]', tabset);
    const isAnnouncementsTabset = tabset.dataset.tabs === 'announcements';
    let textAnimationTimer = 0;
    let activeAnnouncementTab = '';
    const animateAnnouncementText = (nextPanel, currentPanel) => {
      if (!isAnnouncementsTabset || !nextPanel) return;
      window.clearTimeout(textAnimationTimer);

      if (!currentPanel || currentPanel === nextPanel) {
        nextPanel.classList.remove('is-text-leaving', 'is-text-entering');
        void nextPanel.offsetWidth;
        nextPanel.classList.add('is-text-entering');
        textAnimationTimer = window.setTimeout(() => {
          nextPanel.classList.remove('is-text-entering');
        }, 240);
        return;
      }

      currentPanel.classList.remove('is-text-entering');
      currentPanel.classList.add('is-text-leaving');
      textAnimationTimer = window.setTimeout(() => {
        currentPanel.classList.remove('is-text-leaving');
        currentPanel.classList.remove('is-active');
        currentPanel.hidden = true;
        currentPanel.setAttribute('aria-hidden', 'true');

        nextPanel.hidden = false;
        nextPanel.classList.add('is-active');
        nextPanel.setAttribute('aria-hidden', 'false');
        nextPanel.classList.remove('is-text-leaving', 'is-text-entering');
        void nextPanel.offsetWidth;
        nextPanel.classList.add('is-text-entering');

        textAnimationTimer = window.setTimeout(() => {
          nextPanel.classList.remove('is-text-entering');
        }, 240);
      }, 150);
    };
    const activate = (name) => {
      let activePanel = null;
      const currentPanel = isAnnouncementsTabset
        ? panels.find(p => p.dataset.panel === activeAnnouncementTab) || null
        : null;
      triggers.forEach(t => {
        const on = t.dataset.tab === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      panels.forEach(p => {
        const show = p.dataset.panel === name;
        if (!isAnnouncementsTabset) {
          p.classList.toggle('is-active', show);
          p.hidden = !show;
          p.setAttribute('aria-hidden', show ? 'false' : 'true');
        }
        if (show) activePanel = p;
      });
      if (isAnnouncementsTabset) {
        if (activeAnnouncementTab === name) return;
        animateAnnouncementText(activePanel, currentPanel);
        activeAnnouncementTab = name;
      }
    };
    triggers.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
    activate(triggers[0]?.dataset.tab || 'tech');
  });
// -------------------------
// Accordions (smooth height) — supports nested accordions
// -------------------------
function openPanel(btn, panel){
  btn.setAttribute('aria-expanded', 'true');
  panel.hidden = false;

  // from 0 -> scrollHeight
  panel.style.height = '0px';
  void panel.offsetHeight;
  panel.style.height = panel.scrollHeight + 'px';

  panel.addEventListener('transitionend', () => {
    if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
  }, { once:true });
}

function closePanel(btn, panel){
  btn.setAttribute('aria-expanded', 'false');

  // auto -> fixed height -> 0
  panel.style.height = panel.scrollHeight + 'px';
  void panel.offsetHeight;
  panel.style.height = '0px';

  panel.addEventListener('transitionend', () => {
    panel.hidden = true;
    panel.style.height = '';
  }, { once:true });
}

// Initialize all accordion panels as collapsed (without breaking nested)
$$('.accordion-trigger').forEach(btn => {
  const id = btn.getAttribute('aria-controls');
  const panel = id ? document.getElementById(id) : null;
  if (!panel) return;

  // Only set defaults if not explicitly opened in HTML
  if (btn.getAttribute('aria-expanded') !== 'true'){
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.style.height = '';
  }
});

// Event delegation: works for nested accordions
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.accordion-trigger');
  if (!btn) return;

  const id = btn.getAttribute('aria-controls');
  const panel = id ? document.getElementById(id) : null;
  if (!panel) return;

  // Find the accordion group that owns this trigger
  const acc = btn.closest('.accordion');
  if (!acc) return;

  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  // Close other panels ONLY inside the same accordion group (not parent/child groups)
  $$('.accordion-trigger', acc).forEach(otherBtn => {
    if (otherBtn === btn) return;
    const otherId = otherBtn.getAttribute('aria-controls');
    const otherPanel = otherId ? document.getElementById(otherId) : null;
    if (!otherPanel) return;

    // Do NOT close triggers that belong to a nested accordion inside this accordion
    // (i.e., only close siblings under same accordion level)
    const otherAcc = otherBtn.closest('.accordion');
    if (otherAcc !== acc) return;

    if (otherBtn.getAttribute('aria-expanded') === 'true'){
      closePanel(otherBtn, otherPanel);
    }
  });

  // Toggle clicked one
  isOpen ? closePanel(btn, panel) : openPanel(btn, panel);
}, { passive:true });

  // -------------------------
  // Reveal on scroll
  // -------------------------
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // -------------------------
  // Contact form: mailto convenience
  // -------------------------
  const form = $('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    const subject = encodeURIComponent(`Cancer Imaging Lab enquiry${name ? ' — ' + name : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    // Use the provided lab email
    window.location.href = `mailto:sneha.singh@iitmandi.ac.in?subject=${subject}&body=${body}`;
  });
})();
