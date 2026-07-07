'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DYNAMIC CURSOR GLOW EFFECT ---
  const glowCursor = document.getElementById('glow-cursor');
  if (glowCursor) {
    document.addEventListener('mousemove', (e) => {
      glowCursor.style.left = `${e.clientX}px`;
      glowCursor.style.top = `${e.clientY}px`;
      if (!glowCursor.classList.contains('active')) {
        glowCursor.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      glowCursor.classList.remove('active');
    });
  }

  // --- 2. AMBIENT BACKGROUND CANVAS PARTICLES ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    // Reduced particle density for high-end subtle look
    const particleCount = 35;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Small, elegant stars
        this.speedX = Math.random() * 0.1 - 0.05;
        this.speedY = Math.random() * 0.1 - 0.05;
        // Soft violet & cyan color blending
        this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.12)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  // --- 3. DYNAMIC CARD BOUNDARY HOVER GLOW ---
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- 4. HERO SECTION TYPING ANIMATION ---
  const typedElement = document.getElementById('typed-element');
  if (typedElement) {
    const phrases = ["MCA Student", "AI / ML Enthusiast", "Python Django Developer", "Software Engineer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeAnimation = () => {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before starting new word
      }

      setTimeout(typeAnimation, typeSpeed);
    };

    setTimeout(typeAnimation, 1000);
  }

  // --- 5. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 6. SKILLS PROGRESS FILL ANIMATION ---
  const skillsSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.skill-progress-fill');
  
  if (skillsSection && progressFills.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressFills.forEach(fill => {
            const targetVal = fill.getAttribute('data-progress');
            fill.style.width = targetVal;
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    skillObserver.observe(skillsSection);
  }

  // --- 7. SCROLL PROGRESS BAR & ACTIVE NAV DOCK LINK ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');

  const onScroll = () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // Offset for accuracy

    // Scroll Progress bar percentage
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // Active link calculations
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (window.scrollY < 100) {
      current = 'home';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll);
  onScroll(); // Run initially to set active state

  // Smooth scroll logic for nav dock links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 30,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 8. PROJECTS CATEGORY FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(10px)';
        
        setTimeout(() => {
          if (filterVal === 'all' || category === filterVal) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // --- 9. DETAILS MODAL CONTROLS ---
  const lightbox = document.getElementById('lightbox');
  const modalImg = document.getElementById('modal-image-display');
  const modalBadge = document.getElementById('modal-badge-display');
  const modalTitleDisplay = document.getElementById('modal-title-display');
  const modalDesc = document.getElementById('modal-desc-display');
  const modalTech = document.getElementById('modal-tech-display');
  const modalCta = document.getElementById('modal-cta-display');

  window.showLightbox = (element) => {
    if (!lightbox || !modalImg || !modalTitleDisplay || !modalDesc || !modalTech || !modalCta) return;
    
    // Scrape data attributes
    const imgSrc = element.getAttribute('data-img');
    const titleText = element.getAttribute('data-title');
    const badgeText = element.getAttribute('data-badge');
    const descText = element.getAttribute('data-desc');
    const techText = element.getAttribute('data-tech');
    const linkUrl = element.getAttribute('data-link');

    // Populate preview side
    modalImg.src = imgSrc;
    modalImg.alt = titleText;

    // Populate details side
    modalBadge.textContent = badgeText;
    modalTitleDisplay.textContent = titleText;
    modalDesc.textContent = descText;

    // Populate technology tags
    modalTech.innerHTML = '';
    if (techText) {
      const tags = techText.split(',');
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tag.trim();
        modalTech.appendChild(span);
      });
    }

    // Populate CTA button
    if (linkUrl) {
      modalCta.href = linkUrl;
      modalCta.style.display = 'inline-flex';
      // Change text based on type
      if (badgeText === 'NPTEL' || badgeText === 'DataCamp' || badgeText === 'freeCodeCamp' || badgeText === 'TCS iON' || badgeText === 'ICT Academy of Kerala') {
        modalCta.querySelector('span').textContent = 'Verify Certificate';
      } else {
        modalCta.querySelector('span').textContent = 'View Code / Source';
      }
    } else {
      modalCta.style.display = 'none';
    }

    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  window.closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        window.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
        window.closeLightbox();
      }
    });
  }

  // --- 10. CONTACT FORM SUBMISSION HANDLING ---
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<ion-icon name="checkmark-circle-outline" style="font-size: 18px;"></ion-icon> <span>Sent Successfully!</span>`;
      
      setTimeout(() => {
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1000);
      }, 1500);
    });
  }

  // --- 11. INTERACTIVE TIMELINE EXPANSION ---
  window.toggleTimelineItem = (headerEl) => {
    const item = headerEl.closest('.timeline-item');
    if (!item) return;
    
    // Collapse other open items in the same container for clean accordion effect
    const container = item.closest('.timeline-container');
    const siblingItems = container.querySelectorAll('.timeline-item');
    siblingItems.forEach(sib => {
      if (sib !== item && sib.classList.contains('expanded')) {
        sib.classList.remove('expanded');
      }
    });

    item.classList.toggle('expanded');
  };

  // --- 12. RESUME DOWNLOAD ANIMATION ---
  const downloadBtn = document.getElementById('download-cv-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (downloadBtn.classList.contains('loading')) return;

      const originalContent = downloadBtn.innerHTML;
      const fileUrl = downloadBtn.getAttribute('href') || 'Jyothish P S.pdf';
      
      downloadBtn.classList.add('loading');
      downloadBtn.innerHTML = `<ion-icon name="sync-outline" class="spin-anim"></ion-icon> <span>Preparing CV...</span>`;

      setTimeout(() => {
        downloadBtn.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon> <span>Downloaded!</span>`;
        
        // Trigger file download using the actual href
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          downloadBtn.classList.remove('loading');
          downloadBtn.innerHTML = originalContent;
        }, 2000);
      }, 1500);
    });
  }

});