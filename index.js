document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     MOBILE MENU NAVIGATION TOGGLE
     ========================================== */
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        
        // Remove active class from all links and add to clicked
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /* ==========================================
     INTERACTIVE DIMENSIONS GRID TAB SWITCHER
     ========================================== */
  const dimensionCards = document.querySelectorAll('.dimension-card');
  const panels = document.querySelectorAll('.panel-content');
  
  dimensionCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetDimension = card.getAttribute('data-dimension');
      
      // Update Card Active States
      dimensionCards.forEach(c => {
        c.classList.remove('active');
        const actionText = c.querySelector('.card-action-text');
        if (actionText) actionText.textContent = 'Click to View';
      });
      card.classList.add('active');
      const activeActionText = card.querySelector('.card-action-text');
      if (activeActionText) activeActionText.textContent = 'Active Section';
      
      // Update Panel Active States with a smooth transition
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      const targetPanel = document.getElementById(`panel-${targetDimension}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ==========================================
     TIMELINE SCROLL FADE-IN ANIMATION
     ========================================== */
  const timelineNodes = document.querySelectorAll('.timeline-node');
  
  if ('IntersectionObserver' in window) {
    const nodeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, no need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    timelineNodes.forEach(node => {
      nodeObserver.observe(node);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    timelineNodes.forEach(node => {
      node.classList.add('visible');
    });
  }

  /* ==========================================
     "KIYIDA BEKLEYENLER" POETRY CAROUSEL
     ========================================== */
  const slides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  let currentSlideIdx = 0;
  let slideTimer;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Boundary check
    if (index >= slides.length) currentSlideIdx = 0;
    else if (index < 0) currentSlideIdx = slides.length - 1;
    else currentSlideIdx = index;
    
    // Update slide display
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === currentSlideIdx) {
        slide.classList.add('active');
      }
    });
    
    // Update dots state
    dots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx === currentSlideIdx) {
        dot.classList.add('active');
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    slideTimer = setInterval(() => {
      showSlide(currentSlideIdx + 1);
    }, 5000); // Shift every 5 seconds
  }

  function stopAutoplay() {
    if (slideTimer) clearInterval(slideTimer);
  }

  // Set up dot clicking
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10) - 1;
      showSlide(slideIndex);
      startAutoplay(); // Reset autoplay timer
    });
  });

  // Start initial slide and autoplay
  showSlide(0);
  startAutoplay();
  
  // Pause autoplay on hovering the quotes block
  const carouselContainer = document.querySelector('.quotes-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
  }

  /* ==========================================
     SECURE DYNAMIC CONTACT FORM (SPAM-BOT PROTECTED)
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if (!name || !email || !message) return;
      
      // Decrypt/Obfuscate email address to protect from crawler spambots
      const user = "istikbalturut";
      const domain = "gmail.com";
      
      const subject = encodeURIComponent(`Collaboration Inquiry from ${name}`);
      const body = encodeURIComponent(`Hello Istikbal,\n\nYou received a new message from your portfolio website:\n\nName: ${name}\nSender Email: ${email}\n\nMessage:\n${message}\n\n---`);
      
      // Open browser default email client with pre-filled content
      window.location.href = `mailto:${user}@${domain}?subject=${subject}&body=${body}`;
    });
  }

});
