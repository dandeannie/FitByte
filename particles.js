document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let hue = 0;

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse position
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${hue}, 100%, 50%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x != undefined && mouse.y != undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.speedX -= dx * force * 0.02;
                    this.speedY -= dy * force * 0.02;
                }
            }

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

            // Shrink particles
            if (this.size > 0.2) this.size -= 0.1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    function init() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Handle particles
    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Connect particles
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = particlesArray[i].color;
                    ctx.lineWidth = 0.2;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }

            // Remove small particles
            if (particlesArray[i].size <= 0.3) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }

    // Add particles on mouse move
    window.addEventListener('mousemove', function() {
        for (let i = 0; i < 2; i++) {
            particlesArray.push(new Particle());
        }
    });

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        hue += 0.5;
        requestAnimationFrame(animate);

        // Keep particle count in check
        if (particlesArray.length > 200) {
            particlesArray.splice(0, 50);
        }
    }

    init();
    animate();
}); 