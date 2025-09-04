// Mobile menu toggle
const btn = document.getElementById('mobileMenuBtn');
if (btn) {
  const m = document.getElementById('mobileMenu');
  btn.addEventListener('click', () => {
    m.classList.toggle('hidden');
  });
}
