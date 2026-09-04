/**
 * Gazi Fahim Hasan Portfolio - Client API Service
 */

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? '' 
  : '';

export async function submitContactForm(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit inquiry');
    }
    return data;
  } catch (err) {
    console.error('Contact form submission error:', err);
    throw err;
  }
}

export async function submitAuditRequest(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/audit-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit audit request');
    }
    return data;
  } catch (err) {
    console.error('Audit request submission error:', err);
    throw err;
  }
}

export async function fetchProfileData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`);
    if (!response.ok) throw new Error('Could not fetch profile');
    return await response.json();
  } catch (err) {
    console.warn('Using static profile fallback:', err);
    return null;
  }
}
