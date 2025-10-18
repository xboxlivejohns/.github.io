(() => {
  const root = document.documentElement;
  if (!root.classList.contains('header-upgrade')) return;

  const header = document.querySelector('[data-header]');
  if (!header) return;

  const hero = document.querySelector('[data-hero]');
  const setState = (state) => header.setAttribute('data-state', state);
  let lastVisibility = 'visible';
  const setVisibility = (visibility) => {
    header.setAttribute('data-visibility', visibility);
    lastVisibility = visibility;
  };

  setVisibility('visible');

  if (!hero) {
    setState('scrolled');
    return;
  }

  if (!('IntersectionObserver' in window)) {
    setState('scrolled');
    return;
  }

  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:1px;pointer-events:none;';
  hero.before(sentinel);

  const computedRoot = getComputedStyle(root);
  const desktopHeight = parseInt(computedRoot.getPropertyValue('--pp-h-desktop'), 10) || header.offsetHeight || 96;
  const offset = Math.max(0, Math.round(desktopHeight * 0.65));
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        setState('at-top');
      } else {
        setState('scrolled');
      }
    },
    { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 }
  );

  observer.observe(sentinel);

  const cleanup = () => {
    observer.disconnect();
    if (sentinel.parentNode) {
      sentinel.parentNode.removeChild(sentinel);
    }
  };

  window.addEventListener('pagehide', cleanup, { once: true });

  const navToggle = header.querySelector('[data-nav-toggle]');
  const nav = header.querySelector('[data-nav]');

  if (!navToggle || !nav) {
    return;
  }

  const navHiddenClass = 'hidden';
  const navVisibleClass = 'flex';
  const navActiveClass = 'is-open';
  const desktopQuery = window.matchMedia('(min-width: 768px)');

  const isDesktop = () => desktopQuery.matches;

  let navLockedVisibility = false;
  let requestTick = () => {};

  const ensureVisibility = () => {
    if (lastVisibility !== 'visible') {
      setVisibility('visible');
    }
  };

  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('is-active');
    nav.classList.add(navVisibleClass, navActiveClass);
    nav.classList.remove(navHiddenClass);
    navLockedVisibility = true;
    ensureVisibility();
  };

  const closeNav = ({ focusToggle = false } = {}) => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-active');
    nav.classList.remove(navActiveClass);
    if (!isDesktop()) {
      nav.classList.remove(navVisibleClass);
      nav.classList.add(navHiddenClass);
      if (focusToggle) {
        navToggle.focus();
      }
    }
    navLockedVisibility = false;
    requestTick();
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.addEventListener('click', (event) => {
    const target = event.target.closest('a[href]');
    if (!target) return;
    if (!isDesktop()) {
      closeNav();
    }
  });

  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;
    if (navToggle.getAttribute('aria-expanded') !== 'true') return;
    if (isDesktop()) return;
    event.stopPropagation();
    closeNav({ focusToggle: true });
  };

  window.addEventListener('keydown', handleKeydown);

  const handleViewportChange = (event) => {
    if (event.matches) {
      nav.classList.remove(navHiddenClass, navVisibleClass, navActiveClass);
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-active');
    } else {
      closeNav();
    }
  };

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleViewportChange);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleViewportChange);
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let hideEnabled = !reducedMotionQuery.matches;
  let lastKnownScrollY = window.scrollY;
  let latestScrollY = lastKnownScrollY;
  let scheduled = false;
  const revealThreshold = 16;
  const deltaThreshold = 6;

  const updatePreference = (event) => {
    hideEnabled = !event.matches;
    if (!hideEnabled) {
      ensureVisibility();
    } else {
      requestTick();
    }
  };

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', updatePreference);
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener(updatePreference);
  }

  const applyVisibility = (nextVisibility) => {
    if (lastVisibility === nextVisibility) return;
    setVisibility(nextVisibility);
  };

  const updateVisibility = () => {
    scheduled = false;
    const currentScrollY = Math.max(latestScrollY, 0);
    const delta = currentScrollY - lastKnownScrollY;
    lastKnownScrollY = currentScrollY;

    if (!hideEnabled || navLockedVisibility) {
      ensureVisibility();
      return;
    }

    const isAtTop = currentScrollY <= revealThreshold;
    if (isAtTop) {
      applyVisibility('visible');
      return;
    }

    const absDelta = Math.abs(delta);

    if (delta > 0 && absDelta > deltaThreshold) {
      applyVisibility('hidden');
    } else if (delta < 0 && absDelta > deltaThreshold) {
      applyVisibility('visible');
    }
  };

  requestTick = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateVisibility);
  };

  const handleScroll = () => {
    latestScrollY = window.scrollY;
    requestTick();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleViewportChange(desktopQuery);
  requestTick();
})();
