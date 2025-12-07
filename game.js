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
    maxSpeed: 35,
    baseSpeed: 15,
    time: 0,
    correctChoices: 0,
    totalStations: 5,
    currentStation: 0,
    speedBoost: 0,
    gameOver: false
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
    // PRE-RACE (pred zavodem)
    preRace: [
        { name: "ENERVIT PRE SPORT", desc: "Energie pred vykonem", correct: true, boost: 1.2 },
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace po vykonu", correct: false, boost: 0.5 },
        { name: "ENERVIT PROTEIN BAR", desc: "Proteinova tycinka", correct: false, boost: 0.7 }
    ],
    // DURING RACE - early (0-20km)
    earlyRace: [
        { name: "ENERVIT GEL", desc: "Rychla energie", correct: true, boost: 1.3 },
        { name: "ENERVIT ISOTONIC", desc: "Izotonicka doplnek", correct: true, boost: 1.2 },
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace po vykonu", correct: false, boost: 0.4 }
    ],
    // DURING RACE - mid (20-35km)
    midRace: [
        { name: "ENERVIT GEL COMPETITION", desc: "Soutezni gel s kofeinem", correct: true, boost: 1.4 },
        { name: "ENERVIT CARBO BAR", desc: "Sacharidova tycinka", correct: true, boost: 1.2 },
        { name: "ENERVIT PROTEIN SHAKE", desc: "Proteinovy napoj", correct: false, boost: 0.6 }
    ],
    // DURING RACE - late (35-50km)
    lateRace: [
        { name: "ENERVIT GEL + KOFEIN", desc: "Energie s kofeinem", correct: true, boost: 1.5 },
        { name: "ENERVIT SPORT GEL", desc: "Sportovni gel", correct: true, boost: 1.3 },
        { name: "ENERVIT RECOVERY DRINK", desc: "Regeneracni napoj", correct: false, boost: 0.5 }
    ],
    // POST RACE (po zavode)
    postRace: [
        { name: "ENERVIT AFTER SPORT", desc: "Regenerace po vykonu", correct: true, boost: 1.0 },
        { name: "ENERVIT R2 SPORT", desc: "Kompletni regenerace", correct: true, boost: 1.0 },
        { name: "ENERVIT PRE SPORT", desc: "Pred vykonem", correct: false, boost: 0.3 }
    ]
};

// Station positions (km)
const stationPositions = [5, 15, 25, 35, 45];
const stationPhases = ['preRace', 'earlyRace', 'midRace', 'lateRace', 'postRace'];

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

    // Check for stations
    track.stations.forEach((station, index) => {
        if (!station.triggered && gameState.distance >= station.km - 0.1 && gameState.distance <= station.km + 0.5) {
            station.triggered = true;
            gameState.currentStation = index;
            showNutritionPopup(station.phase, index);
        }
    });

    // Check win/lose
    if (gameState.distance >= 50) {
        endGame(true);
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

    // Station info
    const stationNames = [
        'START - Pred zavodem',
        'KM 15 - Prvni obcerstveni',
        'KM 25 - Pulka zavodu',
        'KM 35 - Posledni tlak',
        'KM 45 - Pred cilem'
    ];

    document.querySelector('.station-info').textContent = stationNames[stationIndex];

    optionsContainer.innerHTML = '';

    shuffled.forEach(product => {
        const btn = document.createElement('button');
        btn.className = 'nutrition-btn';
        btn.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-desc">${product.desc}</span>
        `;
        btn.onclick = () => selectNutrition(product);
        optionsContainer.appendChild(btn);
    });

    popup.classList.remove('hidden');
}

// Select nutrition
function selectNutrition(product) {
    const popup = document.getElementById('nutrition-popup');
    popup.classList.add('hidden');

    if (product.correct) {
        gameState.correctChoices++;
        gameState.speedBoost += 3;
        gameState.energy = Math.min(100, gameState.energy + 30);

        // Flash green
        flashScreen('#00ff00');
    } else {
        gameState.speedBoost -= 5;
        gameState.energy = Math.max(10, gameState.energy - 20);

        // Flash red
        flashScreen('#ff0000');
    }

    gameState.paused = false;
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

        if (gameState.correctChoices >= 4) {
            message.textContent = 'SKVELE! Jsi nutricni profik!';
        } else if (gameState.correctChoices >= 2) {
            message.textContent = 'Dobre! Priste vyber lepe.';
        } else {
            message.textContent = 'Dosel jsi do cile, ale vyziva nebyla optimalni.';
        }
    } else {
        title.textContent = 'VYSILENI!';
        title.style.color = '#ff0000';
        message.textContent = 'Spatna vyziva te pripravila o energii!';
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
        paused: false,
        distance: 0,
        energy: 100,
        speed: 0,
        maxSpeed: 35,
        baseSpeed: 15,
        time: 0,
        correctChoices: 0,
        totalStations: 5,
        currentStation: 0,
        speedBoost: 0,
        gameOver: false
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
    initTrees();
    initStations();

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
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
