// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Modal and Tab Logic
const modal = document.getElementById('register-modal');
const formPatient = document.getElementById('form-patient');
const formDonor = document.getElementById('form-donor');
const tabPatient = document.getElementById('tab-patient');
const tabDonor = document.getElementById('tab-donor');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-modal');

function openModal(type) {
    modal.classList.add('active');
    lenis.stop(); // Pause smooth scrolling
    document.body.style.overflow = 'hidden';
    
    // Switch modal close button color based on viewport setup
    closeBtn.style.color = 'var(--black)';
    switchTab(type);
}

function closeModal() {
    modal.classList.remove('active');
    lenis.start(); // Resume scrolling
    document.body.style.overflow = '';
}

function switchTab(type) {
    if (type === 'patient') {
        tabPatient.classList.add('active');
        tabPatient.classList.replace('bg-black', 'bg-white');
        tabPatient.classList.replace('text-white', 'text-black');
        tabPatient.style.border = 'none';
        
        tabDonor.classList.remove('active');
        tabDonor.classList.replace('bg-white', 'bg-black');
        tabDonor.classList.replace('text-black', 'text-white');
        tabDonor.style.border = '2px solid white';

        formPatient.style.display = 'flex';
        formDonor.style.display = 'none';
        modalTitle.innerText = "Patient Request";
    } else {
        tabDonor.classList.add('active');
        tabDonor.classList.replace('bg-black', 'bg-white');
        tabDonor.classList.replace('text-white', 'text-black');
        tabDonor.style.border = 'none';
        
        tabPatient.classList.remove('active');
        tabPatient.classList.replace('bg-white', 'bg-black');
        tabPatient.classList.replace('text-black', 'text-white');
        tabPatient.style.border = '2px solid white';

        formDonor.style.display = 'flex';
        formPatient.style.display = 'none';
        modalTitle.innerText = "Donor Registration";
    }
}

function handleFormSubmit(e, type) {
    e.preventDefault();
    const message = type === 'patient' 
        ? 'Your blood request has been prioritized. We will match you shortly!' 
        : 'Thank you for registering as a Donor. You will be contacted when matched!';
    alert(message);
    closeModal();
    e.target.reset();
}

// GSAP + Lenis ScrollTrigger Integration
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Scroll-driven animation for the Pinned Vertical Map
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: '.pin-container',
        start: 'top top',
        end: '+=2500', // Scroll distance to play animation
        scrub: 1,      // Smooth scrubbing
        pin: true      // Pin the section!
    }
});

// The line is revealed by animating the height of the SVG clipPath rect
// The clip rect height goes from 0 to 700

// Initialize Node 1
tl.to('#node-1', { stroke: '#E11D48', duration: 0.1 }, 0);

// Node 1 -> Node 2
tl.to('#clip-rect', { attr: { height: 350 }, duration: 1, ease: 'none' }, 0)
  .to('#step-1', { opacity: 0.3, duration: 0.5 }, 0.5)
  .to('#step-2', { opacity: 1, duration: 0.5 }, 0.5)
  .to('#node-2', { stroke: '#E11D48', duration: 0.2 }, 1);

// Node 2 -> Node 3
tl.to('#clip-rect', { attr: { height: 700 }, duration: 1, ease: 'none' }, 1)
  .to('#step-2', { opacity: 0.3, duration: 0.5 }, 1.5)
  .to('#step-3', { opacity: 1, duration: 0.5 }, 1.5)
  .to('#node-3', { stroke: '#E11D48', duration: 0.2 }, 2);

// Mobile Sticky CTA toggle
const mobileCta = document.getElementById('mobile-cta');
const footerCta = document.querySelector('.cta');
let isFooterVisible = false;

// Observe the footer CTA section
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        isFooterVisible = entry.isIntersecting;
        updateMobileCtaVisibility();
    });
}, { threshold: 0.1 });

if (footerCta) {
    observer.observe(footerCta);
}

function updateMobileCtaVisibility() {
    if (window.innerWidth <= 768) {
        // Show only if scrolled past 300px AND the footer CTA is not currently on screen
        if (window.scrollY > 300 && !isFooterVisible) {
            mobileCta.classList.add('visible');
        } else {
            mobileCta.classList.remove('visible');
        }
    }
}

window.addEventListener('scroll', updateMobileCtaVisibility);

// Hamburger menu logic
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburgerBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}
