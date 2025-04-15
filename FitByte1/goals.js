// Sample goals data
let goals = [
    {
        id: 1,
        type: 'Weight Loss',
        target: '70kg',
        current: '75kg',
        deadline: '2024-06-01',
        progress: 50,
        description: 'Reach target weight through consistent exercise and diet',
        status: 'active',
        startDate: '2024-01-01',
        milestones: [
            { value: '77kg', date: '2024-02-01', achieved: true },
            { value: '75kg', date: '2024-03-01', achieved: true },
            { value: '73kg', date: '2024-04-01', achieved: false },
            { value: '70kg', date: '2024-06-01', achieved: false }
        ]
    },
    {
        id: 2,
        type: 'Workout Frequency',
        target: '5 sessions/week',
        current: '3 sessions/week',
        deadline: '2024-04-01',
        progress: 60,
        description: 'Establish consistent workout routine',
        status: 'active',
        startDate: '2024-01-15'
    },
    {
        id: 3,
        type: 'Running Distance',
        target: '10km',
        current: '7km',
        deadline: '2024-05-01',
        progress: 70,
        description: 'Improve running endurance',
        status: 'active',
        startDate: '2024-02-01'
    }
];

// Ensure DOM is fully loaded before running functions
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(displayGoals, 500); // Ensure elements exist before running

    // Ensure goalsChart exists before initializing
    if (document.getElementById('goalsChart')) {
        initializeGoalsChart();
    }

    // Add event listener for opening modal
    const addGoalBtn = document.querySelector('.add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', openGoalModal);
    } else {
        console.warn("Warning: .add-goal-btn not found.");
    }

    const goalForm = document.getElementById('goalForm');
    const goalsContainer = document.getElementById('goalsContainer');

    // Load existing goals from local storage if available
    if (localStorage.getItem('goals')) {
        goals = JSON.parse(localStorage.getItem('goals'));
        displayGoals();
    }

    // Handle goal submission
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const goalName = document.getElementById('goalName').value;
            const goalTarget = document.getElementById('goalTarget').value || "N/A";
            const goalCurrent = document.getElementById('goalCurrent').value || "N/A";
            const goalUnit = document.getElementById('goalUnit').value || "";

            const newGoal = { 
                id: Date.now(), 
                type: goalName, 
                target: goalTarget, 
                current: goalCurrent, 
                unit: goalUnit, 
                progress: 0, 
                status: 'active',
                description: 'New goal added'
            };

            goals.push(newGoal); 
            localStorage.setItem('goals', JSON.stringify(goals));

            displayGoals();
            goalForm.reset();
            closeGoalModal();
        });
    }
});

// Display all goals
function displayGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    if (!goalsContainer) {
        console.error("Error: #goalsContainer not found.");
        return;
    }
    
    goalsContainer.innerHTML = '';

    goals.forEach(goal => {
        const goalElement = createGoalCard(goal);
        goalsContainer.appendChild(goalElement);
    });
}

// Create Goal Cards
function createGoalCard(goal) {
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
        <div class="goal-status ${goal.status}">
            <i class="fas fa-circle"></i> ${capitalizeFirst(goal.status)}
        </div>
        <div class="goal-header">
            <div class="goal-type">
                <i class="fas ${getGoalIcon(goal.type)}"></i>
                <h3>${goal.type}</h3>
            </div>
            <div class="goal-progress">
                <svg class="progress-ring" width="60" height="60">
                    <circle class="progress-ring-circle-bg" cx="30" cy="30" r="25"/>
                    <circle class="progress-ring-circle" cx="30" cy="30" r="25"
                            style="stroke-dashoffset: ${calculateStrokeDashoffset(goal.progress)}"/>
                    <text x="30" y="30" class="progress-text">${goal.progress}%</text>
                </svg>
            </div>
        </div>
        <div class="goal-body">
            <p class="goal-description">${goal.description}</p>
        </div>
        <div class="goal-footer">
            <button onclick="editGoal(${goal.id})" class="action-btn edit">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteGoal(${goal.id})" class="action-btn delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return card;
}

// Initialize Goals Chart
function initializeGoalsChart() {
    const ctx = document.getElementById('goalsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Weight Loss', 'Workout Frequency', 'Running Distance'],
            datasets: [{
                label: 'Progress',
                data: [50, 60, 70],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Open Goal Modal
function openGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Error: #goalModal element not found.");
    }
}

// Close Goal Modal
function closeGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Error: #goalModal element not found.");
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('goalModal');
    if (event.target === modal) {
        closeGoalModal();
    }
};

// Edit Goal
function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (!goal) {
        console.error("Error: Goal not found.");
        return;
    }

    document.getElementById('goalName').value = goal.type;
    document.getElementById('goalTarget').value = goal.target;
    document.getElementById('goalCurrent').value = goal.current;
    document.getElementById('goalUnit').value = goal.unit;

    openGoalModal();
}

// Delete Goal
function deleteGoal(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        goals = goals.filter(goal => goal.id !== id);
        localStorage.setItem('goals', JSON.stringify(goals));
        displayGoals();
    }
}

// Utility Functions
function getGoalIcon(type) {
    const icons = {
        'Weight Loss': 'fa-weight-scale',
        'Workout Frequency': 'fa-dumbbell',
        'Running Distance': 'fa-running'
    };
    return icons[type] || 'fa-bullseye';
}

function calculateStrokeDashoffset(progress) {
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    return circumference - (progress / 100) * circumference;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
