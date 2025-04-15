document.addEventListener('DOMContentLoaded', () => {
    // Create scroll indicators
    createScrollIndicators();
    
    // Update active section on scroll
    const sections = document.querySelectorAll('.section');
    const dots = document.querySelectorAll('.scroll-dot');
    
    // Update navigation on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        // Update active dot
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.section === current) {
                dot.classList.add('active');
            }
        });

        // Update URL without reload
        history.replaceState(null, null, `#${current}`);
    });
});

function createScrollIndicators() {
    const sections = document.querySelectorAll('.section');
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    
    sections.forEach(section => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.dataset.section = section.id;
        
        dot.addEventListener('click', () => {
            document.getElementById(section.id).scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        indicator.appendChild(dot);
    });
    
    document.body.appendChild(indicator);
}

// Detect scroll direction and handle section changes
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        handleScrollDown();
    } else {
        // Scrolling up
        handleScrollUp();
    }
    
    lastScroll = currentScroll;
});

function handleScrollDown() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function handleScrollUp() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom >= window.innerHeight / 2 && rect.bottom <= window.innerHeight) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
} 