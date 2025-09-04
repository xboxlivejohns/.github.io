document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('button[id^="mobileMenuBtn"]');
  if (!menuBtn) return;

  const menuId = menuBtn.getAttribute('aria-controls');
  const menu = document.getElementById(menuId);
  if (!menu) return;

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('hidden');
  });
});

