// Sample workout data (replace with actual data from your backend)
let workouts = [
    {
        id: 1,
        type: 'cardio',
        duration: 45,
        calories: 400,
        date: '2024-02-20',
        notes: 'Morning run - felt great!'
    },
    {
        id: 2,
        type: 'strength',
        duration: 60,
        calories: 300,
        date: '2024-02-19',
        notes: 'Upper body workout, increased weights'
    }
];

// Function to display workouts
function displayWorkouts() {
    const workoutsList = document.getElementById('workoutsList');
    workoutsList.innerHTML = '';

    workouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        workoutCard.innerHTML = `
            <div class="workout-header">
                <h3>${workout.type.toUpperCase()}</h3>
                <button class="delete-workout-btn" onclick="deleteWorkout(${workout.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="workout-stats">
                <div class="stat">
                    <span>Duration</span>
                    <strong>${workout.duration} min</strong>
                </div>
                <div class="stat">
                    <span>Calories</span>
                    <strong>${workout.calories}</strong>
                </div>
            </div>
            <div class="workout-notes">
                <p>${workout.notes}</p>
                <small>${formatDate(workout.date)}</small>
            </div>
        `;
        workoutsList.appendChild(workoutCard);
    });
}

// Function to open the workout modal
function openWorkoutModal() {
    const modal = document.getElementById('workoutModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close the workout modal
function closeWorkoutModal() {
    const modal = document.getElementById('workoutModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Handle form submission
function handleWorkoutSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const type = document.getElementById('workoutType').value;
    const duration = parseInt(document.getElementById('duration').value);
    const calories = parseInt(document.getElementById('calories').value);
    const notes = document.getElementById('notes').value;
    
    // Validate inputs
    if (!type || !duration || !calories) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create new workout object
    const newWorkout = {
        id: workouts.length + 1,
        type: type,
        duration: duration,
        calories: calories,
        date: new Date().toISOString().split('T')[0],
        notes: notes
    };
    
    // Add to workouts array
    workouts.unshift(newWorkout);
    
    // Update display
    displayWorkouts();
    
    // Reset form and close modal
    document.getElementById('workoutForm').reset();
    closeWorkoutModal();
}

// Utility functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for "Add New Workout" button
    const addWorkoutBtn = document.querySelector('.add-workout-btn');
    if (addWorkoutBtn) {
        addWorkoutBtn.addEventListener('click', openWorkoutModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('workoutModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeWorkoutModal();
        }
    });
    
    // Initialize workouts display
    displayWorkouts();
    initializeWorkoutChart();
});

function initializeWorkoutChart() {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Calories Burned',
                data: [320, 280, 200, 350, 400, 250, 300],
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1, // FIXED PROPERTY
            }]
        },
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
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

function addWorkoutToList(workout) {
    const workoutsList = document.getElementById('workoutsList');
    const workoutCard = document.createElement('div');
    workoutCard.className = 'workout-card';
    
    workoutCard.innerHTML = `
        <div class="workout-header">
            <div class="workout-type ${workout.type.toLowerCase()}">
                <i class="fas ${getWorkoutIcon(workout.type)}"></i>
                <h3>${capitalizeFirstLetter(workout.type)}</h3>
            </div>
            <span class="workout-date">${formatDate(workout.date)}</span>
        </div>
        <div class="workout-body">
            <div class="workout-stats">
                <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>${workout.duration} mins</span>
                </div>
                <div class="stat">
                    <i class="fas fa-fire"></i>
                    <span>${workout.calories} cal</span>
                </div>
            </div>
            ${workout.notes ? `<div class="workout-notes"><p>${workout.notes}</p></div>` : ''}
        </div>
        <div class="workout-actions">
            <button class="edit-btn" onclick="editWorkout(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="deleteWorkout(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    workoutsList.insertBefore(workoutCard, workoutsList.firstChild);
}

function getWorkoutIcon(type) {
    const icons = {
        'strength': 'fa-dumbbell',
        'cardio': 'fa-running',
        'hiit': 'fa-bolt',
        'yoga': 'fa-om',
        'other': 'fa-star'
    };
    return icons[type.toLowerCase()] || 'fa-star'; // FIXED ICON MATCHING
}

function editWorkout(btn) {
    const workoutCard = btn.closest('.workout-card');
    console.log('Edit workout:', workoutCard);
}

function deleteWorkout(id) {
    if (confirm('Are you sure you want to delete this workout?')) {
        workouts = workouts.filter(workout => workout.id !== id);
        displayWorkouts();
    }
}

function initializeChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Check if a chart already exists and destroy it
    if (window.progressChart) {
        window.progressChart.destroy();
    }

    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
            datasets: [
                {
                    label: "Weight",
                    data: [80, 79, 78, 77, 76, 75],
                    borderColor: "#ff4d4d",
                    tension: 0.4,
                    borderWidth: 2, // FIXED PROPERTY
                    fill: false
                },
                {
                    label: "Workouts",
                    data: [3, 4, 5, 4, 5, 6],
                    borderColor: "#ff8533",
                    tension: 0.4,
                    borderWidth: 2, // FIXED PROPERTY
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
