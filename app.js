document.addEventListener('DOMContentLoaded', () => {
    const recipesList = document.getElementById('recipes-list');

    // API para obtener recetas aleatorias
    const fetchRecipes = async () => {
        const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood'; // Puedes cambiar la categoría por cualquier otra
        const response = await fetch(url);
        const data = await response.json();
        
        // Mostrar las recetas
        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="card-info">
                        <h3>${meal.strMeal}</h3>
                        <button onclick="viewRecipeDetails('${meal.idMeal}')">Ver receta</button>
                    </div>
                `;
                recipesList.appendChild(recipeCard);
            });
        } else {
            recipesList.innerHTML = "<p>No se encontraron recetas.</p>";
        }
    };

    // Cargar las recetas cuando la página se cargue
    fetchRecipes();

    // Mostrar detalles de la receta
    window.viewRecipeDetails = async (idMeal) => {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
        const response = await fetch(url);
        const data = await response.json();
        const meal = data.meals[0];

        alert(`Receta: ${meal.strMeal}\nIngredientes: ${meal.strIngredient1}, ${meal.strIngredient2}`);
    };

    // Control de la animación del botón "Libro de Cocina"
    const cookbookBtn = document.getElementById('cookbook-btn');

    // Evento para abrir/cerrar el libro de cocina
    cookbookBtn.addEventListener('click', () => {
        cookbookBtn.classList.toggle('open'); // Alterna la clase para abrir/cerrar
    });
});
