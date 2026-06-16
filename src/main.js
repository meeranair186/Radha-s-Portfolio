import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------------- */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/** Wait for the heavy sketch scans so the story never stutters on first scroll. */
function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve(src);
          img.src = src;
        })
    )
  );
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('is-hidden');
}

/** Live-ish train clock for the "Next Stop" display. */
function startClock() {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = now
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      .padStart(5, '0');
  };
  tick();
  setInterval(tick, 1000 * 15);
}

/* -------------------------------------------------------------------------
   Route progress (the little Mumbai-local route map at the bottom)
   ------------------------------------------------------------------------- */

const ROUTE_STOPS = document.querySelectorAll('.route__stop');
const ROUTE_FILL = document.querySelector('.route__fill');
// Progress at which each station becomes "current".
const STOP_STARTS = [0, 0.08, 0.2, 0.45, 0.67, 0.85];

function updateRoute(progress) {
  if (ROUTE_FILL) ROUTE_FILL.style.right = `${(1 - progress) * 100}%`;

  let active = 0;
  for (let i = 0; i < STOP_STARTS.length; i += 1) {
    if (progress >= STOP_STARTS[i]) active = i;
  }
  ROUTE_STOPS.forEach((stop, i) => {
    stop.classList.toggle('is-active', i === active);
  });
}

/* -------------------------------------------------------------------------
   The scrollytelling timeline
   ------------------------------------------------------------------------- */

function buildStory() {
  const track = document.getElementById('scroll-track');
  // Total scroll distance for the whole journey.
  track.style.height = '780vh';

  // --- Initial states -----------------------------------------------------
  gsap.set('#panel-portrait', { opacity: 0 });
  gsap.set('.art--portrait', { scale: 1.08, transformOrigin: '50% 42%' });

  gsap.set('#panel-train', { opacity: 0 });
  gsap.set('.art--train', { scale: 1.18 });
  gsap.set('.bio-box', { opacity: 0, y: 26, scale: 0.96 });

  gsap.set('#panel-likes', { opacity: 0 });
  gsap.set('.section-heading--likes', { opacity: 0, y: -20 });
  gsap.set('.shock-face', { opacity: 0, scale: 1 });
  gsap.set('.art--tote', { opacity: 0, y: -70, scale: 1.06, rotation: -4 });

  gsap.set('#panel-dislikes', { opacity: 0 });
  gsap.set('.art--dislikes', { opacity: 0, scale: 0.18, rotation: -22 });

  gsap.set('#panel-nextstop', { opacity: 0 });

  // --- Master timeline ----------------------------------------------------
  const tl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    scrollTrigger: {
      trigger: '#scroll-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => updateRoute(self.progress),
    },
  });

  // A. Landing -> Portrait (the tag zooms out onto the chest) --------------
  tl.addLabel('toPortrait')
    .to('.tag-hero', { scale: 0.13, y: '7vh', rotation: -8, duration: 1.4 }, 'toPortrait')
    .to('.scroll-hint', { opacity: 0, y: -30, duration: 0.5 }, 'toPortrait')
    .to('.paper-grain', { opacity: 0, duration: 0.6 }, 'toPortrait')
    .to('#panel-portrait', { opacity: 1, duration: 0.8 }, 'toPortrait+=0.5')
    .to('.art--portrait', { scale: 1, duration: 1.2, ease: 'power2.out' }, 'toPortrait+=0.5')
    .to('.tag-hero', { opacity: 0, duration: 0.4 }, 'toPortrait+=1.15')
    .to('#panel-landing', { opacity: 0, duration: 0.3 }, 'toPortrait+=1.25')
    .to({}, { duration: 0.6 });

  // B. Portrait -> The Rush (pull back into the crowd) ---------------------
  tl.addLabel('toTrain')
    .to('.art--portrait', { scale: 0.5, y: '5vh', opacity: 0, duration: 1.2 }, 'toTrain')
    .to('#panel-portrait', { opacity: 0, duration: 1.0 }, 'toTrain+=0.4')
    .to('#panel-train', { opacity: 1, duration: 1.0 }, 'toTrain')
    .to('.art--train', { scale: 1, duration: 1.4, ease: 'power2.out' }, 'toTrain')
    .to('.bio-box', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }, 'toTrain+=1.0')
    .to({}, { duration: 0.9 });

  // C. The Rush -> Likes (a shocked beat, then the tote spills) ------------
  tl.addLabel('toLikes')
    .to('.bio-box', { opacity: 0, y: 20, duration: 0.5 }, 'toLikes')
    .to('#panel-likes', { opacity: 1, duration: 0.2 }, 'toLikes')
    .to('.shock-face', { opacity: 1, duration: 0.2 }, 'toLikes+=0.1')
    .to('.shock-face', { scale: 1.14, duration: 0.7 }, 'toLikes+=0.1')
    .to('#panel-train', { opacity: 0, duration: 0.5 }, 'toLikes+=0.35')
    .to('.shock-face', { opacity: 0, duration: 0.4 }, 'toLikes+=0.75')
    .to('.section-heading--likes', { opacity: 1, y: 0, duration: 0.6 }, 'toLikes+=0.85')
    .to(
      '.art--tote',
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.0, ease: 'bounce.out' },
      'toLikes+=0.95'
    )
    .to({}, { duration: 0.9 });

  // D. Likes -> Dislikes (the crumpled paper opens) ------------------------
  tl.addLabel('toDislikes')
    .to(['.art--tote', '.section-heading--likes'], { opacity: 0, duration: 0.5 }, 'toDislikes')
    .to('#panel-likes', { opacity: 0, duration: 0.6 }, 'toDislikes+=0.3')
    .to('#panel-dislikes', { opacity: 1, duration: 0.2 }, 'toDislikes')
    .to(
      '.art--dislikes',
      { opacity: 1, scale: 1, rotation: 0, duration: 1.3, ease: 'back.out(1.1)' },
      'toDislikes+=0.2'
    )
    .to({}, { duration: 0.9 });

  // E. Dislikes -> Next Stop ----------------------------------------------
  tl.addLabel('toNext')
    .to('.art--dislikes', { opacity: 0, scale: 0.9, duration: 0.7 }, 'toNext')
    .to('#panel-dislikes', { opacity: 0, duration: 0.6 }, 'toNext+=0.3')
    .to('#panel-nextstop', { opacity: 1, duration: 1.0 }, 'toNext+=0.2')
    .from('.train-display__board', { y: 50, opacity: 0, duration: 0.9, ease: 'power2.out' }, 'toNext+=0.5')
    .to({}, { duration: 1.0 });

  updateRoute(0);
}

/* -------------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------------- */

const SKETCHES = [
  '/sketches/tag.png',
  '/sketches/portrait.png',
  '/sketches/train-rush.png',
  '/sketches/shock.png',
  '/sketches/tote.png',
  '/sketches/dislikes.png',
];

startClock();

if (prefersReducedMotion) {
  // Calm fallback: a plain, top-to-bottom read with everything visible.
  document.body.classList.add('reduced-motion');
  preloadImages(SKETCHES).then(hideLoader);
} else {
  preloadImages(SKETCHES).then(() => {
    hideLoader();
    buildStory();
    // Recalculate once fonts/images have settled.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  // Safety: never leave the loader stuck if a request hangs.
  setTimeout(hideLoader, 6000);
}
