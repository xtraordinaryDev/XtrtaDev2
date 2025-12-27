// Lightweight scroll reveal animations and interaction polish
// Respects reduced-motion preferences

(function () {
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll('.reveal-on-scroll');

  if (!revealEls.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// iOS video autoplay fix
(function() {
  const videos = document.querySelectorAll('video[autoplay]');
  
  if (videos.length === 0) return;
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    videos.forEach((video) => {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, try again on user interaction
          document.addEventListener('touchstart', function playVideo() {
            video.play().catch(() => {});
            document.removeEventListener('touchstart', playVideo);
          }, { once: true });
        });
      }
    });
  }
})();


