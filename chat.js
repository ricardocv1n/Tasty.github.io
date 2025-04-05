// chat.js - Corregido y optimizado

document.addEventListener("DOMContentLoaded", () => {
    const chatBtn = document.querySelector(".chat-btn");
    const chatContainer = document.querySelector(".chat-container");
    const chatBody = document.getElementById("messages");
    const chatInput = document.getElementById("userInput");
    const sendBtn = document.querySelector(".chat-input button");
    
    if (!chatBtn || !chatContainer || !chatBody || !chatInput || !sendBtn) {
        console.error("Error: Elementos del chat no encontrados.");
        return;
    }

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
        if (!userMessage) return;
        
        appendMessage("user", userMessage);
        chatInput.value = "";

        setTimeout(() => {
            showTypingEffect();
            setTimeout(() => {
                removeTypingEffect();
                handleBotResponse(userMessage);
            }, 1500);
        }, 500);
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.innerHTML = `<span class="${sender}-text">${message}</span>`;
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

    function handleBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes("receta de")) {
            const query = lowerMessage.replace("receta de", "").trim();
            fetchRecipe(query);
        } else if (lowerMessage.includes("hola")) {
            appendMessage("bot", "👋 ¡Hola! ¿En qué receta puedo ayudarte hoy?");
        } else if (lowerMessage.includes("gracias")) {
            appendMessage("bot", "😊 ¡De nada! Estoy aquí para ayudarte.");
        } else {
            appendMessage("bot", "🤔 No estoy seguro de entender. ¿Podrías darme más detalles?");
        }
    }

    function fetchRecipe(query) {
        const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    const recipeMessage = `
                        🍽️ <b>${meal.strMeal}</b><br>
                        🌎 Origen: ${meal.strArea}<br>
                        🏷️ Categoría: ${meal.strCategory}<br>
                        📜 <a href="${meal.strSource}" target="_blank">Ver receta completa</a><br>
                        <img src="${meal.strMealThumb}" width="100">
                    `;
                    appendMessage("bot", recipeMessage);
                } else {
                    appendMessage("bot", "❌ No encontré esa receta. Prueba con otro nombre.");
                }
            })
            .catch(() => {
                appendMessage("bot", "⚠️ Hubo un error al buscar la receta.");
            });
    }
});
