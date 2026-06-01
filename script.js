/**
 * Project: Konikoni Escape System V2.6
 * Target: Eyo Mercy B.
 * Author: Semako
 */

// UI Variables
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('next-btn');
const controlsArea = document.getElementById('controls-area');
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const sandboxZone = document.getElementById('sandbox-zone');

let currentSlideIndex = 0;

// Native Web Audio API Sound FX Generator
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'next') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'dodge') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
    } else if (type === 'victory') {
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g);
            g.connect(audioCtx.destination);
            o.type = 'square';
            o.frequency.setValueAtTime(freq, now + index * 0.08);
            g.gain.setValueAtTime(0.08, now + index * 0.08);
            g.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.2);
            o.start(now + index * 0.08);
            o.stop(now + index * 0.08 + 0.2);
        });
    }
}

// Slide Carousel Controller Logic
function updateSlidePosition() {
    slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
            slide.classList.remove('hidden', 'opacity-0');
            slide.classList.add('block', 'opacity-100');
        } else {
            slide.classList.remove('block', 'opacity-100');
            slide.classList.add('hidden', 'opacity-0');
        }
    });

    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.add('bg-cyberPink', 'w-6');
            dot.classList.remove('bg-white/20', 'w-2');
        } else {
            dot.classList.remove('bg-cyberPink', 'w-6');
            dot.classList.add('bg-white/20', 'w-2');
        }
    });

    if (currentSlideIndex === slides.length - 1) {
        controlsArea.classList.add('hidden');
        // Initialize smart absolute positions inside the layout container safely
        initialButtonSetup();
    }
}

nextBtn.addEventListener('click', () => {
    playSound('next');
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updateSlidePosition();
    }
});

// Auto-Display Slide Loop
let autoSlideInterval = setInterval(() => {
    if (currentSlideIndex < slides.length - 2) { 
        currentSlideIndex++;
        updateSlidePosition();
    } else {
        clearInterval(autoSlideInterval);
    }
}, 8500);

nextBtn.addEventListener('click', () => clearInterval(autoSlideInterval));

/* 
 * Hardened Smart Boundary Position Calculations
 */
function initialButtonSetup() {
    // Places No button cleanly under or next to Yes without overlapping initially
    if (window.innerWidth < 640) {
        btnNo.style.bottom = "16px";
        btnNo.style.left = "50%";
        btnNo.style.transform = "translateX(-50%)";
    } else {
        btnNo.style.top = "50%";
        btnNo.style.right = "40px";
        btnNo.style.transform = "translateY(-50%)";
    }
}

function dodgeButton(e) {
    e.preventDefault();
    playSound('dodge');
    
    // Read exact parent containers structural limits dynamically
    const containerRect = sandboxZone.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    
    // Keep calculations strictly contained within bounds minus margins
    const maxX = containerRect.width - btnRect.width - 24;
    const maxY = containerRect.height - btnRect.height - 24;
    
    const randomX = Math.max(12, Math.random() * maxX);
    const randomY = Math.max(12, Math.random() * maxY);
    
    // Apply layout breaking corrections
    btnNo.style.top = `${randomY}px`;
    btnNo.style.left = `${randomX}px`;
    btnNo.style.right = 'auto';
    btnNo.style.bottom = 'auto';
    btnNo.style.transform = 'none';
}

// Double event security layers
btnNo.addEventListener('mouseenter', dodgeButton);
btnNo.addEventListener('touchstart', dodgeButton);
btnNo.addEventListener('click', (e) => e.preventDefault());

// The Confetti Explosion Engine
btnYes.addEventListener('click', () => {
    playSound('victory');
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff007f', '#00f0ff', '#ffffff'] }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff007f', '#00f0ff', '#ffffff'] }));
    }, 250);

    setTimeout(() => {
        const wrapper = document.getElementById('slides-wrapper');
        wrapper.innerHTML = `
            <div class="w-full text-center py-10 px-4">
                <span class="text-4xl animate-bounce inline-block">🚀</span>
                <h2 class="text-2xl md:text-3xl font-bold mt-4 text-white tracking-tight">System Overload: Success!</h2>
                <p class="mt-4 text-slate-300 text-sm md:text-lg max-w-sm mx-auto leading-relaxed">
                    The Konikoni firmware has been successfully uninstalled from <strong>Eyo Mercy B.</strong>
                </p>
                <p class="mt-4 text-cyberPink font-bold tracking-wide text-base uppercase animate-pulse">
                    Semako wins. See you on WhatsApp. 🤍
                </p>
            </div>
        `;
    }, 1000);
});