function calculateBMI(weightId, heightId, resultId, categoryId) {
    let weight = document.getElementById(weightId).value;
    let height = document.getElementById(heightId).value / 100;

    if (weight > 0 && height > 0) {
        let bmi = (weight / (height * height)).toFixed(2);
        document.getElementById(resultId).textContent = bmi;
        document.getElementById(resultId).classList.add("bmi-result");

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
        else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
        else category = 'Obese';

        document.getElementById(categoryId).textContent = `Category: ${category}`;
        document.getElementById(categoryId).classList.add("bmi-category");
    } else {
        alert('Please enter valid weight and height values.');
    }
}

function toggleModal(show) {
    const modal = document.getElementById("bmiModal");
    if (show) {
        modal.classList.add("show");
        modal.style.display = "block";
    } else {
        modal.classList.remove("show");
        setTimeout(() => (modal.style.display = "none"), 300);
    }
}

document.querySelector(".close-modal").addEventListener("click", () => toggleModal(false));
document.querySelector(".cancel-btn").addEventListener("click", () => toggleModal(false));
