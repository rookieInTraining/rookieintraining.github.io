/**
 * First-party GA4 behavioral tracking (gtag). Loaded deferred, site-wide, from
 * baseof.html. Every event is guarded by a gtag check and degrades to a no-op when
 * analytics is absent; all listeners are passive / IntersectionObserver-based so this
 * never affects scrolling or input latency.
 *
 * Events:
 *   outbound_click       — clicks on external links
 *   internal_link_click  — clicks on same-host links, with link_location attribution
 *   scroll_depth         — 25 / 50 / 75 / 100 % of the page scrolled (once each)
 *   read_complete        — reader reached the end of an article (after a short dwell)
 *   active_read_time     — 30 / 60 / 120 s of *visible* time on an article
 *
 * In GA4 Admin → Events, mark the useful ones as key events, and register the event
 * params (percent_scrolled, link_location, post_category, reading_time, seconds) as
 * custom dimensions so they appear in reports/explorations.
 */
(function () {
  'use strict';

  function hasGtag() {
    return typeof window.gtag === 'function';
  }

  /* ---------------------------------------- Link clicks (outbound + internal) */

  function linkLocation(el) {
    var tagged = el.closest('[data-ga-loc]');
    if (tagged) return tagged.getAttribute('data-ga-loc');
    if (el.closest('#TableOfContents')) return 'toc';
    if (el.closest('.related-section')) return 'related';
    if (el.closest('header')) return 'nav';
    if (el.closest('footer')) return 'footer';
    if (el.closest('article')) return 'content';
    return 'other';
  }

  document.addEventListener(
    'click',
    function (e) {
      if (!hasGtag()) return;
      var el = e.target && e.target.closest && e.target.closest('a[href]');
      if (!el || el.tagName !== 'A') return;

      var raw = el.getAttribute('href');
      if (!raw) return;

      var url;
      try {
        url = new URL(el.href, window.location.href);
      } catch (_) {
        return;
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

      var text = (el.textContent || '').trim();
      if (text.length > 120) text = text.slice(0, 120);

      if (url.hostname === window.location.hostname) {
        gtag('event', 'internal_link_click', {
          link_url: url.href,
          link_text: text,
          link_location: linkLocation(el),
        });
      } else {
        gtag('event', 'outbound_click', {
          link_url: url.href,
          link_text: text,
          outbound: true,
        });
      }
    },
    true
  );

  /* ----------------------------------------------------------- Scroll depth */

  (function scrollDepth() {
    var thresholds = [25, 50, 75, 100];
    var hit = {};
    var ticking = false;

    function check() {
      ticking = false;
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      var pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (var i = 0; i < thresholds.length; i++) {
        var t = thresholds[i];
        if (pct >= t && !hit[t]) {
          hit[t] = true;
          if (hasGtag()) gtag('event', 'scroll_depth', { percent_scrolled: t });
        }
      }
      if (hit[100]) window.removeEventListener('scroll', onScroll);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // catch pages that already expose a threshold without scrolling
  })();

  /* ------------------------------- Article-only: read_complete + active time */

  function initArticle() {
    var article = document.querySelector('article[data-ga-type="post"]');
    if (!article) return;

    var category = article.getAttribute('data-ga-category') || '';
    var readingTime = parseInt(article.getAttribute('data-ga-reading-time') || '0', 10) || 0;
    var startedAt = Date.now();

    // active_read_time — accumulate visible time, fire milestone events
    var milestones = [30, 60, 120];
    var fired = {};
    var visibleMs = 0;
    var lastTick = Date.now();
    var timer = null;

    function tick() {
      var now = Date.now();
      if (!document.hidden) visibleMs += now - lastTick;
      lastTick = now;

      var secs = Math.floor(visibleMs / 1000);
      for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i];
        if (secs >= m && !fired[m]) {
          fired[m] = true;
          if (hasGtag()) gtag('event', 'active_read_time', { seconds: m, post_category: category });
        }
      }
      if (fired[milestones[milestones.length - 1]] && timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startTimer() {
      lastTick = Date.now();
      if (!timer) timer = setInterval(tick, 1000);
    }
    function stopTimer() {
      tick();
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopTimer();
      else startTimer();
    });
    if (!document.hidden) startTimer();

    // read_complete — end-of-content sentinel enters view after >= 15s dwell
    var sentinel = article.querySelector('[data-ga-article-end]');
    if (sentinel && 'IntersectionObserver' in window) {
      var done = false;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (done || !entry.isIntersecting) return;
            var fire = function () {
              if (done) return;
              done = true;
              io.disconnect();
              if (hasGtag()) {
                gtag('event', 'read_complete', {
                  reading_time: readingTime,
                  post_category: category,
                });
              }
            };
            var elapsed = Date.now() - startedAt;
            if (elapsed >= 15000) fire();
            else setTimeout(fire, 15000 - elapsed); // ignore instant scroll-to-bottom
          });
        },
        { threshold: 0.1 }
      );
      io.observe(sentinel);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticle);
  } else {
    initArticle();
  }
})();
