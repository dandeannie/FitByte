document.addEventListener("DOMContentLoaded", function () {
    function calculateBMI(weightId, heightId, resultId, categoryId) {
        let weight = parseFloat(document.getElementById(weightId).value);
        let height = parseFloat(document.getElementById(heightId).value) / 100; // Convert cm to meters

        if (weight > 0 && height > 0) {
            let bmi = weight / (height * height);
            document.getElementById(resultId).innerText = bmi.toFixed(2);
            document.getElementById(categoryId).innerText = getBMICategory(bmi);
        } else {
            document.getElementById(resultId).innerText = "-";
            document.getElementById(categoryId).innerText = "Please enter valid values!";
        }
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
        if (bmi >= 25 && bmi < 29.9) return "Overweight";
        return "Obese";
    }

    function toggleModal(show) {
        document.getElementById("bmiModal").style.display = show ? "block" : "none";
    }

    window.calculateBMI = calculateBMI;
    window.toggleModal = toggleModal;
});