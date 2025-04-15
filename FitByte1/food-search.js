document.addEventListener('DOMContentLoaded', function() {
    // Food database (example - you can replace with API)
    const foodDatabase = [
        { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
        { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fats: 1.8 },
        { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fats: 13 },
        { name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fats: 0 },
        { name: 'Greek Yogurt', calories: 130, protein: 12, carbs: 9, fats: 4 },
        // Add more foods as needed
    ];

    // Meal templates
    let mealTemplates = [
        {
            name: 'Post-Workout Meal',
            foods: [
                { name: 'Chicken Breast', quantity: 1 },
                { name: 'Brown Rice', quantity: 1 },
                { name: 'Sweet Potato', quantity: 1 }
            ]
        },
        {
            name: 'Protein Breakfast',
            foods: [
                { name: 'Greek Yogurt', quantity: 1 },
                { name: 'Protein Powder', quantity: 1 }
            ]
        }
    ];

    // Get DOM elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('foodSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const templatesList = document.getElementById('templatesList');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');

    // Event Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', () => handleSearch());
    saveTemplateBtn.addEventListener('click', saveAsTemplate);

    // Tab Switching
    function switchTab(tabName) {
        // Update active tab button
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        if (tabName === 'manual') {
            document.getElementById('addMealForm').style.display = 'block';
        } else if (tabName === 'search') {
            document.querySelector('.search-container').style.display = 'block';
        } else if (tabName === 'templates') {
            document.querySelector('.templates-container').style.display = 'block';
            renderTemplates();
        }
    }

    // Search Functionality
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        const results = foodDatabase.filter(food => 
            food.name.toLowerCase().includes(query)
        );

        renderSearchResults(results);
    }

    function renderSearchResults(results) {
        searchResults.innerHTML = results.map(food => `
            <div class="search-result-item" onclick="selectFood(${JSON.stringify(food).replace(/"/g, '&quot;')})">
                <div class="food-info">
                    <h4>${food.name}</h4>
                    <span>${food.calories} calories</span>
                </div>
                <div class="macro-info">
                    <span>P: ${food.protein}g</span>
                    <span>C: ${food.carbs}g</span>
                    <span>F: ${food.fats}g</span>
                </div>
            </div>
        `).join('');
    }

    // Template Functionality
    function renderTemplates() {
        templatesList.innerHTML = mealTemplates.map((template, index) => `
            <div class="template-item">
                <div class="template-header">
                    <h4>${template.name}</h4>
                    <button onclick="deleteTemplate(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="template-foods">
                    ${template.foods.map(food => `
                        <div class="template-food">
                            <span>${food.name}</span>
                            <span>x${food.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="use-template-btn" onclick="useTemplate(${index})">
                    Use Template
                </button>
            </div>
        `).join('');
    }

    function saveAsTemplate() {
        const name = prompt('Enter template name:');
        if (!name) return;

        const currentFoods = getCurrentMealFoods();
        mealTemplates.push({ name, foods: currentFoods });
        showNotification('Template saved successfully!', 'success');
        renderTemplates();
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Expose functions globally
    window.selectFood = function(food) {
        // Fill form with selected food
        document.getElementById('mealName').value = food.name;
        document.getElementById('calories').value = food.calories;
        document.getElementById('protein').value = food.protein;
        document.getElementById('carbs').value = food.carbs;
        document.getElementById('fats').value = food.fats;
        
        // Switch back to manual tab
        switchTab('manual');
    };

    window.useTemplate = function(index) {
        const template = mealTemplates[index];
        // Implement template usage logic
        showNotification(`Using template: ${template.name}`, 'info');
    };

    window.deleteTemplate = function(index) {
        if (confirm('Delete this template?')) {
            mealTemplates.splice(index, 1);
            renderTemplates();
            showNotification('Template deleted', 'success');
        }
    };
}); 