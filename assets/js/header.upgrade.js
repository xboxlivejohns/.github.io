(() => {
  const root = document.documentElement;
  if (!root.classList.contains('header-upgrade')) return;

  const header = document.querySelector('[data-header]');
  if (!header) return;

  const hero = document.querySelector('[data-hero]');
  const setState = (state) => header.setAttribute('data-state', state);

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
})();
