// ENERVIT x JIZERSKA 50 - RETRO GAME
// Tvuj spravny nutricni plan!

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 500;

// Game state
let gameState = {
    running: false,
    paused: false,
    distance: 0,
    energy: 100,
    speed: 0,
    maxSpeed: 25,
    baseSpeed: 8,
    time: 0,
    correctChoices: 0,
    totalStations: 7,
    currentStation: 0,
    speedBoost: 0,
    gameOver: false,
    phase: 'pre' // pre, race, post
};

// Player (skier)
let player = {
    x: 400,
    y: 350,
    width: 40,
    height: 60,
    lane: 1, // 0 = left, 1 = center, 2 = right
    pushing: false,
    pushFrame: 0,
    animFrame: 0
};

// Track properties
let track = {
    offset: 0,
    trees: [],
    stations: [],
    obstacles: []
};

// Enervit nutrition products - spravne pro ruzne faze zavodu
const nutritionProducts = {
    // PRED STARTEM (km 0)
    preStart: [
        { name: "ENERVIT PRE SPORT", desc: "Energie pred vykonem - sacharidy", correct: true, boost: 2 },
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace po vykonu", correct: false, boost: -3 },
        { name: "ENERVIT PROTEIN BAR", desc: "Proteinova tycinka - tezke traveni", correct: false, boost: -1 }
    ],
    // STATION 1 (km 8) - zacatek zavodu
    station1: [
        { name: "ENERVIT ISOTONIC", desc: "Doplneni tekutin a mineralu", correct: true, boost: 2 },
        { name: "ENERVIT GEL", desc: "Rychla energie", correct: true, boost: 1.5 },
        { name: "ENERVIT R2 SPORT", desc: "Regeneracni napoj - prilis brzy!", correct: false, boost: -2 }
    ],
    // STATION 2 (km 16)
    station2: [
        { name: "ENERVIT GEL", desc: "Rychla energie 25g sacharidu", correct: true, boost: 2 },
        { name: "ENERVIT CARBO BAR", desc: "Sacharidova tycinka", correct: true, boost: 1.5 },
        { name: "ENERVIT PROTEIN SHAKE", desc: "Protein - spatne nacasovani", correct: false, boost: -2 }
    ],
    // STATION 3 (km 25) - pulka zavodu
    station3: [
        { name: "ENERVIT GEL COMPETITION", desc: "Gel s kofeinem - boost!", correct: true, boost: 3 },
        { name: "ENERVIT ISOTONIC", desc: "Doplneni mineralu", correct: true, boost: 1.5 },
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace - jeste ne!", correct: false, boost: -3 }
    ],
    // STATION 4 (km 33)
    station4: [
        { name: "ENERVIT GEL + KOFEIN", desc: "Energie + kofein na finish", correct: true, boost: 2.5 },
        { name: "ENERVIT GEL", desc: "Rychla energie", correct: true, boost: 2 },
        { name: "ENERVIT RECOVERY DRINK", desc: "Regenerace - prilis brzy", correct: false, boost: -2 }
    ],
    // STATION 5 (km 42) - posledni obcerstveni
    station5: [
        { name: "ENERVIT GEL COMPETITION", desc: "Posledni davka energie!", correct: true, boost: 3 },
        { name: "ENERVIT SPORT GEL", desc: "Sportovni gel", correct: true, boost: 2 },
        { name: "ENERVIT PROTEIN BAR", desc: "Tezke na zaludek pred cilem", correct: false, boost: -2 }
    ],
    // PO ZAVODE (km 50) - v cili
    postRace: [
        { name: "ENERVIT R2 SPORT", desc: "Kompletni regenerace - SPRAVNE!", correct: true, boost: 0 },
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace po vykonu", correct: true, boost: 0 },
        { name: "ENERVIT PRE SPORT", desc: "Pred vykonem? Uz je po!", correct: false, boost: 0 }
    ]
};

// Station positions (km) - 7 stanic: pred start, 5 behem, po cili
const stationPositions = [0, 8, 16, 25, 33, 42, 50];
const stationPhases = ['preStart', 'station1', 'station2', 'station3', 'station4', 'station5', 'postRace'];
const stationNames = [
    'PRED STARTEM - Priprav se!',
    'KM 8 - Prvni obcerstveni',
    'KM 16 - Tretina zavodu',
    'KM 25 - PULKA ZAVODU!',
    'KM 33 - Posledni tretina',
    'KM 42 - Pred cilem!',
    'CIL! - Regenerace'
];

// Input handling
let keys = {
    left: false,
    right: false,
    space: false
};

// Initialize trees
function initTrees() {
    track.trees = [];
    for (let i = 0; i < 30; i++) {
        track.trees.push({
            x: Math.random() < 0.5 ? Math.random() * 150 : 650 + Math.random() * 150,
            y: Math.random() * 500,
            size: 20 + Math.random() * 30,
            type: Math.floor(Math.random() * 3)
        });
    }
}

// Initialize stations
function initStations() {
    track.stations = [];
    for (let i = 0; i < stationPositions.length; i++) {
        track.stations.push({
            km: stationPositions[i],
            triggered: false,
            phase: stationPhases[i]
        });
    }
}

// Draw pixel tree (retro style)
function drawTree(x, y, size) {
    ctx.fillStyle = '#004000';
    // Triangle tree
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size/2, y);
    ctx.lineTo(x + size/2, y);
    ctx.closePath();
    ctx.fill();

    // Second layer
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.7);
    ctx.lineTo(x - size/2.5, y - size * 0.2);
    ctx.lineTo(x + size/2.5, y - size * 0.2);
    ctx.closePath();
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#4a2800';
    ctx.fillRect(x - 4, y, 8, 15);
}

// Draw pixel skier
function drawSkier() {
    const x = player.x;
    const y = player.y;

    // Animation based on pushing
    const lean = player.pushing ? Math.sin(player.pushFrame * 0.5) * 5 : 0;

    // Skis
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(x - 25 + lean, y + 25, 50, 6);
    ctx.fillRect(x - 23 + lean, y + 27, 46, 2);

    // Legs
    ctx.fillStyle = '#000080';
    ctx.fillRect(x - 8, y + 5, 6, 22);
    ctx.fillRect(x + 2, y + 5, 6, 22);

    // Body
    ctx.fillStyle = '#ff6600'; // Enervit orange!
    ctx.fillRect(x - 10, y - 15, 20, 22);

    // Enervit logo on chest (simple E)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, y - 12, 10, 2);
    ctx.fillRect(x - 5, y - 12, 2, 15);
    ctx.fillRect(x - 5, y - 5, 8, 2);
    ctx.fillRect(x - 5, y + 1, 10, 2);

    // Arms with poles
    ctx.fillStyle = '#ffcc99';
    const armAngle = player.pushing ? Math.sin(player.pushFrame * 0.5) * 15 : 0;

    // Left arm
    ctx.fillRect(x - 18 - armAngle, y - 10, 10, 5);
    // Right arm
    ctx.fillRect(x + 8 + armAngle, y - 10, 10, 5);

    // Poles
    ctx.fillStyle = '#333333';
    ctx.fillRect(x - 22 - armAngle, y - 12, 2, 45);
    ctx.fillRect(x + 20 + armAngle, y - 12, 2, 45);

    // Head
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(x - 6, y - 28, 12, 12);

    // Helmet
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(x - 8, y - 32, 16, 8);

    // Goggles
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 5, y - 24, 10, 4);
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(x - 4, y - 23, 3, 2);
    ctx.fillRect(x + 1, y - 23, 3, 2);
}

// Draw track
function drawTrack() {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 200);
    skyGradient.addColorStop(0, '#87ceeb');
    skyGradient.addColorStop(1, '#b0e0e6');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, 200);

    // Mountains in background
    ctx.fillStyle = '#a0a0c0';
    drawMountain(100, 200, 150);
    drawMountain(300, 200, 200);
    drawMountain(550, 200, 180);
    drawMountain(700, 200, 120);

    // Snow/ground
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 200, canvas.width, 300);

    // Track lanes (classic cross-country tracks)
    ctx.fillStyle = '#e0e8f0';
    ctx.fillRect(200, 200, 400, 300);

    // Track lines
    ctx.strokeStyle = '#c0c8d0';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(250 + i * 100, 200);
        ctx.lineTo(250 + i * 100, 500);
        ctx.stroke();
    }

    // Moving track marks (illusion of movement)
    ctx.fillStyle = '#d0d8e0';
    for (let i = 0; i < 20; i++) {
        const markY = ((track.offset + i * 30) % 350) + 150;
        ctx.fillRect(220, markY, 360, 4);
    }

    // Trees on sides
    track.trees.forEach(tree => {
        const treeY = ((tree.y + track.offset * 0.5) % 600) - 50;
        drawTree(tree.x, treeY, tree.size);
    });

    // Jizerka sign
    if (gameState.distance > 0 && gameState.distance < 2) {
        drawSign(650, 150, "JIZERSKA 50");
    }

    // Distance markers
    const markerKm = Math.floor(gameState.distance / 5) * 5;
    if (markerKm > 0 && markerKm <= 50) {
        const markerY = 300 - ((gameState.distance % 5) / 5) * 100;
        if (markerY > 100 && markerY < 400) {
            drawKmMarker(700, markerY, markerKm);
        }
    }
}

// Draw mountain
function drawMountain(x, baseY, height) {
    ctx.beginPath();
    ctx.moveTo(x - height, baseY);
    ctx.lineTo(x, baseY - height);
    ctx.lineTo(x + height, baseY);
    ctx.closePath();
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - height * 0.3, baseY - height * 0.6);
    ctx.lineTo(x, baseY - height);
    ctx.lineTo(x + height * 0.3, baseY - height * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a0a0c0';
}

// Draw sign
function drawSign(x, y, text) {
    ctx.fillStyle = '#4a2800';
    ctx.fillRect(x - 2, y, 8, 60);

    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x - 60, y - 5, 120, 30);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 60, y - 5, 120, 30);

    ctx.fillStyle = '#000080';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y + 15);
}

// Draw km marker
function drawKmMarker(x, y, km) {
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(x - 25, y - 15, 50, 30);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 25, y - 15, 50, 30);

    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(km + 'km', x, y + 5);
}

// Draw Enervit station approaching
function drawApproachingStation(stationKm) {
    const distToStation = stationKm - gameState.distance;
    if (distToStation > 0 && distToStation < 1) {
        const stationY = 100 + (1 - distToStation) * 200;

        // Station tent
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(400, stationY - 60);
        ctx.lineTo(300, stationY);
        ctx.lineTo(500, stationY);
        ctx.closePath();
        ctx.fill();

        // ENERVIT text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('ENERVIT', 400, stationY - 20);

        // Station banner
        ctx.fillStyle = '#000080';
        ctx.fillRect(320, stationY - 5, 160, 20);
        ctx.fillStyle = '#ffff00';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('NUTRITION STATION', 400, stationY + 8);
    }
}

// Update game
function update(deltaTime) {
    if (!gameState.running || gameState.paused) return;

    // Update time
    gameState.time += deltaTime;

    // Player movement (lanes)
    const targetX = 300 + player.lane * 100;
    player.x += (targetX - player.x) * 0.1;

    // Pushing mechanics
    if (player.pushing) {
        player.pushFrame++;
        if (player.pushFrame > 20) {
            player.pushing = false;
            player.pushFrame = 0;
        }
    }

    // Speed calculation
    let targetSpeed = gameState.baseSpeed + gameState.speedBoost;

    if (player.pushing) {
        targetSpeed += 8;
    }

    // Energy affects speed
    targetSpeed *= (gameState.energy / 100);

    gameState.speed += (targetSpeed - gameState.speed) * 0.05;
    gameState.speed = Math.max(0, Math.min(gameState.maxSpeed, gameState.speed));

    // Distance
    gameState.distance += (gameState.speed / 3600) * deltaTime;

    // Energy drain
    gameState.energy -= deltaTime * 0.005 * (gameState.speed / 20);
    gameState.energy = Math.max(0, gameState.energy);

    // Track movement
    track.offset += gameState.speed * 0.1;

    // Check for stations (skip first one - triggered at start)
    track.stations.forEach((station, index) => {
        if (index === 0) return; // Pre-start handled separately
        if (!station.triggered && gameState.distance >= station.km - 0.3 && gameState.distance <= station.km + 0.5) {
            station.triggered = true;
            gameState.currentStation = index;
            showNutritionPopup(station.phase, index);
        }
    });

    // Update feedback timer
    if (feedbackTimer > 0) {
        feedbackTimer -= deltaTime;
    }

    if (gameState.energy <= 0) {
        endGame(false);
    }

    // Update HUD
    updateHUD();
}

// Show nutrition popup
function showNutritionPopup(phase, stationIndex) {
    gameState.paused = true;

    const popup = document.getElementById('nutrition-popup');
    const optionsContainer = document.getElementById('nutrition-options');

    // Get products for this phase
    const products = nutritionProducts[phase];

    // Shuffle products
    const shuffled = [...products].sort(() => Math.random() - 0.5);

    document.querySelector('.station-info').textContent = stationNames[stationIndex];

    optionsContainer.innerHTML = '';

    shuffled.forEach(product => {
        const btn = document.createElement('button');
        btn.className = 'nutrition-btn';
        btn.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-desc">${product.desc}</span>
        `;
        btn.onclick = () => selectNutrition(product, stationIndex);
        optionsContainer.appendChild(btn);
    });

    popup.classList.remove('hidden');
}

// Select nutrition
function selectNutrition(product, stationIndex) {
    const popup = document.getElementById('nutrition-popup');
    popup.classList.add('hidden');

    if (product.correct) {
        gameState.correctChoices++;
        gameState.speedBoost += product.boost;
        gameState.energy = Math.min(100, gameState.energy + 25);

        // Flash green
        flashScreen('#00ff00');
        showFeedback('SPRAVNA VOLBA! +' + product.boost + ' rychlost', '#00ff00');
    } else {
        gameState.speedBoost += product.boost; // boost is negative for wrong choices
        gameState.energy = Math.max(10, gameState.energy - 15);

        // Flash red
        flashScreen('#ff0000');
        showFeedback('SPATNA VOLBA! ' + product.boost + ' rychlost', '#ff0000');
    }

    // Posledna stanica = koniec hry
    if (stationIndex === 6) {
        setTimeout(() => endGame(true), 1000);
    } else {
        gameState.paused = false;
    }
}

// Show feedback text
let feedbackText = '';
let feedbackColor = '';
let feedbackTimer = 0;

function showFeedback(text, color) {
    feedbackText = text;
    feedbackColor = color;
    feedbackTimer = 2000; // 2 sekundy
}

// Flash screen effect
function flashScreen(color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    setTimeout(() => {
        // Will be cleared on next draw
    }, 100);
}

// Update HUD
function updateHUD() {
    document.getElementById('distance').textContent = gameState.distance.toFixed(1);
    document.getElementById('speed').textContent = Math.round(gameState.speed);
    document.getElementById('energy-fill').style.width = gameState.energy + '%';

    const minutes = Math.floor(gameState.time / 60000);
    const seconds = Math.floor((gameState.time % 60000) / 1000);
    document.getElementById('time').textContent =
        minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

// End game
function endGame(won) {
    gameState.running = false;
    gameState.gameOver = true;

    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');

    const title = document.getElementById('end-title');
    const message = document.getElementById('end-message');

    if (won) {
        title.textContent = 'CILOVA CARA!';
        title.style.color = '#00ff00';

        if (gameState.correctChoices >= 6) {
            message.textContent = 'PERFEKTNI! Jsi nutricni mistr Jizerske 50!';
        } else if (gameState.correctChoices >= 4) {
            message.textContent = 'SKVELE! Mas dobre znalosti vyzivove strategie!';
        } else if (gameState.correctChoices >= 2) {
            message.textContent = 'Dobre! Priste vyber lepe - spravna vyziva = lepsi cas!';
        } else {
            message.textContent = 'Dosel jsi do cile, ale vyziva byla katastrofa!';
        }
    } else {
        title.textContent = 'VYSILENI!';
        title.style.color = '#ff0000';
        message.textContent = 'Spatna vyziva te pripravila o energii! Naucse spravne doplnovat!';
    }

    const minutes = Math.floor(gameState.time / 60000);
    const seconds = Math.floor((gameState.time % 60000) / 1000);
    document.getElementById('final-time').textContent =
        minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    document.getElementById('correct-choices').textContent = gameState.correctChoices;
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTrack();

    // Draw approaching stations
    track.stations.forEach(station => {
        if (!station.triggered) {
            drawApproachingStation(station.km);
        }
    });

    drawSkier();

    // Draw energy warning
    if (gameState.energy < 30) {
        ctx.fillStyle = '#ff0000';
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.01) * 0.2;
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('! NIZKA ENERGIE !', canvas.width / 2, 50);
        ctx.globalAlpha = 1;
    }

    // Draw feedback text
    if (feedbackTimer > 0) {
        ctx.fillStyle = feedbackColor;
        ctx.globalAlpha = Math.min(1, feedbackTimer / 500);
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(feedbackText, canvas.width / 2, 80);
        ctx.globalAlpha = 1;
    }

    // Draw current speed boost indicator
    if (gameState.speedBoost !== 0) {
        ctx.fillStyle = gameState.speedBoost > 0 ? '#00ff00' : '#ff0000';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'right';
        const boostText = gameState.speedBoost > 0 ? '+' + gameState.speedBoost.toFixed(1) : gameState.speedBoost.toFixed(1);
        ctx.fillText('BOOST: ' + boostText, canvas.width - 20, 480);
    }
}

// Game loop
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (gameState.running) {
        update(deltaTime);
        draw();
    }

    requestAnimationFrame(gameLoop);
}

// Input handlers
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        keys.left = true;
        player.lane = Math.max(0, player.lane - 1);
    }
    if (e.code === 'ArrowRight') {
        keys.right = true;
        player.lane = Math.min(2, player.lane + 1);
    }
    if (e.code === 'Space') {
        if (!keys.space && !player.pushing && gameState.running && !gameState.paused) {
            player.pushing = true;
            player.pushFrame = 0;
        }
        keys.space = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.space = false;
});

// Start game
function startGame() {
    gameState = {
        running: true,
        paused: true, // Start paused for pre-race nutrition
        distance: 0,
        energy: 80, // Start with less energy - need good nutrition!
        speed: 0,
        maxSpeed: 25,
        baseSpeed: 8,
        time: 0,
        correctChoices: 0,
        totalStations: 7,
        currentStation: 0,
        speedBoost: 0,
        gameOver: false,
        phase: 'pre'
    };

    player = {
        x: 400,
        y: 350,
        width: 40,
        height: 60,
        lane: 1,
        pushing: false,
        pushFrame: 0,
        animFrame: 0
    };

    track.offset = 0;
    feedbackText = '';
    feedbackTimer = 0;
    initTrees();
    initStations();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    // Show pre-start nutrition selection immediately
    track.stations[0].triggered = true;
    setTimeout(() => {
        showNutritionPopup('preStart', 0);
    }, 500);
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// Initialize
initTrees();
initStations();
requestAnimationFrame(gameLoop);

console.log('ENERVIT x JIZERSKA 50 - Hra nactena!');
console.log('Ovladani: SIPKY = smer, MEZERNIK = odraz');
