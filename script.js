const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let motionOff = reducedMotion.matches;
function setMotionState() {
  document.documentElement.classList.toggle('motion-off', motionOff);
  motionButton.setAttribute('aria-pressed', String(motionOff));
  motionButton.querySelector('span').textContent = motionOff ? 'off' : 'on';
  motionButton.title = motionOff ? 'Enable decorative animations' : 'Pause decorative animations';
  if (window.gsap) gsap.globalTimeline.paused(motionOff);
}
setMotionState();
motionButton.addEventListener('click', () => { motionOff = !motionOff; setMotionState(); });
reducedMotion.addEventListener('change', event => { motionOff = event.matches; setMotionState(); });
if (window.gsap && !motionOff) {
  gsap.from('.hero .eyebrow, h1 .line, .hero-bottom .intro', {y:28, opacity:0, duration:.9, stagger:.12, ease:'power3.out'});
  gsap.from('.system-board', {y:25, opacity:0, duration:1, delay:.5, ease:'power3.out'});
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionOff) gsap.fromTo(entry.target, {y:25, opacity:0}, {y:0, opacity:1, duration:.8, ease:'power3.out'});
      observer.unobserve(entry.target);
    });
  }, {threshold:.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const journeyBoard = document.querySelector('.journey-board');
let chapter = 0;
let journeyVisible = false;
new IntersectionObserver(entries => { journeyVisible = entries[0].isIntersecting; }, {threshold: 0.2}).observe(journeyBoard);
setInterval(() => {
  if (motionOff || document.hidden || !journeyVisible) return;
  chapter = (chapter + 1) % 3;
  journeyBoard.dataset.chapter = chapter;
}, 4000);
