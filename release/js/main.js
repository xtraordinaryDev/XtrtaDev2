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

// iOS video autoplay fix for iPhone Safari and other iOS devices
(function() {
  const videos = document.querySelectorAll('video[autoplay]');
  
  if (videos.length === 0) return;
  
  // Detect iOS (including iPhone 14)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Enhanced video play function for iOS
  const playVideoIOS = (video) => {
    // Ensure all iOS-specific attributes are set
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.muted = true;
    video.playsInline = true;
    video.volume = 0;
    
    // Set up intersection observer to play when video is visible
    const playWhenVisible = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log('Video playing on iOS');
                  observer.disconnect();
                })
                .catch(() => {
                  // Still blocked, wait for user interaction
                });
            }
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(video);
    };
    
    // Try to play immediately
    const attemptPlay = () => {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.currentTime = 0;
          })
          .catch(() => {
            // Autoplay blocked - set up fallbacks
            playWhenVisible();
            
            // Try on any user interaction
            const playOnInteraction = () => {
              video.play().catch(() => {});
            };
            
            // Multiple interaction types
            const events = ['touchstart', 'touchend', 'click', 'scroll'];
            events.forEach(eventType => {
              document.addEventListener(eventType, playOnInteraction, { once: true, passive: true });
            });

            // If autoplay is blocked, allow the user to manually start playback
            // (works around iOS restrictions + any remaining autoplay failures)
            video.setAttribute('controls', '');
            video.controls = true;
          });
      }
    };
    
    // Force load first
    video.load();
    
    // Wait for video to be ready
    const readyHandler = () => {
      // Small delay to ensure iOS is ready
      setTimeout(() => {
        attemptPlay();
      }, 100);
    };
    
    if (video.readyState >= 3) {
      readyHandler();
    } else {
      video.addEventListener('loadeddata', readyHandler, { once: true });
      video.addEventListener('canplay', readyHandler, { once: true });
      video.addEventListener('canplaythrough', readyHandler, { once: true });
      
      // Fallback timeout - try multiple times
      setTimeout(() => {
        if (video.paused && video.readyState >= 2) {
          attemptPlay();
        }
      }, 500);
      
      setTimeout(() => {
        if (video.paused && video.readyState >= 2) {
          attemptPlay();
        }
      }, 1500);
    }
  };
  
  // Initialize videos
  if (isIOS) {
    // Process videos when DOM is ready
    const initVideos = () => {
      videos.forEach(playVideoIOS);
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initVideos);
    } else {
      initVideos();
    }
    
    // Also try on window load
    window.addEventListener('load', () => {
      videos.forEach(video => {
        if (video.paused) {
          playVideoIOS(video);
        }
      });
    });
  } else {
    // Non-iOS: simple play
    videos.forEach((video) => {
      video.play().catch(() => {});
    });
  }
})();


