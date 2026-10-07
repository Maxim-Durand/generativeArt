const DRAG_THRESHOLD = 6;
const SPACING = 0.82;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const stage = document.getElementById('stage');
const backdrop = document.getElementById('backdrop');
const caption = document.getElementById('caption');
const dotsEl = document.getElementById('dots');

const projects = await fetch('site/projects.json').then((r) => r.json());
const hue = (name) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

const cards = projects.map((p) => {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = `${p.name}/index.html`;
  a.style.setProperty('--hue', hue(p.name));
  a.setAttribute('aria-label', p.title);
  if (p.thumb) {
    const img = new Image();
    img.src = p.thumb;
    img.alt = '';
    img.draggable = false;
    img.onerror = () => img.replaceWith(fallback(p.title));
    a.append(img);
  } else {
    a.append(fallback(p.title));
  }
  stage.append(a);
  return a;
});

function fallback(title) {
  const d = document.createElement('div');
  d.className = 'fallback';
  d.textContent = title;
  return d;
}

const dots = projects.map((p, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', p.title);
  b.onclick = () => goTo(i);
  dotsEl.append(b);
  return b;
});

const last = projects.length - 1;
const clamp = (v) => Math.max(0, Math.min(last, v));
let position = 0;
let target = 0;
let velocity = 0;
let shown = -1;

function goTo(i) {
  target = clamp(i);
}

function render() {
  const cardW = cards[0].offsetWidth;
  cards.forEach((card, i) => {
    const d = i - position;
    const abs = Math.abs(d);
    const x = Math.sign(d) * Math.min(abs, 1) * cardW * SPACING + Math.sign(d) * Math.max(abs - 1, 0) * cardW * 0.28;
    const scale = Math.max(0.55, 1 - abs * 0.14);
    const rotate = Math.max(-1, Math.min(1, d)) * -24;
    card.style.transform = `translateX(${x}px) translateZ(${-abs * 140}px) rotateY(${rotate}deg) scale(${scale})`;
    card.style.opacity = Math.max(0, 1 - Math.max(abs - 2, 0) * 0.6);
    card.style.zIndex = 100 - Math.round(abs * 10);
    card.style.pointerEvents = abs > 3 ? 'none' : '';
    card.tabIndex = i === Math.round(position) ? 0 : -1;
  });
  const active = clamp(Math.round(position));
  if (active !== shown) {
    shown = active;
    const p = projects[active];
    caption.textContent = p.title;
    backdrop.style.backgroundImage = p.thumb ? `url(${p.thumb})` : 'none';
    dots.forEach((b, i) => b.setAttribute('aria-current', String(i === active)));
  }
}

let dragging = false;
let startX = 0;
let startPos = 0;
let moved = 0;
let lastX = 0;
let lastT = 0;
let downCard = null;

stage.addEventListener('pointerdown', (e) => {
  dragging = true;
  downCard = e.target.closest('.card');
  moved = 0;
  startX = lastX = e.clientX;
  startPos = position;
  lastT = performance.now();
  velocity = 0;
  target = position;
  stage.setPointerCapture(e.pointerId);
});

stage.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  moved = Math.max(moved, Math.abs(dx));
  if (moved > DRAG_THRESHOLD) stage.classList.add('dragging');
  const unit = cards[0].offsetWidth * SPACING;
  position = startPos - dx / unit;
  const now = performance.now();
  velocity = (-(e.clientX - lastX) / unit) / Math.max(now - lastT, 1);
  lastX = e.clientX;
  lastT = now;
  target = position;
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');
  if (moved > DRAG_THRESHOLD) target = clamp(Math.round(position + velocity * 180));
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

stage.addEventListener('click', (e) => {
  if (e.detail === 0) return;
  e.preventDefault();
  if (moved > DRAG_THRESHOLD || !downCard) return;
  const i = cards.indexOf(downCard);
  if (i === shown) location.href = downCard.href;
  else goTo(i);
});

let wheelLock = 0;
addEventListener('wheel', (e) => {
  const now = performance.now();
  if (now < wheelLock) return;
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(delta) < 8) return;
  wheelLock = now + 350;
  goTo(shown + Math.sign(delta));
}, { passive: true });

addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goTo(shown + 1);
  else if (e.key === 'ArrowLeft') goTo(shown - 1);
  else if (e.key === 'Home') goTo(0);
  else if (e.key === 'End') goTo(last);
});

function frame() {
  if (!dragging) {
    const diff = target - position;
    position = reduceMotion || Math.abs(diff) < 0.001 ? target : position + diff * 0.14;
  }
  render();
  requestAnimationFrame(frame);
}
frame();
