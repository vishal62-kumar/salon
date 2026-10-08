/* ==========================================================================
   HAIROLOGIST SALON - INTERACTIVE JAVASCRIPT
   Vanilla JS (No external framework dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. STICKY NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
     ------------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Add scrolled class for darker/compact header
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting based on section position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. SERVICES FILTERING
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Handle dropdown menu filter click
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const filter = item.getAttribute('data-filter');
      if (filter) {
        const matchingBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (matchingBtn) {
          matchingBtn.click();
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. MODAL HANDLERS (BOOKING MODAL & OFFERS MODAL)
     ------------------------------------------------------------------------ */
  const offersTrigger = document.getElementById('offers-trigger');
  const offersModal = document.getElementById('offers-modal');
  const bookingModal = document.getElementById('booking-modal');
  const modalCloseBtns = document.querySelectorAll('.modal-close');
  const heroBookBtn = document.getElementById('hero-book-btn');
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  const bookOfferBtns = document.querySelectorAll('.book-offer-btn');
  const serviceSelect = document.getElementById('book-service-select');

  // Open Offers Modal
  if (offersTrigger && offersModal) {
    offersTrigger.addEventListener('click', () => {
      offersModal.classList.add('active');
    });
  }

  // Open Booking Modal from Hero
  if (heroBookBtn && bookingModal) {
    heroBookBtn.addEventListener('click', () => {
      bookingModal.classList.add('active');
    });
  }

  // Open Booking Modal with Pre-filled Service Name
  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        // Set option if exists or set first
        for (let option of serviceSelect.options) {
          if (option.value.includes(serviceName) || option.text.includes(serviceName)) {
            option.selected = true;
            break;
          }
        }
      }
      bookingModal.classList.add('active');
    });
  });

  // Claim Offer -> Open Booking Modal
  bookOfferBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const offerTitle = btn.getAttribute('data-offer');
      if (offersModal) offersModal.classList.remove('active');
      if (bookingModal) bookingModal.classList.add('active');
      showToast(`Claiming Offer: ${offerTitle}`);
    });
  });

  // Close Modals
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
      });
    });
  });

  // Close on Outside Backdrop Click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  /* ------------------------------------------------------------------------
     5. FORM SUBMISSIONS & TOAST NOTIFICATIONS
     ------------------------------------------------------------------------ */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message) {
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  // Appointment Form Submission
  const bookingForm = document.getElementById('appointment-modal-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = document.getElementById('book-service-select').value;
      const date = document.getElementById('book-date').value;
      const name = document.getElementById('book-name').value;

      bookingModal.classList.remove('active');
      showToast(`Thank you, ${name}! Your appointment for ${service} on ${date} is confirmed.`);
      bookingForm.reset();
    });
  }

  // Contact Inquiry Form Submission
  const contactForm = document.getElementById('quick-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`Thank you, ${name}! Your message has been received. Our salon team will contact you shortly.`);
      contactForm.reset();
    });
  }

  // Newsletter Form Submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to Hairologist Salon VIP Club!');
      newsletterForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
     6. STATS COUNTER ANIMATION
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateStats() {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const count = +stat.innerText.replace(/[^0-9]/g, '');
      const speed = 200;
      const inc = target / speed;

      let current = 0;
      const updateCount = () => {
        current += inc;
        if (current < target) {
          if (target >= 1000) {
            stat.innerText = Math.ceil(current / 1000) + 'K+';
          } else {
            stat.innerText = Math.ceil(current) + '+';
          }
          setTimeout(updateCount, 15);
        } else {
          if (target >= 1000) {
            stat.innerText = (target / 1000) + 'K+';
          } else {
            stat.innerText = target + '+';
          }
        }
      };
      updateCount();
    });
  }

  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    window.addEventListener('scroll', () => {
      const sectionPos = aboutSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight / 1.3;
      if (sectionPos < screenPos && !animated) {
        animated = true;
        animateStats();
      }
    });
  }

  // Ensure ALL HTML5 video elements autoplay smoothly across all browsers
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const enableVideoOnInteraction = () => {
          video.play();
          window.removeEventListener('click', enableVideoOnInteraction);
          window.removeEventListener('touchstart', enableVideoOnInteraction);
          window.removeEventListener('scroll', enableVideoOnInteraction);
        };
        window.addEventListener('click', enableVideoOnInteraction, { once: true });
        window.addEventListener('touchstart', enableVideoOnInteraction, { once: true });
        window.addEventListener('scroll', enableVideoOnInteraction, { once: true });
      });
    }
  });

});
