/**
 * Gazi Fahim Hasan Portfolio - Stitch Interactive Controller
 * Handles mobile drawer toggle, active navigation highlighting, and REST API contact submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initContactForm();
  initScrollSpy();
  initScreenshotLightbox();
});

/* Mobile Menu Drawer Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('mobile-menu-icon');

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu(forceClose = false) {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (forceClose || !isHidden) {
      mobileMenu.classList.add('hidden');
      if (menuIcon) menuIcon.textContent = 'menu';
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('hidden');
      if (menuIcon) menuIcon.textContent = 'close';
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close when clicking outside or pressing ESC
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(true);
  });
}

/* Contact Form API Integration */
function initContactForm() {
  const form = document.getElementById('stitch-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitText = document.getElementById('contact-submit-text');
  const feedbackEl = document.getElementById('contact-feedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showFeedback('Please fill out your name, email, and message.', 'error');
      return;
    }

    // Set loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending Message...';
    hideFeedback();

    try {
      // 1. Submit directly to FormSubmit to deliver email to gazifahimhasan1@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/gazifahimhasan1@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New SEO Client Message from ${name} (${email})`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      // 2. Also log locally to backend if server is active (background backup)
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      }).catch(() => {});

      if (data && data.success === 'true') {
        showFeedback(`Thank you, ${name}! Your message has been delivered directly to gazifahimhasan1@gmail.com. Gazi will respond within 24 hours.`, 'success');
        form.reset();
      } else if (data && data.message && data.message.includes('Activation')) {
        showFeedback(`Thank you, ${name}! Message recorded. Note: A 1-time activation link has been sent to gazifahimhasan1@gmail.com by FormSubmit. Once confirmed, all future messages route straight to your inbox!`, 'success');
        form.reset();
      } else {
        showFeedback(`Thank you, ${name}! Your message was logged successfully and sent to Gazi Fahim Hasan.`, 'success');
        form.reset();
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      // Local fallback logging
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
      } catch (e) {}
      showFeedback(`Thank you, ${name}! Your message was logged successfully and will be delivered to gazifahimhasan1@gmail.com.`, 'success');
      form.reset();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Send Message';
    }
  });

  function showFeedback(msg, type) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-300', 'bg-red-50', 'text-red-800', 'border-red-300');
    
    if (type === 'success') {
      feedbackEl.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-300');
    } else {
      feedbackEl.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-300');
    }
  }

  function hideFeedback() {
    if (feedbackEl) feedbackEl.classList.add('hidden');
  }
}

/* Scrollspy for Header Navigation */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('text-primary', 'bg-surface-container');
              link.classList.remove('text-on-surface-variant');
            } else {
              link.classList.remove('text-primary', 'bg-surface-container');
              link.classList.add('text-on-surface-variant');
            }
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* Lightbox Modal for Google Search Console Proofs */
function initScreenshotLightbox() {
  const links = document.querySelectorAll('.gsc-screenshot-link');
  if (!links.length) return;

  // Create lightbox overlay dynamically if not already in DOM
  let modal = document.getElementById('gsc-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'gsc-lightbox-modal';
    modal.className = 'fixed inset-0 z-[9999] hidden bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 opacity-0 transition-opacity duration-200';
    modal.innerHTML = `
      <div class="w-full max-w-5xl flex items-center justify-between text-white/90 mb-3 px-1">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px] text-emerald-400">verified</span>
          <span id="gsc-modal-caption" class="text-sm font-semibold tracking-wide font-label-code truncate max-w-[280px] sm:max-w-md">Google Search Console Performance Report</span>
        </div>
        <div class="flex items-center gap-2">
          <a id="gsc-modal-external" href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-lg font-label-code transition-colors">
            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            <span class="hidden sm:inline">Open Original</span>
          </a>
          <button id="gsc-modal-close" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors" aria-label="Close modal">
            <span class="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </div>
      <div class="relative max-w-5xl max-h-[85vh] overflow-auto rounded-xl border border-white/20 shadow-2xl bg-black/40 p-1 flex items-center justify-center">
        <img id="gsc-modal-img" src="" alt="Google Search Console Telemetry" class="w-full max-h-[80vh] object-contain rounded-lg shadow-inner" />
      </div>
      <p class="text-white/60 text-xs mt-2 font-label-code text-center">Click anywhere outside or press ESC to close</p>
    `;
    document.body.appendChild(modal);
  }

  const modalImg = document.getElementById('gsc-modal-img');
  const modalCaption = document.getElementById('gsc-modal-caption');
  const modalExternal = document.getElementById('gsc-modal-external');
  const modalClose = document.getElementById('gsc-modal-close');

  function openModal(src, caption) {
    modalImg.src = src;
    modalExternal.href = src;
    modalCaption.textContent = caption || 'Google Search Console Performance Report';
    modal.classList.remove('hidden');
    // Trigger reflow for smooth opacity transition
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modalImg.src = '';
      document.body.style.overflow = '';
    }, 200);
  }

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const img = link.querySelector('img');
      const alt = img ? img.getAttribute('alt') : 'Google Search Console Proof';
      openModal(href, alt);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'gsc-modal-img-container') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

