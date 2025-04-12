// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const promptForm = document.getElementById("prompt-form")
const promptInput = document.getElementById("prompt-input")
const generateButton = document.getElementById("generate-button")
const spinner = document.querySelector(".spinner")
const gallery = document.getElementById("gallery")
const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")
const tabButtons = document.querySelectorAll(".tab-button")
const notification = document.getElementById("notification")
const notificationMessage = document.getElementById("notification-message")

// State
let images = JSON.parse(localStorage.getItem("aiImages")) || []
let currentTab = "all"

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  }

  // Render gallery
  renderGallery()
})

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  } else {
    localStorage.setItem("theme", "light")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  }
})

// Generate Image
promptForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const prompt = promptInput.value.trim()
  if (!prompt) return

  // Show loading state
  generateButton.querySelector("span").textContent = "Generating..."
  spinner.classList.remove("hidden")
  generateButton.disabled = true

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a random image (in a real app, this would be an API call)
    const imageId = Date.now().toString()
    const seed = Math.floor(Math.random() * 1000)
    const imageUrl = `https://picsum.photos/seed/${seed}/500/300`

    // Add to images array
    const newImage = {
      id: imageId,
      prompt: prompt,
      url: imageUrl,
      date: new Date().toISOString(),
      saved: false,
    }

    images.unshift(newImage)
    saveImagesToLocalStorage()
    renderGallery()

    // Reset form
    promptInput.value = ""

    // Show success notification
    showNotification("Image generated successfully!", "success")
  } catch (error) {
    console.error("Error generating image:", error)
    showNotification("Failed to generate image. Please try again.", "error")
  } finally {
    // Reset button state
    generateButton.querySelector("span").textContent = "Generate"
    spinner.classList.add("hidden")
    generateButton.disabled = false
  }
})

// Save Images to LocalStorage
function saveImagesToLocalStorage() {
  localStorage.setItem("aiImages", JSON.stringify(images))
}

// Mock function to simulate image loading verification
function verifyImageLoading() {
  // This function would contain the logic to verify if images are loaded correctly.
  // In a real application, you might check the `complete` property of the image
  // or use other techniques to ensure images are fully loaded.
  console.log("Image loading verification function called.")
}

// Render Gallery
function renderGallery(filteredImages = null) {
  gallery.innerHTML = ""

  const imagesToRender = filteredImages || images
  const filteredByTab = currentTab === "all" ? imagesToRender : imagesToRender.filter((img) => img.saved)

  if (filteredByTab.length === 0) {
    gallery.innerHTML = `
      <div class="empty-gallery">
        <p>${currentTab === "all" ? "No images generated yet. Try creating one!" : "No saved images yet."}</p>
      </div>
    `
    return
  }

  filteredByTab.forEach((image) => {
    const card = document.createElement("div")
    card.className = "image-card"
    card.innerHTML = `
      <div class="image-container">
        <img src="${image.url}" alt="${image.prompt}" loading="lazy" onerror="this.src='https://dummyimage.com/500x300/6d28d9/ffffff&text=${encodeURIComponent(image.prompt)}'">
      </div>
      <div class="image-details">
        <p class="image-prompt">${image.prompt}</p>
        <p class="image-date">${formatDate(image.date)}</p>
        <div class="image-actions">
          <button class="image-action-btn save-btn" data-id="${image.id}">
            <i class="fas ${image.saved ? "fa-bookmark" : "fa-bookmark-o"}"></i>
            ${image.saved ? "Saved" : "Save"}
          </button>
          <button class="image-action-btn delete-btn" data-id="${image.id}">
            <i class="fas fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    `

    gallery.appendChild(card)
  })

  // Add event listeners to buttons
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", toggleSaveImage)
  })

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", deleteImage)
  })

  // Ensure all images load properly
  if (typeof verifyImageLoading === "function") {
    verifyImageLoading()
  }
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Toggle Save Image
function toggleSaveImage(e) {
  const imageId = e.currentTarget.dataset.id
  const imageIndex = images.findIndex((img) => img.id === imageId)

  if (imageIndex !== -1) {
    images[imageIndex].saved = !images[imageIndex].saved
    saveImagesToLocalStorage()
    renderGallery()

    showNotification(
      images[imageIndex].saved ? "Image saved to collection!" : "Image removed from collection.",
      "success",
    )
  }
}

// Delete Image
function deleteImage(e) {
  const imageId = e.currentTarget.dataset.id

  // Confirm deletion
  if (confirm("Are you sure you want to delete this image?")) {
    images = images.filter((img) => img.id !== imageId)
    saveImagesToLocalStorage()
    renderGallery()

    showNotification("Image deleted successfully.", "success")
  }
}

// Search Images
searchButton.addEventListener("click", performSearch)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch()
  }
})

function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase()

  if (!searchTerm) {
    renderGallery()
    return
  }

  const filteredImages = images.filter((img) => img.prompt.toLowerCase().includes(searchTerm))

  renderGallery(filteredImages)

  if (filteredImages.length === 0) {
    showNotification("No images found matching your search.", "error")
  }
}

// Tab Switching
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    currentTab = button.dataset.tab
    renderGallery()
  })
})

// Show Notification
function showNotification(message, type) {
  notificationMessage.textContent = message
  notification.className = "notification " + type

  // Set icon based on type
  const notificationIcon = notification.querySelector(".notification-icon")
  if (type === "success") {
    notificationIcon.className = "notification-icon fas fa-check-circle"
  } else {
    notificationIcon.className = "notification-icon fas fa-exclamation-circle"
  }

  notification.classList.remove("hidden")

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.add("hidden")
  }, 3000)
}
