/* ==========================================
   FacBTP Admin — Auth
   ========================================== */
const API_URL = 'https://api.factbtp.pro';

async function adminLogin(password) {
  try {
    const r = await fetch(API_URL + '/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password })
    });
    const data = await r.json();
    if (data.success && data.token) {
      localStorage.setItem('fbtp_token', data.token);
      return true;
    }
    return false;
  } catch(e) {
    console.error('Login error:', e);
    return false;
  }
}

function getToken() {
  return localStorage.getItem('fbtp_token');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function adminLogout() {
  localStorage.removeItem('fbtp_token');
  window.location.href = 'index.html';
}

// Attacher logout sur tous les boutons
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', adminLogout);
});
