// ---------- Language toggle (EN / AR) ----------
const html = document.documentElement;
const langBtn = document.getElementById('langBtn');

function applyLang(lang) {
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-en]').forEach(el => {
    const v = el.getAttribute('data-' + lang);
    if (v) el.textContent = v;
  });
  langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
  try { localStorage.setItem('lang', lang); } catch (e) {}
}
langBtn.addEventListener('click', () => applyLang(html.lang === 'ar' ? 'en' : 'ar'));
let saved = 'en';
try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
if (saved === 'ar') applyLang('ar');

// ---------- Nav: scroll state, mobile menu, active link ----------
const nav = document.getElementById('nav');
const links = document.getElementById('links');
document.getElementById('burger').addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });

const sections = document.querySelectorAll('main section[id]');
const navLinks = links.querySelectorAll('a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Terminal typing effect ----------
const lines = [
  'R1# show ip ospf neighbor',
  'Neighbor ID   Pri State     Interface',
  '2.2.2.2         1 FULL/DR   Gi0/1',
  '3.3.3.3         1 FULL/BDR  Gi0/2',
  '',
  'R1# show vlan brief | include active',
  '10  SALES    active  Fa0/1-8',
  '20  IT       active  Fa0/9-16',
  '',
  'R1# ping 10.0.20.1',
  '!!!!!  Success rate is 100 percent'
];
const term = document.getElementById('term');
let li = 0, ci = 0, out = '';
function type() {
  if (li >= lines.length) return;
  const line = lines[li];
  const isCmd = line.includes('#');
  if (isCmd && ci < line.length) {
    term.textContent = out + line.slice(0, ++ci) + '▍';
    setTimeout(type, 38);
  } else {
    out += line + '\n'; li++; ci = 0;
    term.textContent = out + (li < lines.length ? '▍' : '');
    setTimeout(type, isCmd ? 350 : 90);
  }
}
if (term) type();

// ---------- Certificates lightbox ----------
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
function closeLb() { lb.hidden = true; lbImg.removeAttribute('src'); document.body.style.overflow = ''; }
document.querySelectorAll('.cert-btn').forEach(btn => btn.addEventListener('click', () => {
  lbImg.src = btn.dataset.full;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}));
lb.addEventListener('click', closeLb);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
