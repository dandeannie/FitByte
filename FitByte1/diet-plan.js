document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generatePlanBtn");
    const saveBtn = document.getElementById("savePlanBtn");
    const dietTypeSelect = document.getElementById("dietType");
    const calorieGoalInput = document.getElementById("calorieGoal");
    const dietPlanContainer = document.getElementById("dietPlanContainer");
    const recipeList = document.getElementById("recipeList");

    if (!generateBtn || !saveBtn || !dietTypeSelect || !calorieGoalInput || !dietPlanContainer || !recipeList) {
        console.error("Error: One or more elements are missing in the DOM.");
        return;
    }

    // Your Spoonacular API Key (Replace with your own key)
    const API_KEY = "81e337e05e0f44188b1ed3cc9c70ae3c";  
    const API_URL = "https://api.spoonacular.com/recipes/complexSearch";

    // Load saved diet plan from local storage
    function loadSavedDietPlan() {
        const savedPlan = localStorage.getItem("dietPlan");
        if (savedPlan) {
            dietPlanContainer.innerHTML = savedPlan;
            saveBtn.style.display = "block";
        }

        const savedRecipes = localStorage.getItem("recipeList");
        if (savedRecipes) {
            recipeList.innerHTML = savedRecipes;
        }
    }

    loadSavedDietPlan(); // Load previous diet plan if available

    // Fetch recipes from API
    async function fetchRecipes(dietType) {
        try {
            const response = await fetch(`${API_URL}?diet=${dietType}&number=5&apiKey=${API_KEY}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                let recipeHTML = `<h3>Recipe Suggestions</h3><ul>`;
                data.results.forEach(recipe => {
                    recipeHTML += `<li>
                        <a href="${recipe.sourceUrl}" target="_blank">${recipe.title}</a>
                    </li>`;
                });
                recipeHTML += `</ul>`;
                recipeList.innerHTML = recipeHTML;
            } else {
                recipeList.innerHTML = `<p>No recipes found for this diet type.</p>`;
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeList.innerHTML = `<p>Could not fetch recipes. Try again later.</p>`;
        }
    }

    // Generate Diet Plan
    generateBtn.addEventListener("click", function () {
        const dietType = dietTypeSelect.value;
        const calorieGoal = parseInt(calorieGoalInput.value);

        if (isNaN(calorieGoal) || calorieGoal < 1000 || calorieGoal > 5000) {
            alert("Please enter a valid calorie goal between 1000 and 5000.");
            return;
        }

        // Display diet plan
        let planHTML = `<h3>Your Diet Plan (${dietType.toUpperCase()})</h3>
                        <p>Calorie Goal: ${calorieGoal} kcal</p>
                        <p>Choose a balanced meal plan based on your diet type.</p>`;
        dietPlanContainer.innerHTML = planHTML;

        // Fetch recipes dynamically
        fetchRecipes(dietType);

        // Show save button
        saveBtn.style.display = "block";
    });

    // Save Diet Plan
    saveBtn.addEventListener("click", function () {
        localStorage.setItem("dietPlan", dietPlanContainer.innerHTML);
        localStorage.setItem("recipeList", recipeList.innerHTML);
        alert("Diet plan saved successfully!");
    });
});