/**
 * Spell Drawing Recognition System
 * Inspirado no CodePen de ste-vg com reconhecimento $1 Recognizer
 *
 * Símbolos: Círculo, Triângulo, Raio (zigzag)
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
const CONFIG = {
  // Reconhecimento - mais preciso
  numPoints: 96, // Mais pontos = mais precisão
  squareSize: 250, // Tamanho normalizado
  angleRange: Math.PI / 6, // ±30° para rotação (mais restrito)
  anglePrecision: Math.PI / 180, // 1° precisão

  // Thresholds de match - mais rigoroso
  scoreThreshold: 0.82, // Score mínimo para aceitar
  minPoints: 15, // Mínimo de pontos no traço
  minPathLength: 100, // Comprimento mínimo do traço
  minBoundingBox: 40, // Tamanho mínimo da bounding box

  // Trail visual (inspirado no CodePen)
  trailWidth: 5,
  trailGlow: 20,
  trailFadeSpeed: 0.88, // Mais rápido quando solta
  trailMinAlpha: 0.01,
  colors: {
    core: "#fff",
    glowInner: "rgba(100, 180, 255, 1)",
    glowOuter: "rgba(60, 100, 255, 0.5)",
  },
};

// ============================================
// MATEMÁTICA BÁSICA
// ============================================
const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);
const lerp = (a, b, t) => a + (b - a) * t;

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += distance(points[i - 1], points[i]);
  }
  return len;
}

function centroid(points) {
  let x = 0,
    y = 0;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / points.length, y: y / points.length };
}

function boundingBox(points) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

// ============================================
// $1 RECOGNIZER - Normalização
// ============================================

// Reamostra o caminho para N pontos equidistantes
function resample(points, n) {
  const totalLen = pathLength(points);
  if (totalLen === 0) return points.slice(0, 1);

  const interval = totalLen / (n - 1);
  const newPoints = [{ ...points[0] }];
  let D = 0;

  for (let i = 1; i < points.length; i++) {
    const d = distance(points[i - 1], points[i]);
    if (D + d >= interval) {
      const t = (interval - D) / d;
      const q = {
        x: lerp(points[i - 1].x, points[i].x, t),
        y: lerp(points[i - 1].y, points[i].y, t),
      };
      newPoints.push(q);
      points.splice(i, 0, q);
      D = 0;
    } else {
      D += d;
    }
  }

  // Garantir exatamente n pontos
  while (newPoints.length < n) {
    newPoints.push({ ...points[points.length - 1] });
  }

  return newPoints.slice(0, n);
}

// Rotaciona pontos por um ângulo
function rotateBy(points, angle) {
  const c = centroid(points);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map((p) => ({
    x: (p.x - c.x) * cos - (p.y - c.y) * sin + c.x,
    y: (p.x - c.x) * sin + (p.y - c.y) * cos + c.y,
  }));
}

// Calcula o ângulo indicativo (do centróide ao primeiro ponto)
function indicativeAngle(points) {
  const c = centroid(points);
  return Math.atan2(c.y - points[0].y, c.x - points[0].x);
}

// Rotaciona para que o ângulo indicativo seja 0
function rotateToZero(points) {
  const angle = indicativeAngle(points);
  return rotateBy(points, -angle);
}

// Escala para caber em um quadrado de tamanho fixo
function scaleToSquare(points, size) {
  const box = boundingBox(points);
  const scale = size / Math.max(box.width, box.height, 1);
  return points.map((p) => ({
    x: (p.x - box.x) * scale,
    y: (p.y - box.y) * scale,
  }));
}

// Translada para que o centróide fique na origem
function translateToOrigin(points) {
  const c = centroid(points);
  return points.map((p) => ({
    x: p.x - c.x,
    y: p.y - c.y,
  }));
}

// Pipeline completo de normalização
function normalize(points) {
  let pts = resample([...points], CONFIG.numPoints);
  pts = rotateToZero(pts);
  pts = scaleToSquare(pts, CONFIG.squareSize);
  pts = translateToOrigin(pts);
  return pts;
}

// ============================================
// $1 RECOGNIZER - Matching
// ============================================

// Distância média entre dois conjuntos de pontos
function pathDistance(pts1, pts2) {
  let d = 0;
  const n = Math.min(pts1.length, pts2.length);
  for (let i = 0; i < n; i++) {
    d += distance(pts1[i], pts2[i]);
  }
  return d / n;
}

// Distância com rotação específica
function distanceAtAngle(points, template, angle) {
  const rotated = rotateBy(points, angle);
  return pathDistance(rotated, template);
}

// Golden Section Search para encontrar melhor ângulo
function distanceAtBestAngle(points, template) {
  const phi = 0.5 * (-1 + Math.sqrt(5)); // Golden ratio
  let a = -CONFIG.angleRange;
  let b = CONFIG.angleRange;
  let x1 = phi * a + (1 - phi) * b;
  let x2 = (1 - phi) * a + phi * b;
  let f1 = distanceAtAngle(points, template, x1);
  let f2 = distanceAtAngle(points, template, x2);

  while (Math.abs(b - a) > CONFIG.anglePrecision) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = phi * a + (1 - phi) * b;
      f1 = distanceAtAngle(points, template, x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = (1 - phi) * a + phi * b;
      f2 = distanceAtAngle(points, template, x2);
    }
  }

  return Math.min(f1, f2);
}

// Reconhece o gesto comparando com templates
function recognize(points, templates) {
  const halfDiagonal =
    0.5 * Math.sqrt(2 * CONFIG.squareSize * CONFIG.squareSize);
  let bestScore = 0;
  let bestMatch = null;

  for (const template of templates) {
    const d = distanceAtBestAngle(points, template.points);
    const score = 1 - d / halfDiagonal;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = template.name;
    }
  }

  return { name: bestMatch, score: bestScore };
}

// ============================================
// CARREGAMENTO DE TEMPLATES DO SVG
// ============================================
function pathToPoints(pathEl, numSamples) {
  const length = pathEl.getTotalLength();
  const points = [];
  for (let i = 0; i < numSamples; i++) {
    const pt = pathEl.getPointAtLength((i / (numSamples - 1)) * length);
    points.push({ x: pt.x, y: pt.y });
  }
  return points;
}

function loadTemplates() {
  const templates = [];
  const paths = document.querySelectorAll("path[data-spell]");

  for (const path of paths) {
    const name = path.dataset.spell;
    const rawPoints = pathToPoints(path, CONFIG.numPoints * 2);
    const normalizedPoints = normalize(rawPoints);
    templates.push({ name, points: normalizedPoints });
  }

  return templates;
}

// ============================================
// TRAIL RENDERING (Inspirado no CodePen)
// ============================================
class Trail {
  constructor(ctx) {
    this.ctx = ctx;
    this.segments = []; // { x, y, alpha }
    this.isActive = false;
  }

  addPoint(x, y) {
    this.segments.push({ x, y, alpha: 1 });
    this.isActive = true;
  }

  stop() {
    this.isActive = false;
  }

  clear() {
    this.segments = [];
  }

  update() {
    // Só faz fade se NÃO estiver desenhando
    if (this.isActive) return;

    // Fade out dos segmentos apenas quando soltou
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].alpha *= CONFIG.trailFadeSpeed;
      if (this.segments[i].alpha < CONFIG.trailMinAlpha) {
        this.segments.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    if (this.segments.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Desenha segmentos com fade individual
    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i - 1];
      const curr = this.segments[i];
      const alpha = Math.min(prev.alpha, curr.alpha);

      if (alpha < CONFIG.trailMinAlpha) continue;

      // Glow externo
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = CONFIG.colors.glowOuter.replace("0.6", alpha * 0.6);
      ctx.lineWidth = CONFIG.trailWidth + CONFIG.trailGlow;
      ctx.shadowColor = CONFIG.colors.glowInner;
      ctx.shadowBlur = CONFIG.trailGlow;
      ctx.stroke();

      // Glow interno
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = CONFIG.colors.glowInner.replace("1)", `${alpha})`);
      ctx.lineWidth = CONFIG.trailWidth + 4;
      ctx.shadowBlur = CONFIG.trailGlow * 0.5;
      ctx.stroke();

      // Core branco
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = CONFIG.trailWidth;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    // Ponto brilhante na ponta (se ativo)
    if (this.isActive && this.segments.length > 0) {
      const tip = this.segments[this.segments.length - 1];

      // Glow da ponta
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, CONFIG.trailWidth + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120, 200, 255, 0.3)";
      ctx.shadowColor = CONFIG.colors.glowInner;
      ctx.shadowBlur = 30;
      ctx.fill();

      // Centro da ponta
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, CONFIG.trailWidth * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 15;
      ctx.fill();
    }

    ctx.restore();
  }
}

// ============================================
// SPELL CASTER - Classe Principal
// ============================================
class SpellCaster {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.trail = new Trail(this.ctx);

    this.templates = [];
    this.currentPath = [];
    this.isDrawing = false;
    this.collected = new Set();

    this.requiredSpells = ["wave", "infinity", "moon"];
    this.hintIcons = document.querySelectorAll(".icon-wrap[data-spell]");
    this.matchFeedback = document.getElementById("match-feedback");
    this.winBanner = document.getElementById("win-banner");

    this.pixelRatio = window.devicePixelRatio || 1;

    this.setupCanvas();
    this.setupEvents();
    this.startLoop();

    // Carrega templates depois do DOM
    requestAnimationFrame(() => {
      this.templates = loadTemplates();
      console.log(
        "Templates carregados:",
        this.templates.map((t) => t.name)
      );
    });
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.pixelRatio;
    this.canvas.height = rect.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    this.rect = rect;
  }

  setupEvents() {
    this.canvas.addEventListener("pointerdown", this.onStart.bind(this));
    this.canvas.addEventListener("pointermove", this.onMove.bind(this));
    this.canvas.addEventListener("pointerup", this.onEnd.bind(this));
    this.canvas.addEventListener("pointercancel", this.onEnd.bind(this));
    this.canvas.addEventListener("pointerleave", this.onEnd.bind(this));

    window.addEventListener("resize", () => {
      this.setupCanvas();
    });
  }

  getPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  onStart(e) {
    this.isDrawing = true;
    this.currentPath = [];
    this.trail.clear();

    const pt = this.getPoint(e);
    this.currentPath.push(pt);
    this.trail.addPoint(pt.x, pt.y);

    this.canvas.setPointerCapture?.(e.pointerId);
  }

  onMove(e) {
    if (!this.isDrawing) return;

    const pt = this.getPoint(e);

    // Só adiciona se moveu o suficiente (evita pontos duplicados)
    const last = this.currentPath[this.currentPath.length - 1];
    if (distance(last, pt) > 2) {
      this.currentPath.push(pt);
      this.trail.addPoint(pt.x, pt.y);
    }
  }

  onEnd(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.trail.stop();

    this.processGesture();

    this.canvas.releasePointerCapture?.(e.pointerId);
  }

  processGesture() {
    // Validações básicas
    if (this.currentPath.length < CONFIG.minPoints) {
      console.log("Poucos pontos:", this.currentPath.length);
      return;
    }

    const len = pathLength(this.currentPath);
    if (len < CONFIG.minPathLength) {
      console.log("Traço muito curto:", len.toFixed(0));
      return;
    }

    const box = boundingBox(this.currentPath);
    if (Math.max(box.width, box.height) < CONFIG.minBoundingBox) {
      console.log("Bounding box muito pequena");
      return;
    }

    // Normaliza e reconhece
    const normalized = normalize(this.currentPath);
    const result = recognize(normalized, this.templates);

    console.log(`Match: ${result.name} (${(result.score * 100).toFixed(1)}%)`);

    // Verifica se passou o threshold
    if (result.score >= CONFIG.scoreThreshold && result.name) {
      this.onMatch(result.name, result.score);
    }
  }

  onMatch(name, score) {
    // Já coletou esse?
    if (this.collected.has(name)) {
      this.showFeedback(`${name} já completo!`, false);
      return;
    }

    this.collected.add(name);
    this.updateHints();
    this.showFeedback(`${name}! (${(score * 100).toFixed(0)}%)`, true);

    // Verifica vitória
    if (this.collected.size >= this.requiredSpells.length) {
      setTimeout(() => this.win(), 500);
    }
  }

  showFeedback(text, success) {
    if (!this.matchFeedback) return;

    this.matchFeedback.textContent = text;
    this.matchFeedback.style.background = success
      ? "rgba(100, 255, 180, 0.15)"
      : "rgba(255, 180, 100, 0.15)";
    this.matchFeedback.style.borderColor = success
      ? "rgba(100, 255, 180, 0.4)"
      : "rgba(255, 180, 100, 0.4)";
    this.matchFeedback.style.color = success ? "#a0ffd0" : "#ffd0a0";

    this.matchFeedback.classList.add("show");
    setTimeout(() => {
      this.matchFeedback.classList.remove("show");
    }, 1200);
  }

  updateHints() {
    this.hintIcons.forEach((icon) => {
      const spell = icon.dataset.spell;
      if (this.collected.has(spell)) {
        icon.classList.add("done");
      }
    });
  }

  win() {
    if (this.winBanner) {
      this.winBanner.classList.add("show");
    }
    console.log("🎉 VITÓRIA! Todos os símbolos completos!");
  }

  startLoop() {
    const loop = () => {
      this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);

      this.trail.update();
      this.trail.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cast-surface");
  if (canvas) {
    window.spellCaster = new SpellCaster(canvas);
  }
});
