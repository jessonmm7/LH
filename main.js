class SequencePlayer {
    constructor(containerId, folderPath, frameCount, extension = 'jpg') {
        this.container = document.getElementById(containerId);
        this.folderPath = folderPath;
        this.frameCount = frameCount;
        this.extension = extension;
        this.frames = [];
        this.currentFrame = 0;
        this.init();
    }

    init() {
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            const frameNum = String(i).padStart(3, '0');
            img.src = `${this.folderPath}/ezgif-frame-${frameNum}.${this.extension}`;
            img.className = 'sequence-frame';
            if (i === 1) img.classList.add('active');
            this.container.appendChild(img);
            this.frames.push(img);
        }
        this.start();
    }

    start() {
        setInterval(() => {
            this.frames[this.currentFrame].classList.remove('active');
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frames[this.currentFrame].classList.add('active');
        }, 60); // ~16fps for a mechanical look
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    // Initialize Sequences
    const heroSeq = new SequencePlayer('hero-sequence', './vidtoim/abc4', 26);
    const thirdSeq = new SequencePlayer('second-sequence', './vidtoim/abc5', 26);

    // Gallery Video Sequences
    const gallerySeq1 = new SequencePlayer('gallery-seq-1', './vidtoim/abc', 24);
    const gallerySeq2 = new SequencePlayer('gallery-seq-2', './vidtoim/abc1', 24);
    const gallerySeq3 = new SequencePlayer('gallery-seq-3', './vidtoim/abc2', 24);
    const gallerySeq4 = new SequencePlayer('gallery-seq-4', './vidtoim/abc3', 24);
    const gallerySeq5 = new SequencePlayer('gallery-seq-5', './vidtoim/abc4', 26);
    const gallerySeq6 = new SequencePlayer('gallery-seq-6', './vidtoim/abc5', 26);

    // Counter Animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            counter.classList.add('animated');

            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smoother feel (easeOutExpo)
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(easedProgress * target);

                counter.innerText = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(update);
        });
    };

    // Reveal Animations & Counter Trigger
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.id === 'stats-section') {
                    animateCounters();
                }
            } else {
                // Reset stats animation state when leaving viewport
                if (entry.target.id === 'stats-section') {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        counter.classList.remove('animated');
                        counter.innerText = '0';
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, #stats-section').forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
