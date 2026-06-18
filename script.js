(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('siteNav');
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = nav ? nav.querySelectorAll('.site-nav__link') : [];
  var sections = document.querySelectorAll('section[id]');
  var reveals = document.querySelectorAll('.reveal');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    updateActiveNav();
  }

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = '';

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      link.classList.toggle('is-active', href === '#' + current);
    });
  }

  function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (targetId === '#' || targetId === '#top') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          closeMenu();
          return;
        }

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        closeMenu();
      });
    });
  }

  function bindMenu() {
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function initReveal() {
    if (prefersReducedMotion) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.07 + 's';
      observer.observe(el);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  bindSmoothScroll();
  bindMenu();
  initReveal();
  onScroll();
})();
