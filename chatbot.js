// DOM Elements
const chatbotTrigger = document.getElementById("chatbot-trigger")
const chatbot = document.getElementById("chatbot")
const chatbotToggle = document.getElementById("chatbot-toggle")
const chatbotMessages = document.getElementById("chatbot-messages")
const chatbotInput = document.getElementById("chatbot-input-field")
const chatbotSend = document.getElementById("chatbot-send")

// Chatbot state
let isChatbotOpen = false

// Chatbot responses
const botResponses = {
  greetings: [
    "Hello! How can I help you with AI visuals today?",
    "Hi there! Need help with generating images?",
    "Welcome! I'm your AI visual assistant. What can I help you with?",
  ],

  prompts: [
    "For better results, try being specific about style, colors, and composition. For example, 'A serene mountain landscape at sunset with purple and orange hues, in watercolor style'.",
    "Descriptive prompts work best! Include details like lighting, perspective, and mood. For example: 'A cozy cafe interior with warm lighting, steam rising from coffee cups, shot from above'.",
    "Try specifying an art style like 'digital art', 'oil painting', 'pencil sketch', or 'photorealistic' in your prompt.",
  ],

  help: [
    "You can generate images by typing a prompt in the text area above and clicking 'Generate'. Save your favorites by clicking the 'Save' button on any image card.",
    "To search for specific images, use the search bar at the top. You can also filter to see only your saved images using the tabs above the gallery.",
    "Need inspiration? Try prompts about landscapes, portraits, abstract concepts, or futuristic scenes!",
  ],

  fallback: [
    "I'm not sure I understand. Could you rephrase that?",
    "I'm still learning! Could you try asking in a different way?",
    "I don't have information about that. Would you like some tips on creating better prompts instead?",
  ],
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  chatbotTrigger.addEventListener("click", toggleChatbot)
  chatbotToggle.addEventListener("click", toggleChatbot)
  chatbotSend.addEventListener("click", sendMessage)
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
})

// Toggle Chatbot
function toggleChatbot() {
  isChatbotOpen = !isChatbotOpen

  if (isChatbotOpen) {
    chatbot.classList.remove("collapsed")
    chatbotTrigger.style.display = "none"
  } else {
    chatbot.classList.add("collapsed")
    chatbotTrigger.style.display = "flex"
  }
}

// Send Message
function sendMessage() {
  const message = chatbotInput.value.trim()
  if (!message) return

  // Add user message to chat
  addMessage(message, "user")
  chatbotInput.value = ""

  // Simulate typing
  showTypingIndicator()

  // Process message and respond after a delay
  setTimeout(() => {
    removeTypingIndicator()
    const response = getBotResponse(message)
    addMessage(response, "bot")
  }, 1000)
}

// Add Message to Chat
function addMessage(message, sender) {
  const messageElement = document.createElement("div")
  messageElement.className = `message ${sender}`
  messageElement.innerHTML = `
    <div class="message-content">${message}</div>
  `

  chatbotMessages.appendChild(messageElement)
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight
}

// Show Typing Indicator
function showTypingIndicator() {
  const typingIndicator = document.createElement("div")
  typingIndicator.className = "message bot typing-indicator"
  typingIndicator.innerHTML = `
    <div class="message-content">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `

  chatbotMessages.appendChild(typingIndicator)
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight
}

// Remove Typing Indicator
function removeTypingIndicator() {
  const typingIndicator = document.querySelector(".typing-indicator")
  if (typingIndicator) {
    typingIndicator.remove()
  }
}

// Get Bot Response
function getBotResponse(message) {
  message = message.toLowerCase()

  // Check for keywords and return appropriate response
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return getRandomResponse(botResponses.greetings)
  } else if (message.includes("prompt") || message.includes("better") || message.includes("improve")) {
    return getRandomResponse(botResponses.prompts)
  } else if (message.includes("help") || message.includes("how") || message.includes("what")) {
    return getRandomResponse(botResponses.help)
  } else {
    return getRandomResponse(botResponses.fallback)
  }
}

// Get Random Response
function getRandomResponse(responses) {
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}

// Add some CSS for typing indicator
const style = document.createElement("style")
style.textContent = `
  .typing-indicator .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #6b7280;
    margin-right: 4px;
    animation: bounce 1.4s infinite ease-in-out;
  }
  
  .typing-indicator .dot:nth-child(1) {
    animation-delay: 0s;
  }
  
  .typing-indicator .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-8px);
    }
  }
`

document.head.appendChild(style)
