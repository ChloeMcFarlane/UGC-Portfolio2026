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
  
    // 3. Autoplay & Pause Videos based on Visibility
    const videos = document.querySelectorAll('.iphone-video');
  
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {
            // Autoplay handled by browser policies
          });
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.3 });
  
    videos.forEach(video => videoObserver.observe(video));
  
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