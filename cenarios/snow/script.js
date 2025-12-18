const TOTAL_NUM_FLAKES = 300;
const SNOW_SYMBOLS = ["•", "❅", "❆", "❄"];

// CONFIGURAÇÃO DAS CAMADAS
// speedFactor drasticamente reduzido (dividido por 10) para efeito "flutuante"
const LAYERS = [
  {
    layer: 1,
    sizeMin: 24,
    sizeMax: 40,
    speedFactor: 0.012, 
    swayAmpMin: 10,
    swayAmpMax: 30,
    opacity: 1,
    blur: 0,
    colorVariationMin: 255,
    colorVariationMax: 255,
    symbols: ["•"],
    zIndex: 6,
  },
  {
    layer: 2,
    sizeMin: 20,
    sizeMax: 28,
    speedFactor: 0.009, 
    swayAmpMin: 10,
    swayAmpMax: 25,
    opacity: 0.85,
    blur: 2,
    colorVariationMin: 255,
    colorVariationMax: 255,
    symbols: ["•"],
    zIndex: 5,
  },
  {
    layer: 3,
    sizeMin: 16,
    sizeMax: 24,
    speedFactor: 0.007,
    swayAmpMin: 10,
    swayAmpMax: 20,
    opacity: 0.75,
    blur: 4,
    colorVariationMin: 255,
    colorVariationMax: 255,
    symbols: ["•"],
    zIndex: 4,
  },
  {
    layer: 4,
    sizeMin: 12,
    sizeMax: 18,
    speedFactor: 0.005,
    swayAmpMin: 10,
    swayAmpMax: 20,
    opacity: 0.65,
    blur: 5,
    colorVariationMin: 220,
    colorVariationMax: 229,
    symbols: ["•"],
    zIndex: 3,
  },
  {
    layer: 5,
    sizeMin: 10,
    sizeMax: 14,
    speedFactor: 0.003,
    swayAmpMin: 10,
    swayAmpMax: 20,
    opacity: 0.55,
    blur: 7,
    colorVariationMin: 210,
    colorVariationMax: 219,
    symbols: ["•"],
    zIndex: 2,
  },
  {
    layer: 6,
    sizeMin: 8,
    sizeMax: 12,
    speedFactor: 0.001,
    swayAmpMin: 10,
    swayAmpMax: 20,
    opacity: 0.4,
    blur: 30,
    colorVariationMin: 200,
    colorVariationMax: 209,
    symbols: ["•"],
    zIndex: 1,
  },
];

class SnowLayer {
  constructor(canvasId, layerProps) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.layerProps = layerProps;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.snowflakes = [];
    
    // Cria os flocos iniciais
    this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
  }

  createSnowflakes(numFlakes) {
    for (let i = 0; i < numFlakes; i++) {
      this.snowflakes.push(this.createSnowflake());
    }
  }

  createSnowflake() {
    const symbol =
      this.layerProps.symbols[
        Math.floor(Math.random() * this.layerProps.symbols.length)
      ];
    const layerProps = this.layerProps;

    const size =
      Math.random() * (layerProps.sizeMax - layerProps.sizeMin) +
      layerProps.sizeMin;
      
    // Velocidade base reduzida (de 0.5 para 0.1) para garantir leveza
    const fallSpeed = size * layerProps.speedFactor + Math.random() * 0.1;
    
    const swayAmplitude =
      Math.random() * (layerProps.swayAmpMax - layerProps.swayAmpMin) +
      layerProps.swayAmpMin;
      
    // Balanço mais suave
    const swaySpeed = Math.random() * 0.01 + 0.005;

    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = Math.random() * 0.02 - 0.01;

    const colorVariation =
      Math.floor(
        Math.random() *
          (layerProps.colorVariationMax - layerProps.colorVariationMin + 1)
      ) + layerProps.colorVariationMin;
    const color = `rgba(${colorVariation}, ${colorVariation}, ${colorVariation}, ${layerProps.opacity})`;

    return {
      x: Math.random() * this.width,
      y: Math.random() * -this.height, 
      size: size,
      symbol: symbol,
      fallSpeed: fallSpeed,
      swayAmplitude: swayAmplitude,
      swaySpeed: swaySpeed,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: layerProps.opacity,
      blur: layerProps.blur,
      color: color,
      rotation: rotation,
      rotationSpeed: rotationSpeed,
    };
  }

  animate(wind) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let flake of this.snowflakes) {
      const swayX = Math.sin(flake.swayOffset) * flake.swayAmplitude;

      const windEffect = wind.speed * wind.direction;

      flake.rotation += flake.rotationSpeed;

      this.ctx.save();
      
      // Aplica a posição
      this.ctx.translate(flake.x + swayX + windEffect, flake.y);
      this.ctx.rotate(flake.rotation);

      this.ctx.font = `${flake.size}px sans-serif`;
      this.ctx.fillStyle = flake.color;

      if (flake.blur > 0) {
        this.ctx.shadowBlur = flake.blur;
        this.ctx.shadowColor = flake.color;
      }

      this.ctx.fillText(flake.symbol, 0, 0);

      this.ctx.restore();

      // Atualiza física
      flake.y += flake.fallSpeed;
      flake.x += windEffect * 0.5;
      flake.swayOffset += flake.swaySpeed;

      // Se sair pelas laterais, volta do outro lado
      if (flake.x > this.width + 50) {
        flake.x = -50;
      } else if (flake.x < -50) {
        flake.x = this.width + 50;
      }

      // Se passar do fundo da tela, reinicia lá em cima
      if (flake.y > this.height + 50) {
        // Reinicia o floco com novas propriedades
        Object.assign(flake, this.createSnowflake());
        // Posiciona acima da tela para cair novamente
        flake.y = -50; 
      }
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.snowflakes = [];
    this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
  }
}

// Lógica simples de vento
let wind = {
  direction: Math.random() < 0.5 ? -1 : 1,
  speed: Math.random() * 0.5 + 0.1,
};

setInterval(() => {
  wind.direction = Math.random() < 0.5 ? -1 : 1;
  wind.speed = Math.random() * 0.5 + 0.1;
}, 5000);

// Cria as camadas
const snowLayers = LAYERS.map(
  (layer) => new SnowLayer(`snow-canvas-${layer.layer}`, layer)
);

// Ajusta no resize
window.addEventListener("resize", () => {
  for (let layer of snowLayers) {
    layer.resize();
  }
});

// Loop de animação
function animate() {
  for (let layer of snowLayers) {
    layer.animate(wind);
  }
  requestAnimationFrame(animate);
}

animate();