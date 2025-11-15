// Smooth Scroll Animations for Neobrutalist Design

(function() {
  'use strict';

  // Extract language from code blocks and set as data-lang attribute
  function extractCodeLanguage() {
    const codeBlocks = document.querySelectorAll('.prose pre code[class*="language-"], .prose pre code[class*="lang-"]');
    
    codeBlocks.forEach(codeEl => {
      const preEl = codeEl.closest('pre');
      if (!preEl || preEl.hasAttribute('data-lang')) return;
      
      // Extract language from class (e.g., "language-javascript" -> "javascript")
      const classList = Array.from(codeEl.classList);
      let lang = '';
      
      for (const className of classList) {
        if (className.startsWith('language-')) {
          lang = className.replace('language-', '');
          break;
        } else if (className.startsWith('lang-')) {
          lang = className.replace('lang-', '');
          break;
        }
      }
      
      // Format language name (e.g., "javascript" -> "JAVASCRIPT", "c-sharp" -> "C-SHARP")
      if (lang) {
        lang = lang.toUpperCase().replace(/-/g, '-');
        preEl.setAttribute('data-lang', lang);
      } else {
        preEl.setAttribute('data-lang', 'CODE');
      }
    });
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  document.addEventListener('DOMContentLoaded', () => {
    // Extract and set language labels for code blocks
    extractCodeLanguage();
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .post-list-item, .post-card');
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      
      // Add delay based on index
      if (el.classList.contains('delay-200')) {
        el.style.transitionDelay = '200ms';
      } else if (el.classList.contains('delay-300')) {
        el.style.transitionDelay = '300ms';
      } else if (el.classList.contains('delay-400')) {
        el.style.transitionDelay = '400ms';
      } else {
        el.style.transitionDelay = `${index * 50}ms`;
      }
      
      observer.observe(el);
    });

    // Parallax effect for background elements
    const parallaxElements = document.querySelectorAll('.fixed.inset-0 > div');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px) rotate(${el.dataset.rotate || '0deg'})`;
      });
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .post-card, .nav-link');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Add random rotation to cards on load
    const cards = document.querySelectorAll('.post-card, .post-list-item');
    cards.forEach(card => {
      const randomRotate = (Math.random() - 0.5) * 2; // -1 to 1 degrees
      card.style.transform = `rotate(${randomRotate}deg)`;
    });

    // Cursor trail effect (optional, can be disabled)
    let cursorTrail = [];
    const maxTrailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
      cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      
      if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
      }
      
      // Remove old trail points
      cursorTrail = cursorTrail.filter(point => Date.now() - point.time < 500);
    });

    // Add entrance animation to page
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
      document.body.style.transition = 'opacity 0.5s ease-in';
      document.body.style.opacity = '1';
    });
  });

  // Add stagger animation to list items
  const staggerAnimation = (elements, delay = 100) => {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * delay);
    });
  };

  // Export for use in other scripts
  window.neobrutalAnimations = {
    stagger: staggerAnimation,
    observer: observer
  };

})();

