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

// Smooth scroll
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
    });
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const circles = document.querySelectorAll('.circle');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 10;
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// Animate elements on scroll
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

// Global variables
let currentImage = null;
let currentCaption = '';
let historyData = JSON.parse(localStorage.getItem('captionHistory')) || [];

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const previewImage = document.getElementById('previewImage');
const generateBtn = document.getElementById('generateBtn');

// Drag and drop
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

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// Handle image upload
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

// Remove image
function removeImage() {
    currentImage = null;
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    fileInput.value = '';
    generateBtn.disabled = true;
}

// Scroll to generator
function scrollToGenerator() {
    document.getElementById('generator').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Caption templates based on style
const captionTemplates = {
    creative: [
        "✨ Capturing moments that take your breath away 🌟\n\nEvery frame tells a story, and this one speaks volumes about beauty, creativity, and inspiration.\n\n#CreativeVibes #ArtOfPhotography #Inspiration #MomentsCaptured #VisualStorytelling",
        "🎨 Where art meets reality 🌈\n\nThis moment perfectly encapsulates the magic of creativity and the power of visual expression.\n\n#ArtisticVision #CreativeMinds #PhotographyLovers #InspiredDaily #AestheticGoals",
        "🌟 Creating magic one frame at a time ✨\n\nSometimes the most beautiful moments are the ones we capture when we're not looking.\n\n#MagicMoments #CreativeExpression #VisualArt #CapturedBeauty #Inspiration"
    ],
    professional: [
        "Excellence in every detail.\n\nCommitted to delivering outstanding results through dedication, innovation, and professional expertise.\n\n#ProfessionalExcellence #BusinessSuccess #QualityWork #IndustryLeader #ExpertiseMatters",
        "Driving innovation and achieving excellence.\n\nOur commitment to quality and professional standards sets us apart in today's competitive landscape.\n\n#BusinessGrowth #ProfessionalDevelopment #IndustryExperts #SuccessMindset #CorporateExcellence",
        "Elevating standards through professional excellence.\n\nDedicated to providing superior service and innovative solutions that drive measurable results.\n\n#Leadership #ProfessionalServices #BusinessStrategy #Excellence #Innovation"
    ],
    casual: [
        "Just living my best life! 😊\n\nSometimes you gotta stop and appreciate the little things. This moment right here? Pure happiness.\n\n#GoodVibes #LivingMyBestLife #HappyMoments #ChillVibes #Blessed",
        "Another day, another adventure! 🌟\n\nLife's too short not to enjoy every moment. Making memories and loving every second of it!\n\n#DailyAdventures #GoodTimes #MakingMemories #LifeIsGood #EnjoyTheJourney",
        "Feeling grateful for moments like these ❤️\n\nJust me, enjoying life and all the beautiful moments it brings. Stay positive, friends!\n\n#Grateful #PositiveVibes #SimplePleasures #HappyLife #BlessedAndGrateful"
    ],
    funny: [
        "When life gives you lemons, take a selfie and post it! 🍋😂\n\nBecause why not? Everything's funnier when you document it for the internet.\n\n#FunnyMoments #ComedyGold #LaughMore #HumorDaily #MemeMaterial",
        "Plot twist: I have no idea what I'm doing 😅\n\nBut hey, fake it till you make it, right? At least I look good doing it!\n\n#ConfidentlyLost #FunnyLife #RelatableContent #ComedyCentral #KeepItReal",
        "My life is basically a series of awkward moments interrupted by snacks 🍕😂\n\nAnd honestly? I wouldn't have it any other way!\n\n#AwkwardAndProud #FoodieLife #FunnyTruths #ComedyGold #RelatableAF"
    ],
    inspirational: [
        "🌅 Believe in yourself and all that you are ✨\n\nKnow that there is something inside you that is greater than any obstacle. Keep pushing forward!\n\n#Motivation #BelieveInYourself #Inspiration #KeepGoing #SuccessJourney #DreamBig",
        "💪 Your only limit is you 🚀\n\nDream bigger, work harder, and never stop believing in the power of your potential.\n\n#Motivated #InspirationalQuotes #SuccessMindset #AchieveYourDreams #PersonalGrowth",
        "🌟 Every day is a new beginning ☀️\n\nTake a deep breath, smile, and start again. Your journey to greatness begins with a single step.\n\n#NewBeginnings #StayPositive #InspireDaily #GrowthMindset #MotivationMonday"
    ],
    descriptive: [
        "A stunning visual composition that showcases exceptional lighting, balanced composition, and remarkable attention to detail.\n\nThe interplay of colors and textures creates a harmonious aesthetic that draws the viewer's attention.\n\n#Photography #VisualArt #Composition #AestheticPhotography #DetailOriented",
        "This image exemplifies the perfect balance between light and shadow, with careful attention to framing and perspective.\n\nThe composition demonstrates a masterful understanding of visual storytelling and technical execution.\n\n#PhotographyTechnique #VisualComposition #ArtisticDetail #ProfessionalPhotography #VisualNarrative",
        "A carefully crafted visual that highlights exceptional technical skill and artistic vision.\n\nEvery element within the frame contributes to a cohesive and compelling narrative that engages the viewer.\n\n#TechnicalExcellence #ArtisticVision #PhotographySkills #VisualStory #CompositionMatters"
    ]
};

// Generate caption
function generateCaption() {
    if (!currentImage) {
        alert('Please upload an image first!');
        return;
    }

    const style = document.getElementById('captionStyle').value;
    const length = document.getElementById('captionLength').value;
    const includeHashtags = document.getElementById('includeHashtags').checked;
    const includeEmojis = document.getElementById('includeEmojis').checked;

    // Show loading
    const captionContent = document.getElementById('captionContent');
    captionContent.innerHTML = '<div style="text-align: center;"><div class="loading"></div><p style="margin-top: 15px; color: #9ca3af;">Generating your perfect caption...</p></div>';

    // Simulate AI processing
    setTimeout(() => {
        let caption = captionTemplates[style][Math.floor(Math.random() * captionTemplates[style].length)];

        // Adjust length
        if (length === 'short') {
            caption = caption.split('\n\n')[0];
        } else if (length === 'medium') {
            const parts = caption.split('\n\n');
            caption = parts.slice(0, 2).join('\n\n');
        }

        // Remove hashtags if not wanted
        if (!includeHashtags) {
            caption = caption.replace(/#\w+/g, '').trim();
        }

        // Remove emojis if not wanted
        if (!includeEmojis) {
            caption = caption.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
        }

        currentCaption = caption;
        captionContent.innerHTML = `<p>${caption.replace(/\n/g, '<br>')}</p>`;

        // Add to history
        addToHistory(currentImage, caption);
    }, 2000);
}

// Clear caption
function clearCaption() {
    document.getElementById('captionContent').innerHTML = '<p class="placeholder-text">No caption yet. Upload an image to get started.</p>';
    currentCaption = '';
}

// Copy caption
function copyCaption() {
    if (!currentCaption) {
        alert('No caption to copy!');
        return;
    }

    navigator.clipboard.writeText(currentCaption).then(() => {
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!';
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

// Download caption
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

// Add to history
function addToHistory(image, caption) {
    const historyItem = {
        id: Date.now(),
        image: image,
        caption: caption,
        date: new Date().toLocaleString()
    };

    historyData.unshift(historyItem);
    
    // Keep only last 12 items
    if (historyData.length > 12) {
        historyData = historyData.slice(0, 12);
    }

    localStorage.setItem('captionHistory', JSON.stringify(historyData));
    renderHistory();
}

// Render history
function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');

    if (historyData.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">No history yet. Generate your first caption!</p>';
        return;
    }

    historyGrid.innerHTML = historyData.map(item => `
        <div class="history-item" onclick="viewHistoryItem(${item.id})">
            <img src="${item.image}" alt="History" class="history-image">
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

// View history item
function viewHistoryItem(id) {
    const item = historyData.find(h => h.id === id);
    if (item) {
        currentImage = item.image;
        currentCaption = item.caption;
        previewImage.src = item.image;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        document.getElementById('captionContent').innerHTML = `<p>${item.caption.replace(/\n/g, '<br>')}</p>`;
        
        // Scroll to generator
        scrollToGenerator();
    }
}

// Copy history caption
function copyHistoryCaption(id) {
    const item = historyData.find(h => h.id === id);
    if (item) {
        navigator.clipboard.writeText(item.caption);
        alert('Caption copied to clipboard!');
    }
}

// Delete history item
function deleteHistoryItem(id) {
    historyData = historyData.filter(h => h.id !== id);
    localStorage.setItem('captionHistory', JSON.stringify(historyData));
    renderHistory();
}

// Clear all history
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