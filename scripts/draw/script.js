// --- VARIÁVEIS GLOBAIS ---
const N = 64; // Número de pontos para reamostragem (normalização)
const T = 0.35; // Limite (Threshold) para WIN.

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

let isDrawing = false;
let currentStroke = []; // Armazena a série de pontos (x, y)

// --- FORMA ALVO: CORAÇÃO --- 
// Traço contínuo: Começa na ponta inferior, sobe e contorna as duas "curvas" superiores
const TargetStroke = [
    { x: 150, y: 250 }, // Ponta inferior
    { x: 180, y: 220 },
    { x: 220, y: 180 },
    { x: 230, y: 150 },
    { x: 230, y: 120 },
    { x: 210, y: 100 },
    { x: 180, y: 100 },
    { x: 150, y: 130 }, // Vale do centro
    { x: 120, y: 100 },
    { x: 90, y: 100 },
    { x: 70, y: 120 },
    { x: 70, y: 150 },
    { x: 80, y: 180 },
    { x: 120, y: 220 },
    { x: 150, y: 250 } // Volta para a ponta inferior
];

// ... (O restante do seu código JavaScript, incluindo as funções de captura e o $1 Recognizer, continua aqui)

// --- FUNÇÕES DE CAPTURA DO DESENHO ---

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
// Adicione listeners 'touchstart', 'touchmove', 'touchend' para touch

function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    // Normaliza as coordenadas para dentro do canvas
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    currentStroke = [];
    const p = getPoint(e);
    currentStroke.push(p);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    statusDiv.textContent = "Desenhando...";
}

function draw(e) {
    if (!isDrawing) return;
    const p = getPoint(e);
    currentStroke.push(p);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();

    if (currentStroke.length > 5) { // Mínimo de pontos para ser um traço válido
        checkMatch(currentStroke, TargetStroke);
    } else {
        statusDiv.textContent = "Desenho muito curto. Tente novamente.";
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentStroke = [];
    statusDiv.textContent = "Desenhe aqui!";
}


// --- LÓGICA DO $1 RECOGNIZER SIMPLIFICADA (Normalização e Comparação) ---

// Distância entre dois pontos
function distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// 1. Reamostragem: Normaliza o número de pontos do traço para N
function resample(points) {
    const I = pathLength(points) / (N - 1); // Comprimento do intervalo
    let D = 0.0;
    const newPoints = [{...points[0]}]; // Começa com o primeiro ponto

    for (let i = 1; i < points.length; i++) {
        const d = distance(points[i - 1], points[i]);
        if ((D + d) >= I) {
            const qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x);
            const qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y);
            newPoints.push({ x: qx, y: qy });
            points.splice(i, 0, { x: qx, y: qy }); // Insere o novo ponto no original para continuar
            D = 0.0;
        } else {
            D += d;
        }
    }

    // Garante que haja N pontos se o path for longo o suficiente
    while (newPoints.length < N) {
        newPoints.push({...points[points.length - 1]});
    }
    return newPoints.slice(0, N);
}

// 2. Normalização de escala e translação
function normalize(points) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.max(width, height) / 200; // Normaliza para um quadrado de 200x200
    const centroidX = (minX + maxX) / 2;
    const centroidY = (minY + maxY) / 2;

    const newPoints = [];
    for (const p of points) {
        // 1. Escala
        const scaledX = p.x / scale;
        const scaledY = p.y / scale;
        // 2. Translação (move para o centro)
        newPoints.push({
            x: scaledX - centroidX / scale + 100, // +100 para centralizar no novo 'canvas' de 200x200
            y: scaledY - centroidY / scale + 100
        });
    }
    return newPoints;
}

// 3. Comparação: Calcula a distância mínima com rotações
function distanceAtBestFit(P, T) {
    // P = Traço do Usuário (User), T = Traço Alvo (Target)
    const NUM_ROTATIONS = 45; // Testar 45 rotações (de -45° a +45°)

    let minDistance = Infinity;
    const delta = 2.0 * Math.PI / 180.0; // 2 graus de incremento (aproximadamente 0.0349 rad)
    const range = 45.0 * Math.PI / 180.0; // 45 graus de tolerância

    // Função para rotacionar um ponto
    function rotatePoint(p, angle, origin) {
        const x = p.x - origin.x;
        const y = p.y - origin.y;
        return {
            x: x * Math.cos(angle) - y * Math.sin(angle) + origin.x,
            y: x * Math.sin(angle) + y * Math.cos(angle) + origin.y,
        };
    }

    // Encontrar o centro (centroid) da forma P para a rotação
    const centroid = {
        x: P.reduce((sum, p) => sum + p.x, 0) / P.length,
        y: P.reduce((sum, p) => sum + p.y, 0) / P.length,
    };

    for (let i = -NUM_ROTATIONS; i <= NUM_ROTATIONS; i++) {
        const angle = i * delta;
        const rotatedP = P.map(p => rotatePoint(p, angle, centroid));
        const currentDistance = pathDistance(rotatedP, T);
        minDistance = Math.min(minDistance, currentDistance);
    }
    return minDistance;
}

// Comprimento total do traço
function pathLength(points) {
    let d = 0;
    for (let i = 1; i < points.length; i++) {
        d += distance(points[i - 1], points[i]);
    }
    return d;
}

// Distância total entre dois traços normalizados (soma das distâncias ponto a ponto)
function pathDistance(P, T) {
    let d = 0;
    for (let i = 0; i < P.length; i++) {
        d += distance(P[i], T[i]);
    }
    return d / P.length; // Retorna a distância média por ponto
}


// --- FUNÇÃO PRINCIPAL DE CHECAGEM ---
function checkMatch(userStroke, targetStroke) {
    // 1. Normalizar o desenho do usuário
    const normalizedUser = normalize(resample(userStroke));

    // 2. Normalizar o desenho alvo (precisa ser feito apenas uma vez na vida real)
    const normalizedTarget = normalize(resample(targetStroke));

    // 3. Comparar o traço do usuário com o alvo, testando as melhores rotações
    const score = distanceAtBestFit(normalizedUser, normalizedTarget);

    // Calculamos o erro normalizado em relação ao tamanho normalizado
    const normalizedError = score / 200; // 200 é o tamanho do quadrado de normalização

    console.log("Score (Distância Média):", score.toFixed(2));
    console.log("Erro Normalizado:", normalizedError.toFixed(3));
    console.log("Threshold (Limite):", T);

    if (normalizedError < T) {
        statusDiv.textContent = `✅ WIN! Similaridade alcançada!`;
        statusDiv.style.color = 'green';
    } else {
        statusDiv.textContent = `❌ FAIL! Erro: ${(normalizedError * 100).toFixed(1)}%. Tente desenhar o tridente em um único traço!`;
        statusDiv.style.color = 'red';
    }
}