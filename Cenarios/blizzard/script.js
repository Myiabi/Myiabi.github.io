const TOTAL_NUM_FLAKES = 380;
const SNOW_SYMBOLS = ["•", "❅", "❆", "❄"];

const LAYERS = [
    { layer: 1, sizeMin: 18, sizeMax: 34, speedFactor: 0.25, swayAmpMin: 2, swayAmpMax: 6, opacity: 1, blur: 0, colorVariationMin: 245, colorVariationMax: 255, symbols: ["•","❆"], zIndex: 6 },
    { layer: 2, sizeMin: 14, sizeMax: 26, speedFactor: 0.22, swayAmpMin: 1, swayAmpMax: 5, opacity: 0.95, blur: 0, colorVariationMin: 240, colorVariationMax: 255, symbols: ["•","❅"], zIndex: 5 },
    { layer: 3, sizeMin: 12, sizeMax: 20, speedFactor: 0.18, swayAmpMin: 0, swayAmpMax: 4, opacity: 0.9, blur: 0, colorVariationMin: 235, colorVariationMax: 250, symbols: ["•"], zIndex: 4 },
    { layer: 4, sizeMin: 10, sizeMax: 16, speedFactor: 0.12, swayAmpMin: 0, swayAmpMax: 3, opacity: 0.8, blur: 0, colorVariationMin: 220, colorVariationMax: 240, symbols: ["•"], zIndex: 3 },
    { layer: 5, sizeMin: 8, sizeMax: 14, speedFactor: 0.08, swayAmpMin: 0, swayAmpMax: 2, opacity: 0.65, blur: 0, colorVariationMin: 210, colorVariationMax: 230, symbols: ["•"], zIndex: 2 },
    { layer: 6, sizeMin: 6, sizeMax: 12, speedFactor: 0.06, swayAmpMin: 0, swayAmpMax: 1, opacity: 0.45, blur: 0, colorVariationMin: 200, colorVariationMax: 220, symbols: ["•"], zIndex: 1 }
];

class SnowLayer {
	constructor(canvasId, layerProps) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext("2d");
		this.layerProps = layerProps;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.devicePixelRatio = window.devicePixelRatio || 1;
		this.resizeCanvas();

		this.snowflakes = [];
		this.SEGMENT_WIDTH = 6;
		this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);

		this.initializeSnowPiles();
		this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
	}

	resizeCanvas() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		const dpr = this.devicePixelRatio;
		this.canvas.width = Math.round(this.width * dpr);
		this.canvas.height = Math.round(this.height * dpr);
		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	// CHÃO ONDULADO – AGORA MAIS BAIXO
	initializeSnowPiles() {
		this.snowPileHeights = [];
		this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);

		const base = this.height - 80; // ← CHÃO MAIS BAIXO

		for (let j = 0; j < this.NUM_SEGMENTS; j++) {
			if (j === 0) {
				this.snowPileHeights[j] = base + (Math.random() * 20 - 10);
			} else {
				const prev = this.snowPileHeights[j - 1];
				let delta = Math.random() * 20 - 10;
				let newHeight = prev + delta;

				const maxHeight = this.height - 45;
				const minHeight = this.height - 150;

				if (newHeight > maxHeight) newHeight = maxHeight;
				if (newHeight < minHeight) newHeight = minHeight;

				this.snowPileHeights[j] = newHeight;
			}
		}

		this.smoothSnowPile(3);
	}

	smoothSnowPile(iterations = 1) {
		for (let iter = 0; iter < iterations; iter++) {
			const temp = [...this.snowPileHeights];
			for (let i = 1; i < this.NUM_SEGMENTS - 1; i++) {
				temp[i] = (
					this.snowPileHeights[i - 1] +
					this.snowPileHeights[i] +
					this.snowPileHeights[i + 1]
				) / 3;
			}
			this.snowPileHeights = temp;
		}
	}

	createSnowflakes(num) {
		for (let i = 0; i < num; i++) this.snowflakes.push(this.createSnowflake());
	}

	createSnowflake() {
		const p = this.layerProps;
		const symbol = p.symbols[(Math.random() * p.symbols.length) | 0];
		const size = Math.random() * (p.sizeMax - p.sizeMin) + p.sizeMin;

		const fallSpeed = size * p.speedFactor + Math.random() * 0.6;
		const swayAmplitude = Math.random() * (p.swayAmpMax - p.swayAmpMin) + p.swayAmpMin;
		const swaySpeed = Math.random() * 0.015 + 0.003;

		const rotation = Math.random() * Math.PI * 2;
		const rotationSpeed = (Math.random() * 0.02 - 0.01) * (size / 20);

		const cv = Math.floor(Math.random() * (p.colorVariationMax - p.colorVariationMin + 1)) + p.colorVariationMin;
		const color = `rgba(${cv},${cv},${cv},${p.opacity})`;

		return {
			x: Math.random() * this.width,
			y: Math.random() * -this.height,
			size,
			symbol,
			fallSpeed,
			swayAmplitude,
			swaySpeed,
			swayOffset: Math.random() * Math.PI * 2,
			opacity: p.opacity,
			blur: p.blur,
			color,
			rotation,
			rotationSpeed
		};
	}

	drawSnowPile() {
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.snowPileHeights[0]);

		for (let i = 1; i < this.NUM_SEGMENTS; i++) {
			this.ctx.lineTo(i * this.SEGMENT_WIDTH, this.snowPileHeights[i]);
		}

		this.ctx.lineTo(this.width, this.height);
		this.ctx.lineTo(0, this.height);
		this.ctx.closePath();
		this.ctx.fillStyle = `rgba(255,255,255,${this.layerProps.opacity})`;
		this.ctx.fill();
	}

	getSnowPileHeight(x) {
		const idx = Math.floor(x / this.SEGMENT_WIDTH);
		if (idx < 0 || idx >= this.NUM_SEGMENTS) return this.height;
		return this.snowPileHeights[idx];
	}

	animate(wind) {
		const ctx = this.ctx;
		ctx.clearRect(0, 0, this.width, this.height);

		this.drawSnowPile();

		const flakes = this.snowflakes;
		const wSpeed = wind.speed * wind.direction;

		for (let i = 0; i < flakes.length; i++) {
			const f = flakes[i];
			const swayX = Math.sin(f.swayOffset) * f.swayAmplitude;

			f.rotation += f.rotationSpeed;

			ctx.save();
			ctx.translate(f.x + swayX + wSpeed * (0.5 + f.size / 40), f.y);
			ctx.rotate(f.rotation);
			ctx.font = `${f.size}px sans-serif`;
			ctx.fillStyle = f.color;
			ctx.fillText(f.symbol, 0, 0);
			ctx.restore();

			f.y += f.fallSpeed;
			f.x += wSpeed * (0.6 + f.size / 45);
			f.swayOffset += f.swaySpeed;

			const groundHeight = this.getSnowPileHeight(f.x);

			// ❄️ Neve toca o chão → dissolve → renasce (sem acumular)
			if (f.y >= groundHeight - f.size) {
				f.y -= 8; // efeito visual do toque
				f.opacity = 0;

				setTimeout(() => {
					f.x = Math.random() * this.width;
					f.y = Math.random() * -this.height;
					f.opacity = this.layerProps.opacity;
				}, 80);
			}

			if (f.x > this.width + 60) f.x = -60;
		}
	}

	resize() {
		this.resizeCanvas();
		this.initializeSnowPiles();
		this.snowflakes.length = 0;
		this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
	}
}

let wind = {
	direction: 1,
	speed: 8 // vento forte
};

setInterval(() => {
	wind.speed = 6 + Math.random() * 4;
}, 3000);

const snowLayers = LAYERS.map(layer => new SnowLayer(`snow-canvas-${layer.layer}`, layer));

window.addEventListener("resize", () => {
	for (let layer of snowLayers) layer.resize();
});

function animate() {
	for (let layer of snowLayers) layer.animate(wind);
	requestAnimationFrame(animate);
}
animate();

const STAR_SYMBOLS = ["✦"]; // estrela preenchida — mantém o visual atual

function createStarSky() {
    const canvas = document.getElementById("star-canvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        drawStars();
        drawMoon();
    }

    function drawStars() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);

        const starCount = 350;

        const maxHeight = height * 0.70; // ⭐ limite vertical — só até 70%

        for (let i = 0; i < starCount; i++) {

            const x = Math.random() * width;
            const y = Math.random() * maxHeight; // ⭐ agora sempre dentro dos 70% superiores

            const size = Math.random() * 5 + 5;
            const opacity = Math.random() * 0.7 + 0.3;

            const symbol = STAR_SYMBOLS[Math.floor(Math.random() * STAR_SYMBOLS.length)];

            ctx.save();
            ctx.font = `${size}px serif`;
            ctx.globalAlpha = opacity;
            ctx.fillStyle = "rgba(255,255,255,1)";

            ctx.shadowBlur = size * 1.5;
            ctx.shadowColor = "rgba(255,255,255,0.9)";

            ctx.fillText(symbol, x, y);
            ctx.restore();
        }
    }

    function drawMoon() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const moonSize = 80;
        const x = width * 0.78;
        const y = height * 0.18;

        ctx.save();
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(255,255,220,0.6)";

        ctx.beginPath();
        ctx.arc(x, y, moonSize, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,240,0.9)";
        ctx.fill();

        ctx.restore();
    }

    resize();
    window.addEventListener("resize", resize);
}

createStarSky();
