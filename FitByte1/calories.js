// Sample meal data
let meals = [];
let dailyTarget = 2000;

// Initialize charts and data
document.addEventListener('DOMContentLoaded', () => {
    updateCalorieSummary();
    initializeCaloriesChart();
    displayMeals();
});

function updateCalorieSummary() {
    const consumed = meals.reduce((total, meal) => total + meal.calories, 0);
    const burned = 400; // This should come from workout data
    const remaining = dailyTarget - consumed + burned;

    document.getElementById('dailyTarget').textContent = dailyTarget;
    document.getElementById('caloriesConsumed').textContent = consumed;
    document.getElementById('caloriesBurned').textContent = burned;
    document.getElementById('caloriesRemaining').textContent = remaining;
}

function initializeCaloriesChart() {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Calories Consumed',
                data: [1800, 2200, 1950, 2100, 1850, 2300, 2000],
                backgroundColor: 'rgba(255, 107, 107, 0.5)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function displayMeals() {
    const mealsList = document.getElementById('mealsList');
    mealsList.innerHTML = '';

    meals.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.innerHTML = `
            <div>
                <strong>${meal.name}</strong>
                <p>${meal.type} - ${meal.notes}</p>
            </div>
            <div>
                <strong>${meal.calories}</strong> calories
            </div>
        `;
        mealsList.appendChild(mealElement);
    });
}

function openMealModal() {
    document.getElementById('mealModal').style.display = 'block';
}

function closeMealModal() {
    document.getElementById('mealModal').style.display = 'none';
}

function handleMealSubmit(event) {
    event.preventDefault();
    
    const newMeal = {
        type: document.getElementById('mealType').value,
        name: document.getElementById('foodName').value,
        calories: parseInt(document.getElementById('calories').value),
        notes: document.getElementById('mealNotes').value,
        timestamp: new Date()
    };

    meals.unshift(newMeal);
    updateCalorieSummary();
    displayMeals();
    closeMealModal();
    event.target.reset();
}

// Modal Functions
function openMealModal() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeMealModal() {
    const modal = document.getElementById('mealModal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

function handleMealSubmit(event) {
    event.preventDefault();
    // Add meal logic here
    closeMealModal();
}

// Utility Functions
function editMeal(id) {
    console.log('Editing meal:', id);
    // Implement edit functionality
}

function deleteMeal(id) {
    if (confirm('Are you sure you want to delete this meal?')) {
        console.log('Deleting meal:', id);
        // Implement delete functionality
    }
}

// Event Listeners
window.onclick = function(event) {
    const modal = document.getElementById('mealModal');
    if (event.target === modal) {
        closeMealModal();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize state
    let dailyStats = {
        target: 2000,
        consumed: 0,
        burned: 0,
        remaining: 2000,
        protein: 0,
        carbs: 0,
        fats: 0
    };

    let meals = [];

    // Get DOM elements
    const addMealBtn = document.getElementById('addMealBtn');
    const mealModal = document.getElementById('mealModal');
    const addMealForm = document.getElementById('addMealForm');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Event Listeners
    addMealBtn.addEventListener('click', openMealModal);
    closeModal.addEventListener('click', closeMealModal);
    cancelBtn.addEventListener('click', closeMealModal);
    addMealForm.addEventListener('submit', handleAddMeal);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === mealModal) {
            closeMealModal();
        }
    });

    // Modal Functions
    function openMealModal() {
        mealModal.style.display = 'flex';
        setTimeout(() => mealModal.classList.add('active'), 10);
    }

    function closeMealModal() {
        mealModal.classList.remove('active');
        setTimeout(() => {
            mealModal.style.display = 'none';
            addMealForm.reset();
        }, 300);
    }

    // Handle Add Meal
    function handleAddMeal(e) {
        e.preventDefault();

        const newMeal = {
            id: Date.now(),
            name: document.getElementById('mealName').value,
            time: document.getElementById('mealTime').value,
            calories: parseInt(document.getElementById('calories').value),
            protein: parseInt(document.getElementById('protein').value),
            carbs: parseInt(document.getElementById('carbs').value),
            fats: parseInt(document.getElementById('fats').value)
        };

        meals.push(newMeal);
        updateDailyStats(newMeal);
        renderMeal(newMeal);
        updateUI();
        closeMealModal();

        // Show success notification
        showNotification('Meal added successfully!', 'success');
    }

    // Update Daily Stats
    function updateDailyStats(meal) {
        dailyStats.consumed += meal.calories;
        dailyStats.protein += meal.protein;
        dailyStats.carbs += meal.carbs;
        dailyStats.fats += meal.fats;
        dailyStats.remaining = dailyStats.target - dailyStats.consumed;
    }

    // Render Meal
    function renderMeal(meal) {
        const mealList = document.getElementById('mealList');
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.dataset.id = meal.id;

        mealElement.innerHTML = `
            <div class="meal-header">
                <h4 class="meal-name">${meal.name}</h4>
                <span class="meal-time">${formatTime(meal.time)}</span>
            </div>
            <div class="meal-macros">
                <div class="macro-item">
                    <span>Calories</span>
                    <strong>${meal.calories}</strong>
                </div>
                <div class="macro-item">
                    <span>Protein</span>
                    <strong>${meal.protein}g</strong>
                </div>
                <div class="macro-item">
                    <span>Carbs</span>
                    <strong>${meal.carbs}g</strong>
                </div>
                <div class="macro-item">
                    <span>Fats</span>
                    <strong>${meal.fats}g</strong>
                </div>
            </div>
            <div class="meal-actions">
                <button onclick="editMeal(${meal.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteMeal(${meal.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        mealList.insertBefore(mealElement, mealList.firstChild);
    }

    // Update UI
    function updateUI() {
        // Update summary cards
        document.getElementById('dailyTarget').textContent = dailyStats.target;
        document.getElementById('caloriesConsumed').textContent = dailyStats.consumed;
        document.getElementById('caloriesBurned').textContent = dailyStats.burned;
        document.getElementById('caloriesRemaining').textContent = dailyStats.remaining;

        // Update macronutrient progress
        updateMacroProgress('protein', dailyStats.protein, 150);
        updateMacroProgress('carbs', dailyStats.carbs, 250);
        updateMacroProgress('fats', dailyStats.fats, 65);
    }

    // Update Macro Progress
    function updateMacroProgress(macro, current, target) {
        const progressElement = document.querySelector(`.${macro} .progress`);
        const labelElement = document.getElementById(`${macro}Progress`);
        const percentage = (current / target) * 100;
        
        progressElement.style.width = `${Math.min(percentage, 100)}%`;
        labelElement.textContent = `${current}/${target}g`;
    }

    // Utility Functions
    function formatTime(time) {
        return new Date(`2000/01/01 ${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    }

);

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Global functions for meal actions
function editMeal(id) {
    console.log('Edit meal:', id);
    // Implement edit functionality
}

function deleteMeal(id) {
    const mealElement = document.querySelector('.meal-item[data-id="${id}"]');
    if (confirm('Are you sure you want to delete this meal?')) {
        mealElement.remove();
        // Update stats accordingly
        // Implement delete functionality
    }
} 
let dailyStats = {
    target: 2000,
    consumed: 0,
    burned: 400, // This can be dynamic later
    remaining: 2000,
    protein: 0,
    carbs: 0,
    fats: 0
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    initializeCaloriesChart();
});

function updateUI() {
    document.getElementById('dailyTarget').textContent = dailyStats.target;
    document.getElementById('caloriesConsumed').textContent = dailyStats.consumed;
    document.getElementById('caloriesBurned').textContent = dailyStats.burned;
    document.getElementById('caloriesRemaining').textContent = dailyStats.remaining;
    updateMacroProgress('protein', dailyStats.protein, 150);
    updateMacroProgress('carbs', dailyStats.carbs, 250);
    updateMacroProgress('fats', dailyStats.fats, 65);
    displayMeals();
}

function displayMeals() {
    const mealsList = document.getElementById('mealsList');
    mealsList.innerHTML = '';
    meals.forEach(meal => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.dataset.id = meal.id;
        mealElement.innerHTML = `
            <div>
                <strong>${meal.name}</strong>
                <p>${meal.time} - ${meal.notes}</p>
            </div>
            <div><strong>${meal.calories}</strong> calories</div>
            <div class="meal-actions">
                <button onclick="editMeal(${meal.id})">Edit</button>
                <button onclick="deleteMeal(${meal.id})">Delete</button>
            </div>
        `;
        mealsList.appendChild(mealElement);
    });
}

function openMealModal() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeMealModal() {
    const modal = document.getElementById('mealModal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
    document.getElementById('addMealForm').reset();
}

function handleMealSubmit(event) {
    event.preventDefault();
    const newMeal = {
        id: Date.now(),
        name: document.getElementById('mealName').value,
        time: document.getElementById('mealTime').value,
        calories: parseInt(document.getElementById('calories').value),
        protein: parseInt(document.getElementById('protein').value),
        carbs: parseInt(document.getElementById('carbs').value),
        fats: parseInt(document.getElementById('fats').value)
    };
    meals.unshift(newMeal);
    updateDailyStats(newMeal);
    updateUI();
    closeMealModal();
}

function updateDailyStats(meal) {
    dailyStats.consumed += meal.calories;
    dailyStats.protein += meal.protein;
    dailyStats.carbs += meal.carbs;
    dailyStats.fats += meal.fats;
    dailyStats.remaining = dailyStats.target - dailyStats.consumed + dailyStats.burned;
}

function deleteMeal(id) {
    meals = meals.filter(meal => meal.id !== id);
    recalculateStats();
    updateUI();
}

function recalculateStats() {
    dailyStats.consumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    dailyStats.protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    dailyStats.carbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
    dailyStats.fats = meals.reduce((sum, meal) => sum + meal.fats, 0);
    dailyStats.remaining = dailyStats.target - dailyStats.consumed + dailyStats.burned;
}

function initializeCaloriesChart() {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Calories Consumed',
                data: [1800, 2200, 1950, 2100, 1850, 2300, 2000],
                backgroundColor: 'rgba(255, 107, 107, 0.5)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
                x: { display: false }
            }
        }
    });
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        document.getElementById('bmiResult').textContent = `Your ${bmi}`;
    } else {
        alert('Please enter valid weight and height');
    }
}

// Event Listeners
document.getElementById('addMealForm').addEventListener('submit', handleMealSubmit);
document.getElementById('bmiCalculate').addEventListener('click', calculateBMI);
