document.addEventListener("DOMContentLoaded", function () {
    const selectedIngredients = []; // Масив за съхранение на избраните съставки
    const ingredientCheckboxes = document.querySelectorAll('.customized_burger input[type="checkbox"]');
    const checkoutSummary = document.querySelector("#order-summary"); // Секцията за избора в Checkout
    const ingredientsInput = document.querySelector("#ingredients-input"); // Скрита стойност във формата

    // Обработчик на събития за checkbox-овете
    ingredientCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const ingredient = checkbox.nextElementSibling.alt; // Вземане на името на съставката от alt атрибута
            if (checkbox.checked) {
                selectedIngredients.push(ingredient); // Добавяне на съставката в списъка
            } else {
                const index = selectedIngredients.indexOf(ingredient);
                if (index > -1) {
                    selectedIngredients.splice(index, 1); // Премахване на съставката от списъка
                }
            }
            updateCheckoutSummary(selectedIngredients); // Обновяване на Checkout секцията
        });
    });

    // Функция за обновяване на Checkout секцията
    function updateCheckoutSummary(ingredients) {
        checkoutSummary.innerHTML = ""; // Изчистване на текущото съдържание
        ingredients.forEach(ingredient => {
            const item = document.createElement("p");
            item.textContent = ingredient; // Добавяне на всяка съставка като нов ред
            checkoutSummary.appendChild(item);
        });
    }

    // Обработчик на събития за формата (преди изпращане)
    document.querySelector(".order").addEventListener("submit", (event) => {
        ingredientsInput.value = JSON.stringify(selectedIngredients); // Записване на съставките в скритото поле
        console.log("Изпратени данни:", ingredientsInput.value); // Показване в конзолата за проверка
    });
});
