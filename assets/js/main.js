/* =========================================================
   THE PROJECT DXB — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────────────────
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── HAMBURGER MENU ─────────────────────────────────────
  const burger  = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      burger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── ACTIVE NAV LINK ────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SCROLL ANIMATIONS (Intersection Observer) ──────────
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => io.observe(el));
  }

  // ── HERO PARALLAX ──────────────────────────────────────
  const heroBg = document.querySelector('.hero .hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }

  // ── FAQ ACCORDION ──────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling?.classList.remove('open');
      });
      // Open clicked if it wasn't open
      if (!isOpen) {
        btn.classList.add('open');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  // ── COOKIE BANNER ──────────────────────────────────────
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieDecline = document.querySelector('.cookie-decline');

  if (cookieBanner) {
    if (!localStorage.getItem('tp_cookies')) {
      setTimeout(() => cookieBanner.classList.remove('hidden'), 800);
    } else {
      cookieBanner.remove();
    }
  }
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('tp_cookies', 'accepted');
    cookieBanner.classList.add('hidden');
    setTimeout(() => cookieBanner.remove(), 400);
  });
  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('tp_cookies', 'declined');
    cookieBanner.classList.add('hidden');
    setTimeout(() => cookieBanner.remove(), 400);
  });

  // ── FORM SUBMISSION via mailto ─────────────────────────
  const RECIPIENT = 'jack@theprojectdxb.com';

  function buildMailto(subject, fields) {
    const body = fields
      .filter(f => f.value)
      .map(f => `${f.label}: ${f.value}`)
      .join('\n');
    return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleFormSubmit(form, getMailto) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const data = new FormData(form);
      window.location.href = getMailto(data);
      btn.textContent = '✓ Opening your email app…';
      btn.style.background = '#25D366';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = btn.dataset.orig || btn.textContent;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
    // store original label
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.dataset.orig = btn.textContent;
  }

  const contactForm   = document.querySelector('.contact-form');
  const corporateForm = document.querySelector('.corporate-form');

  if (contactForm) {
    handleFormSubmit(contactForm, (data) => buildMailto(
      `Website Enquiry — ${data.get('name') || 'New Message'}`,
      [
        { label: 'Name',     value: data.get('name') },
        { label: 'Email',    value: data.get('email') },
        { label: 'Phone',    value: data.get('phone') },
        { label: 'Interest', value: data.get('interest') },
        { label: 'Message',  value: data.get('message') }
      ]
    ));
  }

  if (corporateForm) {
    handleFormSubmit(corporateForm, (data) => buildMailto(
      `Corporate Enquiry — ${data.get('company') || 'New Enquiry'}`,
      [
        { label: 'Name',      value: data.get('name') },
        { label: 'Company',   value: data.get('company') },
        { label: 'Email',     value: data.get('email') },
        { label: 'Phone',     value: data.get('phone') },
        { label: 'Team Size', value: data.get('team_size') },
        { label: 'Message',   value: data.get('message') }
      ]
    ));
  }


  // ── NAV DROPDOWN (hover with grace-period delay) ────────
  document.querySelectorAll('.has-dropdown').forEach(li => {
    const dropdown = li.querySelector('.nav-dropdown');
    let timer;
    const open  = () => { clearTimeout(timer); dropdown.classList.add('open'); };
    const close = () => { timer = setTimeout(() => dropdown.classList.remove('open'), 180); };
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', close);
    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', close);
  });

  // ── SMOOTH SCROLL for anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
