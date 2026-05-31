// Lightweight progressive enhancements for the neobrutalist theme.
// Deliberately does NOT hide the page or mutate layout: reveal animations are
// handled by CSS (.animate-fade-in-up), so content is always visible even if this
// script is slow, deferred, or blocked. That avoids the blank-screen / bounce trap.

(function () {
  'use strict';

  // Label code blocks with their language (consumed by neobrutal.css `pre::before`).
  function extractCodeLanguage() {
    const codeBlocks = document.querySelectorAll(
      '.prose pre code[class*="language-"], .prose pre code[class*="lang-"]'
    );

    codeBlocks.forEach((codeEl) => {
      const preEl = codeEl.closest('pre');
      if (!preEl || preEl.hasAttribute('data-lang')) return;

      let lang = '';
      for (const className of codeEl.classList) {
        if (className.startsWith('language-')) {
          lang = className.slice('language-'.length);
          break;
        }
        if (className.startsWith('lang-')) {
          lang = className.slice('lang-'.length);
          break;
        }
      }

      preEl.setAttribute('data-lang', lang ? lang.toUpperCase() : 'CODE');
    });
  }

  // Smooth in-page anchor scrolling, honoring reduced-motion preferences.
  function enableAnchorScroll() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        let target;
        try {
          target = document.querySelector(href);
        } catch {
          return; // invalid selector (e.g. href="#:~:text=")
        }
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  function init() {
    extractCodeLanguage();
    enableAnchorScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
