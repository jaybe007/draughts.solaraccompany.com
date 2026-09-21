const fs = require('fs');
const http = require('http');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('=== RUNNING COMPREHENSIVE LINK & BUTTON VISIBILITY TEST SUITE ===\n');

// 1. DASHBOARD.PHP AUDIT
console.log('1. Auditing dashboard.php:');
const dashHtml = fs.readFileSync('dashboard.php', 'utf8');

assert(dashHtml.includes('dash-mobile-nav-toggle') && dashHtml.includes('btn-mobile-nav'), 'Mobile hamburger nav button exists in header');
assert(dashHtml.includes('id="dash-main-nav"'), 'Functional navigation menu has id="dash-main-nav"');
assert(dashHtml.includes('Host Official Tournament') && dashHtml.includes('menu-tournaments'), 'Tournaments dropdown has "Host Official Tournament"');
assert(dashHtml.includes('Fund Naira Wallet') && dashHtml.includes('menu-actions'), 'Action dropdown has "Fund Naira Wallet"');
assert(dashHtml.includes('+ New Message') && dashHtml.includes('menu-actions'), 'Action dropdown has "+ New Message"');
assert(dashHtml.includes('+ Fund Naira') && dashHtml.includes('nav-wallet-pill'), 'Top navigation wallet pill displays "+ Fund Naira"');
assert(dashHtml.includes('btn-new-msg') && dashHtml.includes('+ New Message'), 'Messages panel header has "+ New Message" button with dedicated class');
assert(dashHtml.includes('btn-fund-wallet') && dashHtml.includes('Fund Naira Wallet (Deposit)'), 'Wallet panel has "Fund Naira Wallet (Deposit)" button with dedicated class');
assert(dashHtml.includes('btn-host-tourn') && dashHtml.includes('Host Official Tournament'), 'Tournaments banner has "Host Official Tournament" with dedicated class');

// 2. HOME.CSS AUDIT
console.log('\n2. Auditing home.css:');
const homeCss = fs.readFileSync('home.css', 'utf8');

assert(homeCss.includes('.dropdown-link') && homeCss.includes('color: #f1f5f9;'), '.dropdown-link has high-contrast #f1f5f9 color');
assert(homeCss.includes('.dropdown-link.highlight-gold') && homeCss.includes('.dropdown-link.highlight-green'), 'Gold & green highlight dropdown variants defined');
assert(homeCss.includes('.dash-mobile-nav-toggle') && homeCss.includes('.hamburger-bar'), 'Mobile hamburger styles properly defined');
assert(homeCss.includes('.dash-main-nav.mobile-open'), 'Mobile open drawer navigation layout defined');
assert(homeCss.includes('.msg-threads-header .btn-small') && homeCss.includes('.btn-new-msg'), 'Dedicated styles for + New Message defined');
assert(homeCss.includes('.btn-fund-wallet') && homeCss.includes('.wallet-actions-row .btn-primary'), 'Dedicated styles for Fund Naira Wallet defined');
assert(homeCss.includes('.btn-host-tourn') && homeCss.includes('.tournaments-action-banner .btn-primary'), 'Dedicated styles for Host Official Tournament defined');

// 3. STYLE.CSS AUDIT
console.log('\n3. Auditing style.css:');
const styleCss = fs.readFileSync('style.css', 'utf8');

assert(styleCss.includes('.btn-new-msg') && styleCss.includes('.msg-threads-header .btn-small'), 'style.css protects New Message button visibility');
assert(styleCss.includes('.btn-fund-wallet'), 'style.css protects Fund Naira Wallet button visibility');
assert(styleCss.includes('.btn-host-tourn'), 'style.css protects Host Official Tournament button visibility');

// 4. JS/DASHBOARD.JS AUDIT
console.log('\n4. Auditing js/dashboard.js:');
const dashJs = fs.readFileSync('js/dashboard.js', 'utf8');

assert(dashJs.includes('function toggleMobileNav()'), 'toggleMobileNav() function implemented');
assert(dashJs.includes('mobile-open'), 'mobile-open class toggled in js');

// 5. ADMIN.PHP & ADMIN.CSS AUDIT
console.log('\n5. Auditing admin.php & admin.css:');
const adminHtml = fs.readFileSync('admin.php', 'utf8');
const adminCss = fs.readFileSync('admin.css', 'utf8');

assert(adminHtml.includes('Host Official Tournament'), 'admin.php contains "Host Official Tournament" button');
assert(adminCss.includes('--text-secondary: #e2e8f0;') && adminCss.includes('--text-muted: #94a3b8;'), 'admin.css has elevated WCAG-compliant text contrast');
assert(adminCss.includes('.btn-admin-primary') && adminCss.includes('font-weight: 800;'), 'admin.css primary action button has bold styling');

// 6. HTTP ENDPOINT TESTS
console.log('\n6. Auditing HTTP Endpoints on Local Apache:');
const endpoints = [
  'http://127.0.0.1/nigerian-draughts/health_check.php',
  'http://127.0.0.1/nigerian-draughts/index.php',
  'http://127.0.0.1/nigerian-draughts/admin.php',
  'http://127.0.0.1/nigerian-draughts/puzzles.php'
];

let pending = endpoints.length;

endpoints.forEach(url => {
  http.get(url, (res) => {
    assert(res.statusCode === 200, `HTTP GET ${url} returned status 200 OK`);
    pending--;
    if (pending === 0) {
      console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===`);
      process.exit(passedTests === totalTests ? 0 : 1);
    }
  }).on('error', (err) => {
    assert(false, `HTTP GET ${url} failed: ${err.message}`);
    pending--;
    if (pending === 0) {
      console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===`);
      process.exit(passedTests === totalTests ? 0 : 1);
    }
  });
});
