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
const modalTitle = document.getElementById('modal-title');
const modalSub = document.getElementById('modal-sub');
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
        formPatient.style.display = 'flex';
        formDonor.style.display = 'none';
        modalTitle.innerText = "Patient Request";
        if (modalSub) modalSub.innerText = "No traffic. No syndicates. Priority treatment.";
    } else {
        formDonor.style.display = 'flex';
        formPatient.style.display = 'none';
        modalTitle.innerText = "Donor Registration";
        if (modalSub) modalSub.innerText = "Join Dhaka's premier life-saving logistics network. Zero obligation, total privacy.";
    }
}

function toggleConditionalFields() {
    const occupation = document.querySelector('input[name="occupation"]:checked')?.value;
    const institutionGroup = document.getElementById('institution-group');
    const institutionInput = document.getElementById('donor-institution');
    
    if (occupation === 'Student') {
        institutionGroup.style.display = 'flex';
        institutionInput.required = true;
    } else {
        institutionGroup.style.display = 'none';
        institutionInput.required = false;
        institutionInput.value = '';
    }

    const donatedBefore = document.querySelector('input[name="donatedBefore"]:checked')?.value;
    const lastDonationGroup = document.getElementById('last-donation-group');
    const lastDonationInput = document.getElementById('donor-last-date');
    
    if (donatedBefore === 'Yes') {
        lastDonationGroup.style.display = 'flex';
        lastDonationInput.required = true;
    } else {
        lastDonationGroup.style.display = 'none';
        lastDonationInput.required = false;
        lastDonationInput.value = '';
    }
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybHfnNArJdvi-bQfbZFNjbiU6PG9KHQfcG4Nw9FfhAFpVcWeSINKeSLTqzaS4vep6X/exec';

async function handleFormSubmit(e, type) {
    e.preventDefault();
    
    if (type === 'patient') {
        alert('Patient request feature is being optimized. Please call the hotline.');
        return;
    }
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show Loading State
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> REGISTERING...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';

    try {
        const formData = new FormData(form);
        
        // Handle multiple checkboxes for contact method
        const contactMethods = Array.from(formData.getAll('contactMethod')).join(', ');
        formData.set('contactMethod', contactMethods);
        
        // Format Phone Numbers to prevent Google Sheets from stripping leading zeros
        const formatPhone = (num) => {
            if (!num) return num;
            let cleaned = num.replace(/\D/g, ''); // remove non-digits
            if (cleaned.startsWith('880')) cleaned = '+' + cleaned;
            else if (cleaned.startsWith('01')) cleaned = '+88' + cleaned;
            else if (cleaned.startsWith('1')) cleaned = '+880' + cleaned;
            
            // Prepend single quote so Google Sheets treats it as plain text and doesn't strip the + or 0
            return "'" + cleaned;
        };

        if (formData.get('mobile')) formData.set('mobile', formatPhone(formData.get('mobile')));
        if (formData.get('whatsapp')) formData.set('whatsapp', formatPhone(formData.get('whatsapp')));
        if (formData.get('emergencyMobile')) formData.set('emergencyMobile', formatPhone(formData.get('emergencyMobile')));
        
        // Convert to URLSearchParams for seamless Google Apps Script parsing
        const formBody = new URLSearchParams(formData).toString();
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const result = await response.json();
        
        if (result.result === 'success') {
            alert(`🎉 Registration Successful!\n\nYour unique BloodRide Donor ID is: ${result.donorId}\n\nPlease save this ID. We will contact you when a matching patient is found!`);
            closeModal();
            form.reset();
        } else {
            alert('Something went wrong on the server. Please try again.');
        }
    } catch (error) {
        console.error('Error!', error.message);
        alert('Network error. Please check your connection and try again.');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// GSAP + Lenis ScrollTrigger Integration
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);



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
