// Create floating particles
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    particlesContainer.appendChild(particle);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
        }
    });
});

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.circle');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 10;
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Scroll animations via IntersectionObserver
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});


// ===== DESKTOP SIDEBAR LOGIC FUNCTIONS =====
const sidebar = document.getElementById('sidebar');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

if (sidebar) {
    sidebar.addEventListener('click', (e) => {
        if (!sidebar.classList.contains('expanded') && !e.target.closest('#sidebarCloseBtn') && !e.target.closest('#accountBtnDesktop')) {
            sidebar.classList.add('expanded');
        }
    });
}

if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.remove('expanded');
    });
}


// ===== NAVIGATION MENU ACCOUNT CONTROLS =====
const mobileAccountDrawer = document.getElementById('mobileAccountDrawer');
const accountHamburgerBtn = document.getElementById('accountHamburgerBtn');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');
const accountBtnDesktop = document.getElementById('accountBtnDesktop');

const authModalOverlay = document.getElementById('authModalOverlay');
const signInCard = document.getElementById('signInCard');
const signUpCard = document.getElementById('signUpCard');

// Toggle Drawer layout view
if (accountHamburgerBtn) {
    accountHamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileAccountDrawer.classList.toggle('active');
    });
}

if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
        mobileAccountDrawer.classList.remove('active');
    });
}

// Open Login Modal from Desktop click selection
if (accountBtnDesktop) {
    accountBtnDesktop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openAuthModal('signin');
    });
}

function openAuthModal(mode) {
    mobileAccountDrawer.classList.remove('active');
    authModalOverlay.classList.add('active');
    switchAuthCard(mode);
}

function closeAuthModal() {
    authModalOverlay.classList.remove('active');
}

function switchAuthCard(mode) {
    if (mode === 'signin') {
        signInCard.style.display = 'block';
        signUpCard.style.display = 'none';
    } else {
        signInCard.style.display = 'none';
        signUpCard.style.display = 'block';
    }
}

// Close popup on backdrop wrapper shadow click
if (authModalOverlay) {
    authModalOverlay.addEventListener('click', (e) => {
        if (e.target === authModalOverlay) closeAuthModal();
    });
}


// ===== RESPONSIVE UNIFIED THEME TOGGLE FUNCTIONALITY =====
const themeToggleSide = document.getElementById('themeToggleSide');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

function toggleTheme(e) {
    e.preventDefault();
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

if (themeToggleSide) themeToggleSide.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);


// ===== MODE SWITCHING FUNCTIONALITY =====
let currentMode = 'standard';
let influencerImages = [];
let influencerCaptions = [];

function switchMode(mode) {
    currentMode = mode;
    const standardUploadCard = document.getElementById('standardUploadCard');
    const influencerUploadCard = document.getElementById('influencerUploadCard');
    const standardContextCard = document.getElementById('standardContextCard');
    const influencerContextCard = document.getElementById('influencerContextCard');
    const standardCaptionCard = document.getElementById('standardCaptionCard');
    const influencerCaptionCard = document.getElementById('influencerCaptionCard');
    const modeIndicator = document.getElementById('modeIndicator');
    const standardModeBtn = document.getElementById('standardModeBtn');
    const influencerModeBtn = document.getElementById('influencerModeBtn');

    if (mode === 'standard') {
        standardUploadCard.style.display = 'block';
        influencerUploadCard.style.display = 'none';
        standardContextCard.style.display = 'block';
        influencerContextCard.style.display = 'none';
        standardCaptionCard.style.display = 'block';
        influencerCaptionCard.style.display = 'none';
        modeIndicator.textContent = 'Standard Mode';
        standardModeBtn.classList.add('mode-btn-active');
        influencerModeBtn.classList.remove('mode-btn-active');
        clearStandardMode();
    } else {
        standardUploadCard.style.display = 'none';
        influencerUploadCard.style.display = 'block';
        standardContextCard.style.display = 'none';
        influencerContextCard.style.display = 'block';
        standardCaptionCard.style.display = 'none';
        influencerCaptionCard.style.display = 'block';
        modeIndicator.textContent = 'Influencer Mode (Pro)';
        standardModeBtn.classList.remove('mode-btn-active');
        influencerModeBtn.classList.add('mode-btn-active');
        clearInfluencerMode();
    }
}

function clearStandardMode() {
    currentImage = null;
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    fileInput.value = '';
    generateBtn.disabled = true;
}

function clearInfluencerMode() {
    influencerImages = [];
    influencerCaptions = [];
    document.getElementById('influencerUploadArea').style.display = 'block';
    document.getElementById('influencerPreviewArea').style.display = 'none';
    document.getElementById('influencerFileInput').value = '';
    document.getElementById('influencerContext').value = '';
    document.getElementById('influencerGenerateBtn').disabled = true;
    document.getElementById('captionsGrid').innerHTML = '<p class="placeholder-text">No captions yet. Upload images and describe your post to get started.</p>';
}


// ===== CORE CAPTION PIPELINE PROCESSORS =====
let currentImage = null;
let currentCaption = '';
let historyData = JSON.parse(localStorage.getItem('captionHistory')) || [];

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');

// STANDARD MODE - Single Image Upload
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#a855f7';
        uploadArea.style.background = 'rgba(168, 85, 247, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'rgba(168, 85, 247, 0.5)';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(168, 85, 247, 0.5)';
        uploadArea.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    uploadArea.addEventListener('click', () => { fileInput.click(); });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file);
    });
}

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        generateBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImage = null;
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    fileInput.value = '';
    generateBtn.disabled = true;
}

// INFLUENCER MODE - Multi-image Upload (Max 5)
const influencerUploadArea = document.getElementById('influencerUploadArea');
const influencerFileInput = document.getElementById('influencerFileInput');
const influencerPreviewArea = document.getElementById('influencerPreviewArea');
const influencerGenerateBtn = document.getElementById('influencerGenerateBtn');

if (influencerUploadArea) {
    influencerUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        influencerUploadArea.style.borderColor = '#a855f7';
        influencerUploadArea.style.background = 'rgba(168, 85, 247, 0.1)';
    });

    influencerUploadArea.addEventListener('dragleave', () => {
        influencerUploadArea.style.borderColor = 'rgba(168, 85, 247, 0.5)';
        influencerUploadArea.style.background = '';
    });

    influencerUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        influencerUploadArea.style.borderColor = 'rgba(168, 85, 247, 0.5)';
        influencerUploadArea.style.background = '';
        
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleInfluencerImageUpload(files);
    });

    influencerUploadArea.addEventListener('click', () => { influencerFileInput.click(); });
}

if (influencerFileInput) {
    influencerFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleInfluencerImageUpload(files);
    });
}

function handleInfluencerImageUpload(files) {
    const maxFiles = 5;
    const filesToAdd = files.slice(0, maxFiles - influencerImages.length);
    
    filesToAdd.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            influencerImages.push(e.target.result);
            renderInfluencerPreview();
            if (influencerImages.length > 0) {
                influencerGenerateBtn.disabled = false;
            }
        };
        reader.readAsDataURL(file);
    });
}

function renderInfluencerPreview() {
    const previewCarousel = document.getElementById('previewCarousel');
    const previewCount = document.getElementById('previewCount');
    
    previewCount.textContent = `${influencerImages.length} image${influencerImages.length !== 1 ? 's' : ''} selected`;
    
    previewCarousel.innerHTML = influencerImages.map((img, index) => `
        <div class="preview-thumbnail-wrapper">
            <img src="${img}" class="preview-thumbnail" alt="Preview ${index + 1}">
            <button class="remove-thumbnail-btn" onclick="removeInfluencerImage(${index})">×</button>
        </div>
    `).join('');
    
    if (influencerImages.length > 0) {
        influencerUploadArea.style.display = 'none';
        influencerPreviewArea.style.display = 'block';
    } else {
        influencerUploadArea.style.display = 'block';
        influencerPreviewArea.style.display = 'none';
    }
}

function removeInfluencerImage(index) {
    influencerImages.splice(index, 1);
    renderInfluencerPreview();
    if (influencerImages.length === 0) {
        influencerGenerateBtn.disabled = true;
    }
}

function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Caption Generation
function generateCaptionText(platform, style, tone, lang, length, emojis, hashtags, context) {
    let base = "";
    
    if (lang === "hindi") {
        base = "इस सुंदर दृश्य का आनंद लेते हुए। ज़िन्दगी के कुछ पल बेहद खास होते हैं।";
    } else if (lang === "bengali") {
        base = "আজকের এই সুন্দর মুহূর্ত ফ্রেমবন্দী করলাম। জীবনের সেরা কিছু স্মৃতি।";
    } else if (lang === "tamil") {
        base = "இந்த அழகான தருணம் எப்போதும் என் நினைவில் இருக்கும். மகிழ்ச்சியான வாழ்க்கை!";
    } else {
        if (style === "storytelling") {
            base = "It started with a simple thought, but as the day went on, this exact viewpoint made me stop and realize how far the journey has come.";
        } else if (style === "minimal") {
            base = "Grateful for today.";
        } else if (style === "poetic") {
            base = "Sunlight playing on old memories, dancing like gold across fields of blue.";
        } else if (style === "professional") {
            base = "Strategic focus and core alignments delivering consistent excellence throughout our latest developments.";
        } else if (style === "conversational") {
            base = "Honestly, sitting here makes me wonder—how often do we actually stop to enjoy the view? What do you think?";
        } else {
            base = "A breathtaking perspective balancing perfect lighting with natural composition layers.";
        }
    }

    if (context.trim().length > 0) {
        base = `[Regarding: ${context}] \n${base}`;
    }

    if (length === 'long') {
        base += " Creating space for new milestones ahead while holding appreciation for every small step taken.";
    }

    if (platform === "linkedin") {
        base = "💼 Professional Updates // \n\n" + base;
    } else if (platform === "twitter") {
        if (base.length > 200) base = base.substring(0, 200) + "...";
    }

    if (emojis) {
        const toneEmojis = { happy: '✨ 😊', emotional: '❤️ 🥺', funny: '😂 💀', inspirational: '🚀 🌟', romantic: '💖 ✨', respectful: '🙏 ✨' };
        base += " " + (toneEmojis[tone] || '✨');
    }

    if (hashtags) {
        base += `\n\n#${platform}Vibes #${style}Style #${tone} #${lang}`;
    }

    return base;
}

async function generateCaption() {
    if (!currentImage) {
        alert('Please upload an image first!');
        return;
    }

    const captionContent = document.getElementById('captionContent');
    captionContent.innerHTML = `
        <div style="text-align: center;">
            <div class="loading"></div>
            <p style="margin-top: 15px; color: #9ca3af;">Generating your caption...</p>
        </div>
    `;

    const platform = document.getElementById('captionPlatform').value;
    const style = document.getElementById('captionStyle').value;
    const tone = document.getElementById('captionTone').value;
    const lang = document.getElementById('captionLanguage').value;
    const length = document.getElementById('captionLength').value;
    const includeEmojis = document.getElementById('includeEmojis').checked;
    const includeHashtags = document.getElementById('includeHashtags').checked;
    const context = document.getElementById('captionContext').value;

    setTimeout(() => {
        currentCaption = generateCaptionText(platform, style, tone, lang, length, includeEmojis, includeHashtags, context);
        captionContent.innerHTML = `<p>${currentCaption.replace(/\n/g, '<br>')}</p>`;
        addToHistory(currentImage, currentCaption);
    }, 600);
}

async function generateInfluencerCaptions() {
    const influencerContext = document.getElementById('influencerContext').value;
    
    if (!influencerContext.trim()) {
        alert('Please describe your post to generate captions!');
        return;
    }

    if (influencerImages.length === 0) {
        alert('Please upload at least one image!');
        return;
    }

    const captionsGrid = document.getElementById('captionsGrid');
    captionsGrid.innerHTML = `
        <div style="text-align: center; grid-column: 1 / -1;">
            <div class="loading"></div>
            <p style="margin-top: 15px; color: #9ca3af;">Generating captions...</p>
        </div>
    `;

    const platform = document.getElementById('captionPlatform').value;
    const style = document.getElementById('captionStyle').value;
    const tone = document.getElementById('captionTone').value;
    const lang = document.getElementById('captionLanguage').value;
    const length = document.getElementById('captionLength').value;
    const includeEmojis = document.getElementById('includeEmojis').checked;
    const includeHashtags = document.getElementById('includeHashtags').checked;

    setTimeout(() => {
        influencerCaptions = [
            generateCaptionText(platform, style, tone, lang, length, includeEmojis, includeHashtags, influencerContext),
            generateCaptionText(platform, style, tone, lang, length, includeEmojis, includeHashtags, influencerContext),
            generateCaptionText(platform, style, tone, lang, length, includeEmojis, includeHashtags, influencerContext)
        ];
        renderInfluencerCaptions();
        addToHistory(influencerImages[0], influencerCaptions[0]);
    }, 800);
}

function renderInfluencerCaptions() {
    const captionsGrid = document.getElementById('captionsGrid');
    captionsGrid.innerHTML = influencerCaptions.map((caption, index) => `
        <div class="caption-option">
            <div class="caption-option-header">
                <h4>Option ${index + 1}</h4>
                <input type="radio" name="selected-caption" value="${index}" onchange="selectCaption(${index})">
            </div>
            <div class="caption-option-content">
                <p>${caption.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="caption-option-actions">
                <button class="btn-secondary-action" onclick="copyInfluencerCaption(${index})">
                    <i class="fa-solid fa-copy"></i> Copy
                </button>
            </div>
        </div>
    `).join('');
}

let selectedCaptionIndex = 0;
function selectCaption(index) {
    selectedCaptionIndex = index;
}

function copyInfluencerCaption(index) {
    navigator.clipboard.writeText(influencerCaptions[index]).then(() => {
        alert('Caption copied to clipboard!');
    });
}

function clearCaption() {
    document.getElementById('captionContent').innerHTML = '<p class="placeholder-text">No caption yet. Upload an image to get started.</p>';
    currentCaption = '';
    document.getElementById('captionContext').value = '';
}

function clearInfluencerCaptions() {
    document.getElementById('captionsGrid').innerHTML = '<p class="placeholder-text">No captions yet. Upload images and describe your post to get started.</p>';
    influencerCaptions = [];
}

function copyCaption() {
    if (!currentCaption) return alert('No caption to copy!');
    navigator.clipboard.writeText(currentCaption).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = '';
        }, 2000);
    });
}

function downloadCaption() {
    if (!currentCaption) return alert('No caption to download!');
    const blob = new Blob([currentCaption], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caption_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// ===== HISTORY HANDLING FUNCTIONS =====
function createThumbnail(base64Image, maxWidth = 200) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const scale = maxWidth / img.width;
            const canvas = document.createElement('canvas');
            canvas.width = maxWidth; canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = base64Image;
    });
}

async function addToHistory(image, caption) {
    const thumbnail = await createThumbnail(image);
    const historyItem = { id: Date.now(), thumbnail: thumbnail, caption: caption, date: new Date().toLocaleString() };
    historyData.unshift(historyItem);
    if (historyData.length > 12) historyData = historyData.slice(0, 12);
    localStorage.setItem('captionHistory', JSON.stringify(historyData));
    renderHistory();
}

function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
    if (!historyGrid) return;
    if (historyData.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">No history yet. Generate your first caption!</p>';
        return;
    }
    historyGrid.innerHTML = historyData.map(item => `
        <div class="history-item" onclick="viewHistoryItem(${item.id})">
            <img src="${item.thumbnail}" class="history-image">
            <div class="history-content">
                <p class="history-caption">${item.caption}</p>
                <p class="history-date">${item.date}</p>
            </div>
            <div class="history-actions">
                <button class="history-btn" onclick="event.stopPropagation(); copyHistoryCaption(${item.id})">Copy</button>
                <button class="history-btn" onclick="event.stopPropagation(); deleteHistoryItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewHistoryItem(id) {
    const item = historyData.find(h => h.id === id);
    if (item) {
        currentCaption = item.caption;
        document.getElementById('captionContent').innerHTML = `<p>${item.caption.replace(/\n/g, '<br>')}</p>`;
    }
}

function copyHistoryCaption(id) {
    const item = historyData.find(h => h.id === id);
    if (item) {
        navigator.clipboard.writeText(item.caption);
        alert('Caption copied to clipboard!');
    }
}

function deleteHistoryItem(id) {
    historyData = historyData.filter(h => h.id !== id);
    localStorage.setItem('captionHistory', JSON.stringify(historyData));
    renderHistory();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        historyData = [];
        localStorage.removeItem('captionHistory');
        renderHistory();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    if (generateBtn) generateBtn.disabled = true;
    switchMode('standard');
});
