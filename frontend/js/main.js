/**
 * Gazi Fahim Hasan Portfolio - Interactions Controller
 */

import { submitAuditRequest } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  initAboutTabs();
  initFooterForm();
});

/* About Tabs Switcher */
function initAboutTabs() {
  const tabs = document.querySelectorAll('.tab-pill');
  const boxes = document.querySelectorAll('.about-service-box');

  const contentMap = {
    all: [
      { num: '01 / STRATEGY', title: 'SEO Writing & Intent', sub: 'Content clustering & semantic mapping' },
      { num: '02 / SPECIALIST', title: 'Technical SEO Architect', sub: 'Core Web Vitals & indexation pipelines', active: true },
      { num: '03 / AUDIT', title: 'Crawl & Schema Logic', sub: '100+ point full technical health audit' },
      { num: '04 / GROWTH', title: 'Competitor Intelligence', sub: 'SERP gap analysis & high-DR outreach' }
    ],
    education: [
      { num: '2016 - 2019', title: 'Sonargaon University', sub: 'B.Sc. in Computer Science & Engineering', active: true },
      { num: 'CORE FOCUS', title: 'Algorithms & Information Retrieval', sub: 'Search engine crawling & computational logic' },
      { num: 'LEADERSHIP', title: 'Department Recommendations', sub: 'Endorsed by Dept Head Bulbul Ahamed' },
      { num: 'FOUNDATION', title: 'Web Systems Architecture', sub: 'Server status codes, networking & databases' }
    ],
    skills: [
      { num: 'CORE SEO', title: 'Technical Crawl Audits', sub: '100% crawl optimization, zero broken links', active: true },
      { num: 'ANALYTICS', title: 'Search Console & GA4', sub: 'Advanced tracking & impression funnel tuning' },
      { num: 'SEMANTICS', title: 'On-Page Intent Modeling', sub: 'Helpful content systems & entity markup' },
      { num: 'AUTHORITY', title: 'Off-Page Link Strategy', sub: 'White-hat high-DR editorial outreach' }
    ],
    experience: [
      { num: '2025 - PRESENT', title: 'Scaleup Ads Agency', sub: 'SEO Executive supervising SEO team targets', active: true },
      { num: '2024 - PRESENT', title: 'Freelance SEO Specialist', sub: 'Direct client consulting & high-ROI roadmaps' },
      { num: '2024 - 2024', title: 'United Interpreters', sub: 'Bilingual Training Assistant / Interpreter' },
      { num: 'GLOBAL ACCTS', title: 'E-Commerce & SaaS', sub: 'Multi-location and international SERP campaigns' }
    ]
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      const items = contentMap[target] || contentMap.all;

      boxes.forEach((box, i) => {
        if (items[i]) {
          box.querySelector('.box-number').textContent = items[i].num;
          box.querySelector('.box-title').textContent = items[i].title;
          box.querySelector('.box-sub').textContent = items[i].sub;
          if (items[i].active) {
            box.classList.add('active-box');
          } else {
            box.classList.remove('active-box');
          }
        }
      });
    });
  });
}

/* Footer SEO Audit Request Form */
function initFooterForm() {
  const form = document.getElementById('footer-lead-form');
  const feedback = document.getElementById('footer-feedback');
  const submitBtn = document.getElementById('f-submit');
  const btnText = document.getElementById('f-submit-text');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const websiteUrl = document.getElementById('f-website').value.trim();
    const targetKeywords = document.getElementById('f-keywords').value.trim();

    if (!name || !email || !websiteUrl) {
      showFeedback('Please fill in your name, email, and website URL.', 'red');
      return;
    }

    submitBtn.disabled = true;
    btnText.textContent = 'Submitting Request...';

    try {
      const res = await submitAuditRequest({
        name,
        email,
        websiteUrl,
        targetKeywords: targetKeywords || 'Organic Visibility Lift'
      });

      showFeedback(res.message || 'Audit Request received! Gazi will review your website within 24 hours.', '#10B981');
      form.reset();
    } catch (err) {
      showFeedback(err.message || 'Submission error. Please check your details.', '#EF4444');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Request (24h Turnaround) →';
    }
  });

  function showFeedback(msg, color) {
    if (!feedback) return;
    feedback.style.display = 'block';
    feedback.style.background = color === '#10B981' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    feedback.style.color = color;
    feedback.style.border = `1px solid ${color}`;
    feedback.textContent = msg;
  }
}
