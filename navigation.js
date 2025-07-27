function initializeNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hide all sections except dashboard initially
    sections.forEach(section => {
        if (section.id !== 'dashboard') {
            section.style.display = 'none';
        }
    });

    // Add click handlers to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section, hide others
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                    // Trigger animation
                    section.classList.add('fade-in');
                    setTimeout(() => section.classList.remove('fade-in'), 500);
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
} 