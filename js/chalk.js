// SchoolChalk progressive enhancements. Nothing here hides content or changes layout, so
// the page reads the same if this script is slow, deferred or blocked.

(function () {
  'use strict';

  // Label each code board with its language (shown by `.prose pre[data-lang]::before`).
  function labelCodeBoards() {
    document.querySelectorAll('.prose pre code[class*="language-"]').forEach(function (code) {
      var pre = code.closest('pre');
      if (!pre || pre.hasAttribute('data-lang')) return;
      var lang = code.getAttribute('data-lang') || '';
      pre.setAttribute('data-lang', lang ? lang.toUpperCase() : 'CODE');
    });
  }

  // Contents scroll-spy: the entry for the section being read gets aria-current, which
  // draws its chalk stroke (site.css). The active section is the last heading that has
  // passed the top third of the viewport.
  function spyContents() {
    var links = document.querySelectorAll('#TableOfContents a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    links.forEach(function (a) { byId[decodeURIComponent(a.hash.slice(1))] = a; });
    var headings = Array.prototype.filter.call(
      document.querySelectorAll('.prose :is(h2, h3, h4)[id]'),
      function (h) { return byId[h.id]; }
    );
    if (!headings.length) return;

    var current = null;
    function mark(id) {
      var link = byId[id] || null;
      if (link === current) return;
      if (current) current.removeAttribute('aria-current');
      if (link) link.setAttribute('aria-current', 'true');
      current = link;
      // A Contents taller than the screen scrolls on its own: keep the marked entry in view
      // by moving the list (never the page).
      var box = link && link.closest('.toc');
      if (box && box.scrollHeight > box.clientHeight) {
        var lr = link.getBoundingClientRect(), br = box.getBoundingClientRect();
        if (lr.top < br.top + 24 || lr.bottom > br.bottom - 24) box.scrollTop += lr.top - br.top - box.clientHeight / 3;
      }
    }

    // The observed band is the top third of the viewport, so a callback fires each time a
    // heading enters or leaves it; positions are re-read only then, never on every scroll.
    var passed = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        passed[e.target.id] = e.boundingClientRect.top < window.innerHeight / 3;
      });
      var active = null;
      headings.forEach(function (h) { if (passed[h.id]) active = h.id; });
      mark(active);
    }, { rootMargin: '0px 0px -66% 0px' });
    headings.forEach(function (h) { observer.observe(h); });
  }

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TICK = '<svg viewBox="0 0 32 28" width="14" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M3.5 15.2 C 6.4 17.4, 9.1 20.6, 11.2 24.1 C 15.3 15.6, 21.4 8.2, 28.6 3.4"/></svg>';

  // Copy button on each code board. It sits on the board's wrapper, not the <pre>, so it
  // stays put while wide code scrolls. Success chalks a tick; a blocked clipboard selects
  // the code and says how to copy instead of failing silently.
  function copyButtons() {
    var article = document.querySelector('article[data-copy-label]');
    if (!article || !navigator.clipboard) return;
    var label = article.dataset.copyLabel, done = article.dataset.copiedLabel, failed = article.dataset.copyFailedLabel;

    document.querySelectorAll('.prose pre').forEach(function (pre) {
      var board = pre.closest('.highlight');
      if (!board) { board = document.createElement('div'); pre.parentNode.insertBefore(board, pre); board.appendChild(pre); }
      board.classList.add('board');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'board-copy';
      btn.innerHTML = '<span class="board-copy__tick">' + TICK + '</span><span class="board-copy__text"></span>';
      var text = btn.lastChild, timer;
      text.textContent = label;
      btn.setAttribute('aria-live', 'polite');
      board.appendChild(btn);

      function settle(msg, ok) {
        text.textContent = msg;
        btn.classList.toggle('is-copied', ok);
        clearTimeout(timer);
        timer = setTimeout(function () { text.textContent = label; btn.classList.remove('is-copied'); }, 2400);
      }
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.innerText.replace(/\n$/, '')).then(
          function () { settle(done, true); },
          function () { getSelection().selectAllChildren(code); settle(failed, false); }
        );
      });
    });
  }

  // End of the post: the tick is drawn once the reader reaches it. It starts fully drawn in
  // the markup and is only "un-drawn" here, right before it can animate.
  function tickWhenDone() {
    var done = document.querySelector('[data-read-done]');
    if (!done || calm || !('IntersectionObserver' in window)) return;
    if (done.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it drawn
    done.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      done.classList.add('is-done');
      io.disconnect();
    }, { threshold: 1 });
    io.observe(done);
  }

  // Long posts skip rendering off-screen blocks for a fast first paint (site.css,
  // content-visibility). Before any in-page jump the whole article is rendered, so the
  // browser computes the target from real heights instead of placeholders; it is also
  // rendered once the page is idle, which keeps the scrollbar from shifting while reading.
  function renderArticle() {
    document.querySelectorAll('.prose').forEach(function (p) { p.classList.add('is-rendered'); });
  }
  function jumpTo(hash, smooth) {
    var target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: smooth && !calm ? 'smooth' : 'instant' });
  }
  function keepJumpsAccurate() {
    if (!document.querySelector('.prose')) return;
    // Capture phase: runs before the browser starts its own (smooth) scroll to the anchor,
    // so that scroll is already aimed at real positions and needs no correction.
    var clicked = false;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (a && a.hash && a.pathname === location.pathname) { renderArticle(); clicked = true; }
    }, true);
    // Arriving with #heading (shared link) or moving between headings with Back/Forward:
    // the browser has already scrolled using placeholder heights, so correct it.
    if (location.hash) { renderArticle(); jumpTo(location.hash, false); }
    window.addEventListener('hashchange', function () {
      if (clicked) { clicked = false; return; }
      renderArticle();
      jumpTo(location.hash, false);
    });
    window.addEventListener('load', function () {
      if (window.requestIdleCallback) requestIdleCallback(renderArticle, { timeout: 3000 });
      else setTimeout(renderArticle, 1500);
    });
  }

  function init() {
    keepJumpsAccurate();
    labelCodeBoards();
    spyContents();
    copyButtons();
    tickWhenDone();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
