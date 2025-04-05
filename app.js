document.addEventListener('DOMContentLoaded', () => {
    const recipesList = document.getElementById('recipes-list');
    const cookbookBtn = document.getElementById('cookbook-btn');

    if (!recipesList) {
        console.error("Error: Elemento 'recipes-list' no encontrado.");
        return;
    }

    // Función para obtener recetas aleatorias
    const fetchRecipes = async () => {
        try {
            const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood'; // Puedes cambiar la categoría
            const response = await fetch(url);

            if (!response.ok) throw new Error("Error al obtener las recetas.");

            const data = await response.json();

            // Mostrar las recetas
            recipesList.innerHTML = ""; // Limpiar contenido antes de agregar recetas nuevas
            if (data.meals) {
                data.meals.forEach(meal => {
                    const recipeCard = document.createElement('div');
                    recipeCard.classList.add('recipe-card');
                    recipeCard.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="card-info">
                            <h3>${meal.strMeal}</h3>
                            <button class="view-recipe-btn" data-id="${meal.idMeal}">Ver receta</button>
                        </div>
                    `;
                    recipesList.appendChild(recipeCard);
                });

                // Agregar eventos a los botones de receta
                document.querySelectorAll(".view-recipe-btn").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const idMeal = event.target.getAttribute("data-id");
                        viewRecipeDetails(idMeal);
                    });
                });
            } else {
                recipesList.innerHTML = "<p>No se encontraron recetas.</p>";
            }
        } catch (error) {
            console.error(error);
            recipesList.innerHTML = "<p>Error al cargar las recetas. Inténtalo más tarde.</p>";
        }
    };

    // Cargar las recetas al cargar la página
    fetchRecipes();

    // Función para mostrar detalles de la receta
    const viewRecipeDetails = async (idMeal) => {
        try {
            const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error("Error al obtener los detalles de la receta.");

            const data = await response.json();

            if (!data.meals || data.meals.length === 0) {
                alert("No se encontraron detalles para esta receta.");
                return;
            }

            const meal = data.meals[0];

            alert(`Receta: ${meal.strMeal}\nIngredientes: ${meal.strIngredient1 || 'N/A'}, ${meal.strIngredient2 || 'N/A'}`);
        } catch (error) {
            console.error(error);
            alert("Error al obtener los detalles de la receta.");
        }
    };

    // Evento para abrir/cerrar el libro de cocina
    if (cookbookBtn) {
        cookbookBtn.addEventListener('click', () => {
            cookbookBtn.classList.toggle('open'); // Alterna la clase para abrir/cerrar
        });
    } else {
        console.warn("Advertencia: Elemento 'cookbook-btn' no encontrado.");
    }
});
