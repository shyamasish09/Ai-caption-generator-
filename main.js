// DOM Elements
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const fileSelectBtn = document.getElementById("fileSelect");
const previewImage = document.getElementById("previewImage");
const captionOutput = document.getElementById("captionOutput");
const generateBtn = document.getElementById("generateBtn");
const removeBtn = document.getElementById("removeBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const historyEl = document.getElementById("history");
const demoBtn = document.getElementById("demoBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

// State variables
let currentCaption = "";
let currentFile = null;
let history = JSON.parse(localStorage.getItem("captions") || "[]");

// Initialize
updateButtonStates();
renderHistory();

// === File Selection ===
fileSelectBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener("change", function() {
  handleFiles(this.files);
});

// === Drag and Drop Handling ===
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("highlight");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("highlight");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("highlight");
  
  if (e.dataTransfer.files.length) {
    handleFiles(e.dataTransfer.files);
  }
});

// Click on drop area to open file dialog
dropArea.addEventListener("click", (e) => {
  // Only trigger if the click is directly on the drop area (not on a button)
  if (e.target === dropArea) {
    fileInput.click();
  }
});

// Handle file processing
function handleFiles(files) {
  const file = files[0];
  
  // Validate file type
  if (!file || !file.type.startsWith("image/")) {
    alert("Please upload a valid image file (JPEG, PNG, etc.).");
    return;
  }
  
  currentFile = file;
  const reader = new FileReader();
  
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.classList.remove("d-none");
    captionOutput.textContent = "Ready to generate caption...";
    updateButtonStates();
  };
  
  reader.readAsDataURL(file);
}

// === Generate Caption ===
generateBtn.addEventListener("click", () => {
  if (!currentFile) return;
  
  captionOutput.textContent = "Analyzing image...";
  captionOutput.classList.add("loading");
  generateBtn.disabled = true;
  
  // Simulate AI processing with timeout
  setTimeout(() => {
    const demoCaptions = [
      "A person smiling at the camera with a beautiful landscape in the background.",
      "A scenic view of mountains and rivers during golden hour.",
      "A delicious plate of food on the table, ready to be enjoyed.",
      "A group of friends enjoying their time at a social gathering.",
      "A cute animal sitting outdoors, looking curiously at the camera.",
      "Urban cityscape with modern architecture and clear skies.",
      "Vibrant street art covering an entire building wall.",
      "Close-up of a flower with morning dew on its petals.",
      "Athlete in action during an important sports event.",
      "Vintage car parked in front of a classic American diner."
    ];
    
    currentCaption = demoCaptions[Math.floor(Math.random() * demoCaptions.length)];
    captionOutput.textContent = currentCaption;
    captionOutput.classList.remove("loading");
    
    addToHistory(previewImage.src, currentCaption);
    updateButtonStates();
  }, 2000);
});

// === Remove Image ===
removeBtn.addEventListener("click", () => {
  clearImage();
});

function clearImage() {
  previewImage.src = "";
  previewImage.classList.add("d-none");
  fileInput.value = "";
  captionOutput.textContent = "No caption yet. Upload an image or try Demo.";
  currentCaption = "";
  currentFile = null;
  updateButtonStates();
}

// === Copy Caption ===
copyBtn.addEventListener("click", () => {
  if (!currentCaption) return;
  
  navigator.clipboard.writeText(currentCaption).then(() => {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
    copyBtn.classList.add("btn-success");
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove("btn-success");
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    alert("Failed to copy caption to clipboard.");
  });
});

// === Download Caption ===
downloadBtn.addEventListener("click", () => {
  if (!currentCaption) return;
  
  const blob = new Blob([currentCaption], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  
  a.href = url;
  a.download = `caption-${date}.txt`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

// === History Management ===
function addToHistory(imageSrc, caption) {
  history.unshift({ 
    imageSrc, 
    caption, 
    date: new Date().toLocaleString() 
  });
  
  // Keep only last 6 history items
  if (history.length > 6) {
    history = history.slice(0, 6);
  }
  
  localStorage.setItem("captions", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = "";
  
  if (history.length === 0) {
    historyEl.innerHTML = `
      <div class="col-12">
        <p class="text-muted">No history yet. Generate captions to see them here.</p>
      </div>
    `;
    return;
  }
  
  history.forEach((item) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-4 mb-3";
    
    colDiv.innerHTML = `
      <div class="card history-item h-100">
        <img src="${item.imageSrc}" class="card-img-top" style="height: 180px; object-fit: cover;">
        <div class="card-body">
          <p class="card-text">${item.caption}</p>
          <small class="text-muted">${item.date}</small>
        </div>
      </div>
    `;
    
    historyEl.appendChild(colDiv);
  });
}

// === Demo Mode ===
demoBtn.addEventListener("click", () => {
  // Use a placeholder image service with random images
  const randomId = Math.floor(Math.random() * 1000);
  const demoImageUrl = `https://picsum.photos/id/${randomId}/600/400`;
  
  previewImage.src = demoImageUrl;
  previewImage.classList.remove("d-none");
  captionOutput.textContent = "Analyzing demo image...";
  captionOutput.classList.add("loading");
  generateBtn.disabled = true;
  
  setTimeout(() => {
    const demoCaptions = [
      "A beautiful landscape with mountains and a calm lake reflecting the sky.",
      "A cute puppy playing on the grass in a sunny park.",
      "A modern city skyline at sunset with vibrant colors.",
      "A delicious plate of gourmet food with careful presentation.",
      "A group of people enjoying a music festival in summer.",
      "Historic architecture with intricate details and blue skies.",
      "Macro photography of a bee collecting pollen from a flower.",
      "Aerial view of a tropical beach with turquoise water.",
      "Vintage bookstore with shelves filled with old books.",
      "Snowy mountain peak during the golden hour."
    ];
    
    currentCaption = demoCaptions[Math.floor(Math.random() * demoCaptions.length)];
    currentFile = { name: "demo-image.jpg", type: "image/jpeg" };
    captionOutput.textContent = currentCaption;
    captionOutput.classList.remove("loading");
    
    addToHistory(demoImageUrl, currentCaption);
    updateButtonStates();
  }, 2000);
});

// === Dark Mode Toggle ===
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  
  darkModeBtn.classList.toggle("dark", isDark);
  darkModeBtn.classList.toggle("light", !isDark);
  
  darkModeBtn.innerHTML = isDark
    ? '<i class="bi bi-sun-fill"></i> <span>Light Mode</span>'
    : '<i class="bi bi-moon-fill"></i> <span>Dark Mode</span>';
    
  // Save preference to localStorage
  localStorage.setItem("darkMode", isDark);
});

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  darkModeBtn.classList.add("dark");
  darkModeBtn.classList.remove("light");
  darkModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i> <span>Light Mode</span>';
}

// === Utility Functions ===
function updateButtonStates() {
  const hasImage = previewImage.src && !previewImage.classList.contains("d-none");
  const hasCaption = currentCaption !== "";
  
  generateBtn.disabled = !hasImage;
  removeBtn.disabled = !hasImage;
  copyBtn.disabled = !hasCaption;
  downloadBtn.disabled = !hasCaption;
}