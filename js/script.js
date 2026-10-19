document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Global Scroll-Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Always-On Looping Videos (no play button, never paused)
  const videos = document.querySelectorAll('.iphone-video');

  const forcePlay = (video) => {
    // Muted + inline are required by browsers to allow autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    video.removeAttribute('controls');

    if (video.paused) {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => { /* retried by the listeners below */ });
      }
    }
  };

  videos.forEach(video => {
    forcePlay(video);

    // Retry whenever the video becomes ready
    ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'stalled', 'suspend']
      .forEach(evt => video.addEventListener(evt, () => forcePlay(video)));

    // If anything pauses it (browser, power saving, tab switch), start it again
    video.addEventListener('pause', () => {
      if (!video.ended && !document.hidden) setTimeout(() => forcePlay(video), 150);
    });

    // Manual loop fallback in case native loop doesn't fire
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      forcePlay(video);
    });

    // Helps diagnose unsupported formats (e.g. HEVC .MOV in Chrome)
    video.addEventListener('error', () => {
      console.warn('Video failed to load/decode:', video.currentSrc || video.src,
        '- re-export as H.264 MP4 for universal playback.');
    });
  });

  const playAll = () => videos.forEach(forcePlay);

  window.addEventListener('load', playAll);
  window.addEventListener('pageshow', playAll);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playAll();
  });

  // Strict mobile / low-power browsers: retry on the first user gesture
  ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, playAll, { once: true, passive: true });
  });

  // Safety net: keep nudging any video that's stopped
  setInterval(playAll, 2000);

  // 4. Dynamic Island Expand Micro-interaction
  const iphoneWrappers = document.querySelectorAll('.iphone-wrapper');

  iphoneWrappers.forEach(wrapper => {
    const dynamicIsland = wrapper.querySelector('.dynamic-island');

    wrapper.addEventListener('mouseenter', () => {
      if (dynamicIsland) {
        dynamicIsland.style.width = '105px';
        dynamicIsland.style.height = '24px';
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      if (dynamicIsland) {
        dynamicIsland.style.width = '80px';
        dynamicIsland.style.height = '20px';
      }
    });
  });
});