// Function to fetch user data from your backend
async function fetchUserStats() {
    try {
        // Replace this URL with your actual API endpoint
        const response = await fetch('/api/user/stats');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        // Show fallback data or error message
        updateDashboard({
            totalWorkouts: 0,
            caloriesBurned: 0,
            activeGoals: 0,
            progress: 0
        });
    }
}

// Function to update the dashboard with animated counters
function updateDashboard(data) {
    animateCounter('totalWorkouts', data.totalWorkouts);
    animateCounter('caloriesBurned', data.caloriesBurned);
    animateCounter('activeGoals', data.activeGoals);
    animateCounter('progress', data.progress, '%');
}

// Animate counter function
function animateCounter(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    const duration = 1000; // Animation duration in milliseconds
    const steps = 60; // Number of steps in animation
    const stepDuration = duration / steps;
    
    let currentValue = 0;
    const increment = targetValue / steps;
    
    const animation = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(animation);
        }
        
        // Format the number based on type
        let displayValue;
        if (elementId === 'caloriesBurned') {
            displayValue = Math.round(currentValue).toLocaleString();
        } else {
            displayValue = Math.round(currentValue);
        }
        
        element.textContent = displayValue + suffix;
    }, stepDuration);
}

// Mock data for testing (remove this in production)
function getMockData() {
    return {
        totalWorkouts: 24,
        caloriesBurned: 2345,
        activeGoals: 3,
        progress: 75
    };
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics with animation
    animateStatistics();
    initializeChart();

    // Handle navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // For testing, use mock data
    updateDashboard(getMockData());
    
    // In production, use this instead:
    // fetchUserStats();
    
    // Refresh stats every 5 minutes
    setInterval(() => {
        // fetchUserStats();
        updateDashboard(getMockData()); // Remove this in production
    }, 300000);
});

// Animate statistics
function animateStatistics() {
    const stats = {
        totalWorkouts: { target: 24, current: 0 },
        caloriesBurned: { target: 2345, current: 0 },
        activeGoals: { target: 3, current: 0 },
        progress: { target: 75, current: 0 }
    };

    for (let stat in stats) {
        animateValue(stat, stats[stat].current, stats[stat].target);
    }
}

function animateValue(id, start, end) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const stepSize = (end - start) / steps;
    let current = start;
    let step = 0;

    const timer = setInterval(function() {
        step++;
        current += stepSize;
        
        if (id === 'progress') {
            document.getElementById(id).textContent = Math.round(current) + '%';
        } else if (id === 'caloriesBurned') {
            document.getElementById(id).textContent = Math.round(current).toLocaleString();
        } else {
            document.getElementById(id).textContent = Math.round(current);
        }

        if (step >= steps) {
            clearInterval(timer);
            // Set final value to ensure accuracy
            if (id === 'progress') {
                document.getElementById(id).textContent = end + '%';
            } else if (id === 'caloriesBurned') {
                document.getElementById(id).textContent = end.toLocaleString();
            } else {
                document.getElementById(id).textContent = end;
            }
        }
    }, stepDuration);
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
    gradientFill.addColorStop(1, 'rgba(79, 70, 229, 0)');

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Activity',
            data: [65, 59, 80, 81, 56, 55, 70],
            fill: true,
            backgroundColor: gradientFill,
            borderColor: '#4F46E5',
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4F46E5'
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

// Handle scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.section').forEach((section) => {
    observer.observe(section);
}); 