// Reveal-on-scroll runs first and stands alone, so a problem anywhere else on the
// page can never stop sections from becoming visible.
try {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));
} catch (err) {
  document.querySelectorAll('.fade').forEach(el => el.classList.add('show'));
  console.error('Reveal-on-scroll failed, showing all sections instead:', err);
}

// Header solid state on scroll
try {
  const header = document.getElementById('siteHeader');
  if (header) {
    function updateHeader(){
      if (window.scrollY > 60) header.classList.add('solid');
      else header.classList.remove('solid');
    }
    window.addEventListener('scroll', updateHeader);
    updateHeader();
  }
} catch (err) {
  console.error('Header scroll effect failed:', err);
}

// Mobile menu - full-screen overlay, with body scroll lock
function lockScroll(){
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');
}
function unlockScroll(){
  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');
}
try {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMenu(){ mobileMenu.classList.add('open'); lockScroll(); }
  function closeMenu(){ mobileMenu.classList.remove('open'); unlockScroll(); }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  }
} catch (err) {
  console.error('Mobile menu failed:', err);
}

// Gallery + lightbox (guarded — only runs where #galleryGrid exists, and every
// element it touches is checked before use)
try {
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const TOTAL_IMAGES = 15;
    const images = [];
    for (let i = 1; i <= TOTAL_IMAGES; i++) images.push(`images/image-${i}.jpeg`);

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;

    function renderImage(index){
      if (!lightboxImg) return;
      currentIndex = (index + images.length) % images.length;
      lightboxImg.classList.add('fading');
      window.setTimeout(() => {
        lightboxImg.src = images[currentIndex];
        lightboxImg.alt = `Glow With IV beauty and aesthetic clinic Potchefstroom – gallery photo ${currentIndex + 1}`;
        lightboxImg.classList.remove('fading');
      }, 150);
    }

    function openLightbox(index){
      renderImage(index);
      if (lightbox) lightbox.classList.add('open');
      lockScroll();
    }
    function closeLightbox(){
      if (lightbox) lightbox.classList.remove('open');
      unlockScroll();
    }
    function showPrev(e){ if (e) e.stopPropagation(); renderImage(currentIndex - 1); }
    function showNext(e){ if (e) e.stopPropagation(); renderImage(currentIndex + 1); }

    if (lightboxClose) lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });

    images.forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'g-item';
      item.innerHTML = `<img src="${src}" alt="Glow With IV beauty and aesthetic clinic Potchefstroom – gallery photo ${i + 1}" loading="lazy" decoding="async">`;
      item.addEventListener('click', () => openLightbox(i));
      galleryGrid.appendChild(item);
    });
  }
} catch (err) {
  console.error('Gallery failed to load:', err);
}

// Scroll-spy: highlight the current section's nav link
try {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (navLinks.length) {
    const sections = Array.from(navLinks)
      .map(link => document.getElementById(link.dataset.section))
      .filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => spy.observe(section));
  }
} catch (err) {
  console.error('Nav scroll-spy failed:', err);
}

// FAQ accordion
try {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const openAnswer = openItem.querySelector('.faq-answer');
          if (openAnswer) openAnswer.style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : null;
    });
  });
} catch (err) {
  console.error('FAQ accordion failed:', err);
}

/* =====================================================================
   BOOKING FORM
   No backend exists yet, so this validates on the client, shows a
   polished success state, and gives the visitor a working way to actually
   send the request (a pre-filled WhatsApp message) rather than pretending
   data was sent somewhere.

   TO CONNECT A REAL BACKEND LATER:
   Replace the body of `submitBookingToBackend(data)` below with a real
   fetch() call to your API, e.g.:

     async function submitBookingToBackend(data) {
       const res = await fetch('https://your-api.example.com/bookings', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       });
       if (!res.ok) throw new Error('Booking request failed');
       return res.json();
     }

   Everything else (validation, success state, WhatsApp fallback) can stay
   exactly as it is.
===================================================================== */
try {
  const CLINIC_WHATSAPP = '27788142490';
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  const bookAnotherBtn = document.getElementById('bookAnotherBtn');

  if (bookingForm) {
    function setFieldValid(field){ field.closest('.field').classList.remove('invalid'); }
    function setFieldInvalid(field){ field.closest('.field').classList.add('invalid'); }

    function validateForm(){
      let valid = true;
      const required = bookingForm.querySelectorAll('[required]');
      required.forEach(field => {
        const value = field.value.trim();
        let fieldValid = value.length > 0;
        if (field.type === 'email' && value) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (field.type === 'tel' && value) {
          fieldValid = value.replace(/[^0-9]/g, '').length >= 7;
        }
        if (fieldValid) setFieldValid(field); else { setFieldInvalid(field); valid = false; }
      });
      return valid;
    }

    // Placeholder for a real backend integration — see comment block above.
    async function submitBookingToBackend(data) {
      // No backend connected yet. Resolve immediately so the UI can proceed
      // to its success state without pretending a network request happened.
      return Promise.resolve({ ok: true, data });
    }

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        const firstInvalid = bookingForm.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = new FormData(bookingForm);
      const name = data.get('name');
      const phone = data.get('phone');
      const email = data.get('email');
      const service = data.get('service');
      const date = data.get('date');
      const time = data.get('time');
      const people = data.get('people') || '1';
      const notes = data.get('notes') || 'None';

      try {
        await submitBookingToBackend(Object.fromEntries(data.entries()));
      } catch (err) {
        console.error('Booking submission failed:', err);
      }

      const message =
`Hi Glow With IV, I'd like to request an appointment:

Name: ${name}
Phone: ${phone}
Email: ${email}
Treatment: ${service}
Preferred Date: ${date}
Preferred Time: ${time}
Number of People: ${people}
Additional Info: ${notes}`;

      if (whatsappSendBtn) {
        whatsappSendBtn.href = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
      }

      bookingForm.style.display = 'none';
      if (bookingSuccess) bookingSuccess.classList.add('show');
    });

    if (bookAnotherBtn) {
      bookAnotherBtn.addEventListener('click', () => {
        bookingForm.reset();
        bookingForm.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
        bookingForm.style.display = '';
        if (bookingSuccess) bookingSuccess.classList.remove('show');
      });
    }
  }
} catch (err) {
  console.error('Booking form failed:', err);
}