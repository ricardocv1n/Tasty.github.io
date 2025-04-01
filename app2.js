document.addEventListener('DOMContentLoaded', () => {
    const apiRecipesContainer = document.getElementById('api-recipes');
    const recipePage = document.getElementById('recipe-page');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    let recipes = [];
    let currentIndex = 0;

    // API para obtener recetas aleatorias
    const fetchRecipes = async () => {
        const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.meals) {
            recipes = data.meals;
            displayRecipe(currentIndex); // Mostrar la primera receta
        } else {
            apiRecipesContainer.innerHTML = "<p>No se encontraron recetas.</p>";
        }
    };

    // Mostrar una receta
    const displayRecipe = (index) => {
        const meal = recipes[index];
        recipePage.innerHTML = `
            <div class="recipe-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-info">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="window.open('${meal.strSource}', '_blank')">Ver Receta</button>
                </div>
            </div>
        `;
    };

    // Cambiar a la receta anterior
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayRecipe(currentIndex);
        }
    });

    // Cambiar a la siguiente receta
    nextButton.addEventListener('click', () => {
        if (currentIndex < recipes.length - 1) {
            currentIndex++;
            displayRecipe(currentIndex);
        }
    });

    // Cargar las recetas cuando la página se cargue
    fetchRecipes();
});
