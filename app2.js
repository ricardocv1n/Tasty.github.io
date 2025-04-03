let currentPage = 1;
let totalPages = 0;
let recipesData = []; // Almacena las recetas obtenidas de la API

// Función para cargar recetas desde la API
async function loadRecipes() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood'); // API de ejemplo
    const data = await response.json();
    recipesData = data.meals;
    totalPages = Math.ceil(recipesData.length / 6);
    showPage(currentPage);
}

// Mostrar las recetas de la página actual
function showPage(page) {
    const start = (page - 1) * 6;
    const end = start + 6;
    const recipesToShow = recipesData.slice(start, end);
    const pageElement = document.getElementById('page');
    
    // Añadir la clase para la transición de "salir"
    pageElement.classList.add('page-exit');
    setTimeout(() => {
        pageElement.innerHTML = ''; // Limpiar contenido actual

        // Crear las tarjetas de recetas
        recipesToShow.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h4>${recipe.strMeal}</h4>
            `;
            recipeCard.addEventListener('click', () => showRecipeDetails(recipe));
            pageElement.appendChild(recipeCard);
        });

        // Eliminar la clase para que la página se muestre con la animación
        pageElement.classList.remove('page-exit');
        pageElement.classList.add('page-enter');
        
        // Esperamos para activar la clase final que muestra la página completamente visible
        setTimeout(() => {
            pageElement.classList.remove('page-enter');
            pageElement.classList.add('page-enter-active');
        }, 500);
    }, 500); // Duración de la animación para la salida
}

// Mostrar detalles de la receta en el modal
function showRecipeDetails(recipe) {
    const recipeName = document.getElementById('recipe-name');
    const recipeImage = document.getElementById('recipe-image');
    const recipeIngredients = document.getElementById('recipe-ingredients');
    const recipeInstructions = document.getElementById('recipe-instructions');

    recipeName.textContent = recipe.strMeal;
    recipeImage.src = recipe.strMealThumb;
    recipeIngredients.innerHTML = '';

    // Mostrar los ingredientes
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        if (ingredient) {
            const li = document.createElement('li');
            li.textContent = ingredient;
            recipeIngredients.appendChild(li);
        } else {
            break;
        }
    }

    recipeInstructions.textContent = recipe.strInstructions;

    // Mostrar el modal con los detalles
    document.getElementById('recipe-modal').style.display = 'flex';
}

// Cerrar el modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('recipe-modal').style.display = 'none';
});

// Controlar los botones de navegación
document.getElementById('next-button').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

// Cargar recetas al inicio
loadRecipes();
