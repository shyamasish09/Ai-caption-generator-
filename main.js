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
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close sidebar on mobile after click
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
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

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

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

// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSidebarClose = document.getElementById('mobileSidebarClose');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

if (mobileSidebarClose) {
    mobileSidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById('themeToggleSide');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

themeToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// ===== AUTHENTICATION INTERACTION =====
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const accountMenuBtn = document.getElementById('accountMenuBtn');
const closeSignIn = document.getElementById('closeSignIn');
const closeSignUp = document.getElementById('closeSignUp');
const switchToSignUp = document.getElementById('switchToSignUp');
const switchToSignIn = document.getElementById('switchToSignIn');

accountMenuBtn.addEventListener('click', () => {
    signInModal.classList.add('open');
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
});

closeSignIn.addEventListener('click', () => signInModal.classList.remove('open'));
closeSignUp.addEventListener('click', () => signUpModal.classList.remove('open'));

switchToSignUp.addEventListener('click', () => {
    signInModal.classList.remove('open');
    signUpModal.classList.add('open');
});

switchToSignIn.addEventListener('click', () => {
    signUpModal.classList.remove('open');
    signInModal.classList.add('open');
});

// Close open modal on background click
window.addEventListener('click', (e) => {
    if (e.target === signInModal) signInModal.classList.remove('open');
    if (e.target === signUpModal) signUpModal.classList.remove('open');
});

// ===== GLOBAL VARIABLES =====
let currentImage = null;
let currentCaption = '';
let historyData = JSON.parse(localStorage.getItem('captionHistory')) || [];

// File upload elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');

// Drag & drop
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

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

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

function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===== EXTENDED MOCK CAPTION GENERATION =====
function generateMockCaption(platform, style, tone, language, length, emojis, hashtags, context) {
    // Basic translation blocks for multi-language handling
    const translations = {
        english: {
            conversational: "Here is a snapshot of what's currently keeping me inspired.",
            storytelling: "Every journey has an unexpected turning point. This moment captured it perfectly.",
            minimal: "Simplicity.",
            descriptive: "A gorgeous setup defined by clean lines, rich tones, and detailed elements.",
            poetic: "Like shadows chasing the golden hour sunrise.",
            professional: "Optimizing aesthetics and strategies for next-level production values."
        },
        hindi: {
            conversational: "बस कुछ ऐसा जो आजकल मुझे प्रेरित कर रहा है।",
            storytelling: "हर कहानी का एक खूबसूरत मोड़ होता है। यह पल उसी की गवाही देता है।",
            minimal: "सादगी।",
            descriptive: "शानदार रंगों, गहरी परछाइयों और सटीक बारीकियों का एक अनूठा संगम।",
            poetic: "जैसे सुबह की सुनहरी किरणें अंधेरे को मिटा रही हों।",
            professional: "सफलता केवल काम से नहीं, बल्कि सही विज़न और मेहनत से मिलती है।"
        },
        bengali: {
            conversational: "আজকের দিনটার একটা ছোট্ট মুহূর্ত, যা বেশ ভালো লাগলো।",
            storytelling: "প্রতিটি গল্পের একটি নিজস্ব মোড় থাকে। এই মুহূর্তটি ঠিক সেটাই ফ্রেমবন্দী করল।",
            minimal: "সহজ সরল জীবন।",
            descriptive: "চমৎকার রঙের বিন্যাস এবং আলোর খেলার এক নিখুঁত প্রকাশ।",
            poetic: "যেন এক টুকরো মেঘ এসে ছুঁয়ে গেল মনের কোণ।",
            professional: "পরিশ্রম এবং সঠিক লক্ষ্যই এগিয়ে যাওয়ার একমাত্র চাবিকাঠি।"
        },
        tamil: {
            conversational: "இன்று என்னை ஊக்கப்படுத்திய ஒரு அழகான தருணம் இது.",
            storytelling: "ஒவ்வொரு பயணத்திற்கும் ஒரு அர்த்தம் உண்டு. இந்த நொடி அதை உணர்த்துகிறது.",
            minimal: "எளிமை.",
            descriptive: "அழகான வண்ணங்கள் மற்றும் துல்லியமான அமைப்புகளின் அற்புதம்.",
            poetic: "அந்தோ! மாலை நேரத்து பொன் வானம் தரும் பேரமைதி.",
            professional: "தொழில்முறை ஒழுக்கமும் கடின உழைப்பும் என்றும் வெற்றியைத் தரும்."
        }
    };

    const targetLang = translations[language] || translations.english;
    let baseText = targetLang[style] || targetLang.conversational;

    // Incorporate context if typed in by the user
    if (context && context.trim().length > 0) {
        if (language === 'english') baseText = `Reflecting on [${context.trim()}]. ${baseText}`;
        else if (language === 'hindi') baseText = `[${context.trim()}] के बारे में सोचते हुए। ${baseText}`;
        else if (language === 'bengali') baseText = `[${context.trim()}] নিয়ে ভাবছিলাম। ${baseText}`;
        else if (language === 'tamil') baseText = `[${context.trim()}] பற்றிய எண்ணங்கள். ${baseText}`;
    }

    let caption = `[${platform.toUpperCase()} - ${tone.toUpperCase()}] ${baseText}`;

    if (length === 'long') {
        caption += ' ' + (language === 'english' ? "This represents the hard work, consistency, and alignment of vision needed daily." : "इसके लिए निरंतरता और सही दिशा की आवश्यकता होती है।");
    } else if (length === 'medium') {
        caption += ' ' + (language === 'english' ? "Grateful for the journey." : "इस खूबसूरत सफर का आभारी हूँ।");
    }

    if (emojis) {
        const emojiList = ['✨', '📸', '🔥', '🌟', '💫', '🙌', '🎯'];
        const randomEmojis = emojiList.sort(() => 0.5 - Math.random()).slice(0, 3).join(' ');
        caption += ' ' + randomEmojis;
    }

    if (hashtags) {
        const hashtagList = [`#${platform}`, `#${style}`, `#${tone}`, '#photography', '#vibes', '#instagood'];
        const randomHashtags = hashtagList.sort(() => 0.5 - Math.random()).slice(0, 4).join(' ');
        caption += '\n\n' + randomHashtags;
    }

    return caption;
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
    const language = document.getElementById('captionLanguage').value;
    const length = document.getElementById('captionLength').value;
    const includeEmojis = document.getElementById('includeEmojis').checked;
    const includeHashtags = document.getElementById('includeHashtags').checked;
    const context = document.getElementById('captionContext').value;

    setTimeout(() => {
        const mockCaption = generateMockCaption(platform, style, tone, language, length, includeEmojis, includeHashtags, context);
        currentCaption = mockCaption;
        captionContent.innerHTML = `<p>${currentCaption.replace(/\n/g, '<br>')}</p>`;
        addToHistory(currentImage, currentCaption);
    }, 500);
}

function clearCaption() {
    document.getElementById('captionContent').innerHTML = '<p class="placeholder-text">No caption yet. Upload an image to get started.</p>';
    currentCaption = '';
    document.getElementById('captionContext').value = '';
}

function copyCaption() {
    if (!currentCaption) {
        alert('No caption to copy!');
        return;
    }

    navigator.clipboard.writeText(currentCaption).then(() => {
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" stroke-width="2"/></svg> Copied!';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    });
}

function downloadCaption() {
    if (!currentCaption) {
        alert('No caption to download!');
        return;
    }

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

// ===== HISTORY HANDLING =====
function createThumbnail(base64Image, maxWidth = 200) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const scale = maxWidth / img.width;
            const canvas = document.createElement('canvas');
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = base64Image;
    });
}

async function addToHistory(image, caption) {
    const thumbnail = await createThumbnail(image);
    const historyItem = {
        id: Date.now(),
        thumbnail: thumbnail,
        caption: caption,
        date: new Date().toLocaleString()
    };
    historyData.unshift(historyItem);
    if (historyData.length > 12) historyData = historyData.slice(0, 12);
    localStorage.setItem('captionHistory', JSON.stringify(historyData));
    renderHistory();
}

function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    generateBtn.disabled = true;
});
