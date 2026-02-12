// ============================================
// MUSIC CONTROL
// ============================================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.querySelector('.music-icon');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(err => console.log('Audio play failed:', err));
        musicIcon.textContent = '🔊';
        isMusicPlaying = true;
    }
});

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 8 + 's';
            heart.style.fontSize = (15 + Math.random() * 15) + 'px';
            container.appendChild(heart);
        }, i * 200);
    }
}
createFloatingHearts();

// ============================================
// ENVELOPE OPENING
// ============================================
const envelopeStage = document.getElementById('envelopeStage');
const envelope = document.getElementById('envelope');
const puzzleContainer = document.getElementById('puzzleContainer');
const puzzleView = document.getElementById('puzzleView');

envelope.addEventListener('click', () => {
    // Try to start music on first interaction
    if (!isMusicPlaying) {
        bgMusic.play().then(() => {
            musicIcon.textContent = '🔊';
            isMusicPlaying = true;
        }).catch(err => console.log('Audio play failed:', err));
    }

    envelope.style.pointerEvents = 'none';
    const heart = envelope.querySelector('.envelope-heart');
    heart.classList.add('hidden');
    
    setTimeout(() => {
        envelope.classList.add('opening');
        setTimeout(() => {
            envelopeStage.classList.add('envelope-stage-fade-out');
            setTimeout(() => {
                envelopeStage.style.display = 'none';
                document.body.classList.add('show-modal');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => puzzleView.classList.add('visible'));
                });
            }, 450);
        }, 700);
    }, 380);
});

// ============================================
// PUZZLE GAME
// ============================================
const puzzleGrid = document.getElementById('puzzleGrid');
const moveCounter = document.getElementById('moveCounter');

let tiles = [];
let moveCount = 0;

const EMPTY_PIECE = 3;
const solution = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let currentState = [...solution];

function initPuzzle() {
    scramblePuzzle();
    renderPuzzle();
    moveCount = 0;
    updateMoveCounter();
}

function scramblePuzzle() {
    for (let i = 0; i < 50; i++) {
        const emptyIndex = currentState.indexOf(EMPTY_PIECE);
        const validMoves = getValidMoves(emptyIndex);
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        [currentState[emptyIndex], currentState[randomMove]] = [currentState[randomMove], currentState[emptyIndex]];
    }
}

function getValidMoves(emptyIndex) {
    const validMoves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    
    if (row > 0) validMoves.push(emptyIndex - 3);
    if (row < 2) validMoves.push(emptyIndex + 3);
    if (col > 0) validMoves.push(emptyIndex - 1);
    if (col < 2) validMoves.push(emptyIndex + 1);
    
    return validMoves;
}

function renderPuzzle() {
    puzzleGrid.innerHTML = '';
    tiles = [];
    
    currentState.forEach((piece, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        
        if (piece === EMPTY_PIECE) {
            tile.classList.add('empty');
        } else {
            tile.style.backgroundImage = `url('images/tile-${piece}.png')`;
            tile.onclick = () => moveTile(index);
        }
        
        puzzleGrid.appendChild(tile);
        tiles.push(tile);
    });
}

function updateMoveCounter() {
    moveCounter.textContent = `Moves: ${moveCount}`;
}

function moveTile(index) {
    const emptyIndex = currentState.indexOf(EMPTY_PIECE);
    const validMoves = getValidMoves(emptyIndex);
    
    if (validMoves.includes(index)) {
        [currentState[emptyIndex], currentState[index]] = [currentState[index], currentState[emptyIndex]];
        moveCount++;
        updateMoveCounter();
        renderPuzzle();
        
        if (isPuzzleSolved()) {
            setTimeout(onPuzzleSolved, 300);
        }
    }
}

function isPuzzleSolved() {
    return currentState.every((tile, index) => tile === solution[index]);
}

function onPuzzleSolved() {
    const puzzleGameContainer = document.getElementById('puzzleGameContainer');
    const puzzleGridWrap = document.getElementById('puzzleGridWrap');
    const puzzleRevealText = document.getElementById('puzzleRevealText');
    const puzzleFullImageOverlay = document.getElementById('puzzleFullImageOverlay');
    const emptyTile = puzzleGrid.querySelector('.puzzle-tile.empty');
    
    if (emptyTile) emptyTile.style.backgroundImage = "url('images/tile-3.png')";
    puzzleGameContainer.classList.add('completed');
    puzzleGrid.classList.add('merging');
    
    // Celebration sparkles
    createCelebrationSparkles();
    
    setTimeout(() => {
        puzzleFullImageOverlay.classList.add('show');
        setTimeout(() => {
            puzzleGridWrap.classList.add('revealing');
            puzzleRevealText.classList.add('show');
        }, 250);
    }, 280);
}

function createCelebrationSparkles() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
            const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
            createSparkles(x, y);
        }, i * 50);
    }
}

function createSparkles(x, y) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = x + (Math.random() - 0.5) * 50 + 'px';
            sparkle.style.top = y + (Math.random() - 0.5) * 50 + 'px';
            sparkle.style.background = ['#f093fb', '#f5576c', '#ffd700'][Math.floor(Math.random() * 3)];
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }, i * 50);
    }
}

initPuzzle();

// ============================================
// TRANSITION TO SUCCESS PAGE
// ============================================
const yesBtn = document.getElementById('yesBtn');
const successPage = document.getElementById('successPage');

yesBtn.addEventListener('click', () => {
    runConfettiFor(10000);
    
    // Hide puzzle container and show success page
    puzzleContainer.style.display = 'none';
    successPage.classList.add('active');
    
    // Start countdown
    startCountdown();
});

// ============================================
// CONFETTI EFFECT
// ============================================
function runConfettiFor(ms) {
    const end = Date.now() + ms;
    function tick() {
        if (Date.now() < end) {
            createConfetti();
            setTimeout(tick, 80);
        }
    }
    tick();
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.background = ['#f093fb', '#f5576c', '#ffd700', '#4facfe', '#FFDAE9'][Math.floor(Math.random() * 5)];
    const duration = 2 + Math.random() * 2;
    confetti.style.animation = `confetti-fall ${duration}s linear`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), (duration + 0.5) * 1000);
}

// ============================================
// MEMORY GALLERY INTERACTIVE
// ============================================
const photoCards = document.querySelectorAll('.photo-card');
const memories = [
    'The most stressful Korean dinner ever',
    'First birthday treat with my beautiful girlfriend',
    '1 YEAR AGO! My first valentine ;)',
    'Best date ever at Chester Zoo',
    'Wow, 1 year together',
    'Magical Winter Wonderland',
];

photoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (!card.classList.contains('revealed')) {
            card.classList.add('revealed');
            const caption = card.querySelector('.photo-caption');
            
            caption.textContent = memories[index];
            
            // Sparkle effect
            const rect = card.getBoundingClientRect();
            createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2 + window.scrollY);
        }
    });
});

// ============================================
// WISH HEART INTERACTIVE
// ============================================
const wishHeart = document.getElementById('wishHeart');
const wishMessage = document.getElementById('wishMessage');

const wishes = [
    'To a lifetime as each others chimmy! 🥰',
    'May we always and forever be each other\'s number 1 👩‍❤️‍👨',
    'Wishing for more cuddles and less oots! 🤢',
    'To forever ordering McDonalds at 1AM! 🍔',
    'May our love grow stronger with each passing day 🌹',
    'Here\'s to always predicting what we\'re about to say ❤️',
    'To forever being each other\'s home 🏡',
    'Wishing a million more dinner dates staring into each others\' eyes 🥺'
];

wishHeart.addEventListener('click', () => {
    wishHeart.classList.add('wished');
    
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    wishMessage.textContent = randomWish;
    wishMessage.classList.add('show');
    
    // Create burst of sparkles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100;
            const x = window.innerWidth / 2 + Math.cos(angle) * distance;
            const y = wishHeart.getBoundingClientRect().top + window.scrollY + Math.sin(angle) * distance;
            createSparkles(x, y);
        }, i * 30);
    }
    
    setTimeout(() => {
        wishHeart.classList.remove('wished');
    }, 600);
});

// ============================================
// COUNTDOWN TIMER
// ============================================
// Set your relationship start date here (YYYY, MM-1, DD)
// Note: Month is 0-indexed (0 = January, 11 = December)
const relationshipStart = new Date(2024, 9, 29); 

function startCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date();
    const diff = now - relationshipStart;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('daysCount').textContent = days;
    document.getElementById('hoursCount').textContent = hours;
    document.getElementById('minutesCount').textContent = minutes;
    document.getElementById('secondsCount').textContent = seconds;
}

// ============================================
// RESET BUTTON
// ============================================
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    window.location.reload();
});