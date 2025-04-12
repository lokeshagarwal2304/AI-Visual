// Function to verify if an image loads correctly and use backup if not
function verifyImageLoading() {
  const images = document.querySelectorAll("img")

  images.forEach((img) => {
    // Skip SVGs and already processed images
    if (img.src.includes("svg") || img.dataset.verified === "true") {
      return
    }

    img.dataset.verified = "true"
    img.dataset.originalSrc = img.src

    img.onerror = function () {
      // If the image fails to load, use a backup service
      const prompt = img.alt || "AI Generated Image"
      this.src = `https://dummyimage.com/500x300/6d28d9/ffffff&text=${encodeURIComponent(prompt)}`
    }
  })
}

// Observer for dynamically added images
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      verifyImageLoading()
    }
  })
})

// Start observing the gallery element
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery")
  if (gallery) {
    observer.observe(gallery, { childList: true, subtree: true })
    verifyImageLoading() // Check existing images
  }
})
