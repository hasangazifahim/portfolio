const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const inquiriesPath = path.join(__dirname, '..', 'data', 'inquiries.json');

function saveInquiry(inquiry) {
  try {
    let list = [];
    if (fs.existsSync(inquiriesPath)) {
      const raw = fs.readFileSync(inquiriesPath, 'utf8');
      list = JSON.parse(raw || '[]');
    }
    list.unshift(inquiry);
    fs.writeFileSync(inquiriesPath, JSON.stringify(list, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save inquiry:', err);
    return false;
  }
}

// Helper: Basic email format validation
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// POST /api/contact - General message / consultation inquiry
router.post('/contact', (req, res) => {
  const { name, email, message, service, budget } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const newInquiry = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: 'contact_message',
    createdAt: new Date().toISOString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    service: service || 'General SEO Consultation',
    budget: budget || 'Flexible',
    status: 'new'
  };

  const saved = saveInquiry(newInquiry);
  if (!saved) {
    return res.status(500).json({ error: 'Failed to record your message. Please try again.' });
  }

  console.log(`[Contact] New inquiry from ${newInquiry.name} <${newInquiry.email}> -> Destination: gazifahimhasan1@gmail.com`);

  // Forward to email endpoint asynchronously
  if (typeof fetch === 'function') {
    fetch('https://formsubmit.co/ajax/gazifahimhasan1@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'PortfolioBackend/1.0'
      },
      body: JSON.stringify({
        name: newInquiry.name,
        email: newInquiry.email,
        message: newInquiry.message,
        _subject: `New SEO Client Message from ${newInquiry.name} (${newInquiry.email})`,
        _replyto: newInquiry.email,
        _template: 'table',
        _captcha: 'false'
      })
    }).catch(err => console.error('[Contact Forward Error]', err.message));
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Gazi Fahim Hasan will review your project details and respond within 24 hours.',
    inquiryId: newInquiry.id
  });
});

// POST /api/audit-request - Specialized SEO audit lead capture
router.post('/audit-request', (req, res) => {
  const { name, email, websiteUrl, targetKeywords, monthlyTraffic } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!websiteUrl || !websiteUrl.trim()) {
    return res.status(400).json({ error: 'Website URL is required for the audit' });
  }

  const newAudit = {
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: 'seo_audit_request',
    createdAt: new Date().toISOString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    websiteUrl: websiteUrl.trim(),
    targetKeywords: targetKeywords ? targetKeywords.trim() : 'General Organic Growth',
    monthlyTraffic: monthlyTraffic || 'Not specified',
    status: 'pending_review'
  };

  const saved = saveInquiry(newAudit);
  if (!saved) {
    return res.status(500).json({ error: 'Failed to submit audit request. Please try again.' });
  }

  console.log(`[Audit Request] New audit requested for ${newAudit.websiteUrl} by ${newAudit.name}`);

  res.status(201).json({
    success: true,
    message: 'Your Free SEO Audit Request has been scheduled! Gazi will analyze your website technical health and send your custom roadmap.',
    inquiryId: newAudit.id
  });
});

// GET /api/inquiries - Retrieve recent inquiries (local dev helper)
router.get('/inquiries', (req, res) => {
  try {
    if (!fs.existsSync(inquiriesPath)) {
      return res.json([]);
    }
    const raw = fs.readFileSync(inquiriesPath, 'utf8');
    const list = JSON.parse(raw || '[]');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch inquiries' });
  }
});

module.exports = router;
