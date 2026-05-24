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
     SECURE DYNAMIC CONTACT FORM (WEB3FORMS - BACKGROUND SENDING)
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if (!name || !email || !message) return;
      
      // Update button state to sending
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending Message...";
      
      // Web3Forms Setup - Delivers directly to istikbalturut@gmail.com
      // You can obtain your free Access Key in 5 seconds at: https://web3forms.com
      const accessKey = "408671ae-61ef-45d5-b9e4-863be36adef8"; 
      
      const formData = {
        access_key: accessKey,
        name: name,
        email: email,
        message: message,
        subject: `New Collaboration Message from ${name}`
      };
      
      if (accessKey === "YOUR_ACCESS_KEY_HERE" || !accessKey) {
        // Fallback directly to mailto if no key has been pasted yet
        triggerMailtoFallback();
      } else {
        // Perform background submit to Web3Forms API
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(async (response) => {
          if (response.status === 200) {
            submitBtn.textContent = "✓ Message Sent Successfully!";
            submitBtn.style.backgroundColor = "#10b981"; // Vibrant Green
            contactForm.reset();
          } else {
            throw new Error("API Key mismatch");
          }
        })
        .catch((error) => {
          console.warn("Web3Forms error, falling back to mailto client:", error);
          triggerMailtoFallback();
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = ""; // Restore to native css theme
          }, 3000);
        });
      }
      
      function triggerMailtoFallback() {
        submitBtn.textContent = "Opening Mail Client...";
        const user = "istikbalturut";
        const domain = "gmail.com";
        const subject = encodeURIComponent(`Collaboration Inquiry from ${name}`);
        const body = encodeURIComponent(`Hello Istikbal,\n\nYou received a new message from your portfolio website:\n\nName: ${name}\nSender Email: ${email}\n\nMessage:\n${message}\n\n---`);
        
        const mailtoLink = document.createElement('a');
        mailtoLink.href = `mailto:${user}@${domain}?subject=${subject}&body=${body}`;
        mailtoLink.style.display = 'none';
        document.body.appendChild(mailtoLink);
        mailtoLink.click();
        document.body.removeChild(mailtoLink);
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          contactForm.reset();
        }, 1500);
      }
    });
  }

});
