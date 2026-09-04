/**
 * Gazi Fahim Hasan Portfolio - Core Interactions & UI Controller
 */

import { submitContactForm, submitAuditRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initCounters();
  initServicesAccordion();
  initFormTabs();
  initContactForms();
  initScrollSpy();
});

/* Theme Toggle (Dark / Light) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* Mobile Navigation */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  // Close when clicking link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
    });
  });
}

/* Animated Counters */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, target, 1800, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = easeOutQuad(progress);
    const current = Math.floor(easeProgress * (end - start) + start);
    obj.textContent = current.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

/* Services Drawer / Accordion (Reference 2 Inspired) */
function initServicesAccordion() {
  const drawerItems = document.querySelectorAll('.service-drawer-item');
  drawerItems.forEach((item, index) => {
    // Make first item active by default
    if (index === 0) item.classList.add('is-active');

    item.addEventListener('click', () => {
      drawerItems.forEach(other => {
        if (other !== item) other.classList.remove('is-active');
      });
      item.classList.toggle('is-active');
    });
  });
}

/* Form Tabs Switcher (Audit vs General Message) */
function initFormTabs() {
  const tabBtns = document.querySelectorAll('.form-tab-btn');
  const auditFields = document.getElementById('audit-fields');
  const messageFields = document.getElementById('message-fields');
  const submitBtnText = document.getElementById('submit-btn-text');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-tab');
      if (target === 'audit') {
        if (auditFields) auditFields.style.display = 'block';
        if (messageFields) messageFields.style.display = 'none';
        if (submitBtnText) submitBtnText.textContent = 'Request Free Audit Report (24h)';
      } else {
        if (auditFields) auditFields.style.display = 'none';
        if (messageFields) messageFields.style.display = 'block';
        if (submitBtnText) submitBtnText.textContent = 'Send Consultation Message';
      }
    });
  });
}

/* Form Submission Handler */
function initContactForms() {
  const form = document.getElementById('lead-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const activeTab = document.querySelector('.form-tab-btn.active')?.getAttribute('data-tab') || 'audit';
    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();

    if (!name || !email) {
      showFeedback('Please fill in your name and email address.', 'error');
      return;
    }

    setButtonLoading(true);

    try {
      if (activeTab === 'audit') {
        const websiteUrl = document.getElementById('form-website')?.value.trim();
        const targetKeywords = document.getElementById('form-keywords')?.value.trim();
        const monthlyTraffic = document.getElementById('form-traffic')?.value;

        if (!websiteUrl) {
          throw new Error('Please provide your website URL to be audited.');
        }

        const res = await submitAuditRequest({
          name,
          email,
          websiteUrl,
          targetKeywords,
          monthlyTraffic
        });

        showFeedback(res.message, 'success');
        form.reset();
      } else {
        const message = document.getElementById('form-message')?.value.trim();
        const service = document.getElementById('form-service')?.value;

        if (!message) {
          throw new Error('Please write your message or project requirements.');
        }

        const res = await submitContactForm({
          name,
          email,
          message,
          service
        });

        showFeedback(res.message, 'success');
        form.reset();
      }
    } catch (err) {
      showFeedback(err.message || 'Something went wrong. Please check your inputs.', 'error');
    } finally {
      setButtonLoading(false);
    }
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.style.opacity = isLoading ? '0.7' : '1';
    const btnText = document.getElementById('submit-btn-text');
    if (btnText) {
      if (isLoading) {
        btnText.setAttribute('data-orig', btnText.textContent);
        btnText.textContent = 'Processing...';
      } else {
        btnText.textContent = btnText.getAttribute('data-orig') || 'Submit';
      }
    }
  }
}

/* ScrollSpy for Navigation Active Link */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
