document.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.querySelector(".chat-btn");
    const chatContainer = document.querySelector(".chat-container");
    const chatBody = document.getElementById("messages");
    const chatInput = document.getElementById("userInput");
    const sendBtn = document.querySelector(".chat-input button");

    chatBtn.addEventListener("click", toggleChat);
    chatContainer.querySelector(".chat-header").addEventListener("click", toggleChat);
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    function toggleChat() {
        chatContainer.classList.toggle("active");
    }

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        appendMessage("user", userMessage);
        chatInput.value = "";

        setTimeout(() => {
            showTypingEffect();
            fetchRecipeResponse(userMessage);
        }, 500);
    }

    function appendMessage(sender, message, isHTML = false) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.innerHTML = isHTML ? message : `<span class="${sender}-text">${message}</span>`;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingEffect() {
        const typingElement = document.createElement("div");
        typingElement.id = "typing-effect";
        typingElement.classList.add("message", "bot");
        typingElement.innerHTML = `<span class="bot-text">Escribiendo...</span>`;
        chatBody.appendChild(typingElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingEffect() {
        const typingElement = document.getElementById("typing-effect");
        if (typingElement) typingElement.remove();
    }

    async function fetchRecipeResponse(query) {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            removeTypingEffect();

            if (data.meals) {
                const meal = data.meals[0];
                const ingredients = getIngredientsList(meal);

                const mealInfo = `
                    <div class="recipe-chat-card">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img">
                        <h3>${meal.strMeal}</h3>
                        <p><strong>Ingredientes:</strong></p>
                        <ul>${ingredients}</ul>
                        <p><strong>Instrucciones:</strong> ${meal.strInstructions.slice(0, 200)}...</p>
                        <p>
                            🔗 <a href="${meal.strSource}" target="_blank">Ver receta completa</a><br>
                            📺 <a href="${meal.strYoutube}" target="_blank">Ver video</a>
                        </p>
                    </div>
                `;
                appendMessage("bot", mealInfo, true);
            } else {
                appendMessage("bot", "❌ No encontré una receta con ese nombre. Intenta con otra.");
            }
        } catch (error) {
            removeTypingEffect();
            appendMessage("bot", "⚠️ Hubo un error al obtener la receta.");
        }
    }

    function getIngredientsList(meal) {
        let ingredientsHTML = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredientsHTML += `<li>${measure} ${ingredient}</li>`;
            }
        }
        return ingredientsHTML;
    }
});
