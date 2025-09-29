// Populate year
(function() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Mobile menu toggle
(function() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileToggle && mobileMenu) {
    // ensure data-open attribute exists
    if (!mobileMenu.hasAttribute('data-open')) mobileMenu.setAttribute('data-open', 'false');

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.getAttribute('data-open') === 'true';
      if (!isOpen) {
        mobileMenu.style.display = 'block';
        mobileMenu.setAttribute('data-open', 'true');
        mobileToggle.setAttribute('aria-label', 'Close menu');
      } else {
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('data-open', 'false');
        mobileToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }
})();

// Simple contact form handling - demo only
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    if (!nameEl || !emailEl || !messageEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (!name || !email || !message) {
      alert('Please fill all fields.');
      return;
    }

    alert('Thanks ' + name + '! Your message has been received. (Demo only)');
    form.reset();
  });
})();

// --- Simple test runner (runs automatically unless ?test=false in URL) ---
(function runTests() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'false') return; // tests disabled

    const results = [];

    function pass(name) { results.push({name, pass:true}); }
    function fail(name, reason) { results.push({name, pass:false, reason}); }

    // Test: logo exists
    const logo = document.querySelector('.logo-img');
    if (logo) pass('logoExists'); else fail('logoExists', 'logo.png not found or .logo-img missing');

    // Test: nav links
    const nav = document.querySelector('nav.desktop');
    if (nav && nav.querySelectorAll('a').length >= 4) pass('navLinks'); else fail('navLinks', 'expected >=4 nav links');

    // Test: contact form fields
    const form = document.getElementById('contactForm');
    if (form && document.getElementById('name') && document.getElementById('email') && document.getElementById('message')) pass('contactFormFields'); else fail('contactFormFields', 'form or inputs missing');

    // Test: year populated
    const yearEl = document.getElementById('year');
    if (yearEl && yearEl.textContent === String(new Date().getFullYear())) pass('yearPopulated'); else fail('yearPopulated', 'year not populated');

    // Test: mobile toggle exists and toggles
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
      const before = mobileMenu.style.display;
      mobileToggle.click();
      const after = mobileMenu.style.display;
      // toggle back
      mobileToggle.click();
      if (before !== after) pass('mobileToggleBehavior'); else fail('mobileToggleBehavior', 'menu did not toggle');
    } else fail('mobileToggleBehavior', 'mobileToggle or mobileMenu missing');

    // Publish results to console
    console.group('Vorteile site tests');
    results.forEach(r => {
      if (r.pass) console.log('%cPASS','color:green', r.name);
      else console.error('%cFAIL','color:red', r.name, r.reason || '');
    });
    console.groupEnd();

    // Expose results for external checks
    window.__vorteile_test_results = results;

    // Show a small on-page panel with summary (non-intrusive)
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = '12px';
    panel.style.bottom = '12px';
    panel.style.background = '#071431';
    panel.style.color = '#cbd5e1';
    panel.style.padding = '8px 10px';
    panel.style.borderRadius = '8px';
    panel.style.fontSize = '12px';
    panel.style.boxShadow = '0 6px 20px rgba(2,6,23,.2)';
    panel.style.zIndex = 9999;

    const passed = results.filter(r=>r.pass).length;
    const failed = results.filter(r=>!r.pass).length;
    panel.textContent = `Tests: ${passed} passed • ${failed} failed`;

    const btn = document.createElement('button');
    btn.textContent = 'Details';
    btn.style.marginLeft = '8px';
    btn.style.padding = '4px 6px';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => alert(JSON.stringify(results, null, 2));
    panel.appendChild(btn);

    document.body.appendChild(panel);
  } catch (err) {
    console.error('Test runner failed', err);
  }
})();