(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.getElementById('nav-links');

  // Border under the nav once the page scrolls
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    links.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Highlight the menu link for the section on screen
  const navLinks = [...links.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // Work filters
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    projects.forEach((p) => { p.hidden = !(f === 'all' || p.dataset.category === f); });
  }));

  // Gentle fade-in as sections scroll into view
  const revealTargets = document.querySelectorAll('.section__head, .project, .card, .role, .degree, .certs, .about, .contact');
  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
  }

  // Hide résumé buttons until a résumé PDF has been added to /assets
  const resumeLinks = document.querySelectorAll('.js-resume');
  if (resumeLinks.length && location.protocol.startsWith('http')) {
    fetch(resumeLinks[0].getAttribute('href'), { method: 'HEAD' })
      .then((r) => { if (!r.ok) throw new Error(); })
      .catch(() => {
        resumeLinks.forEach((a) => { a.hidden = true; a.style.display = 'none'; });
        const card = document.querySelector('.js-resume-card');
        if (card) { card.style.display = 'none'; card.parentElement.style.gridTemplateColumns = '1fr'; }
      });
  }
})();
