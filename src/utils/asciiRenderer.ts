const ASCII_CHARS = '@#%&$?!+=-:. ';
const GRID_CHARS = '0123456789ABCDEF@#$%^&*(){}[]|/\\<>?!~`;:+-=_.';

interface AsciiParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  char: string;
  opacity: number;
  speed: number;
  isText: boolean;
  vx: number;
  vy: number;
}

export class AsciiHeroRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: AsciiParticle[] = [];
  private mouse = { x: -1000, y: -1000 };
  private animFrame = 0;
  private width = 0;
  private height = 0;
  private fontSize = 14;
  private textParticles: AsciiParticle[] = [];
  private bgParticles: AsciiParticle[] = [];
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);

    this.fontSize = Math.max(10, Math.min(16, this.width / 100));
  }

  private initParticles() {
    this.particles = [];
    this.textParticles = [];
    this.bgParticles = [];

    // Create a temporary canvas to render text and sample it
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d')!;
    const scale = Math.min(this.width / 900, this.height / 400);
    const renderSize = Math.floor(120 * scale);

    tmpCanvas.width = this.width;
    tmpCanvas.height = this.height;
    tmpCtx.fillStyle = '#000';
    tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    tmpCtx.fillStyle = '#fff';
    tmpCtx.font = `bold ${renderSize}px 'Space Grotesk', Arial Black, sans-serif`;
    tmpCtx.textAlign = 'center';
    tmpCtx.textBaseline = 'middle';
    tmpCtx.fillText('TRUESCAN', this.width / 2, this.height / 2 - 20);

    const imageData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    const stepX = Math.floor(this.fontSize * 0.65);
    const stepY = Math.floor(this.fontSize * 1.1);

    // Sample text pixels
    for (let y = 0; y < this.height; y += stepY) {
      for (let x = 0; x < this.width; x += stepX) {
        const i = (y * this.width + x) * 4;
        const brightness = imageData.data[i];

        if (brightness > 128) {
          // Text particle
          const charIdx = Math.floor(Math.random() * ASCII_CHARS.length * (brightness / 255));
          const particle: AsciiParticle = {
            x, y,
            baseX: x,
            baseY: y,
            char: ASCII_CHARS[Math.min(charIdx, ASCII_CHARS.length - 1)] || '@',
            opacity: 0.7 + Math.random() * 0.3,
            speed: 0.5 + Math.random() * 2,
            isText: true,
            vx: 0,
            vy: 0,
          };
          this.particles.push(particle);
          this.textParticles.push(particle);
        } else if (Math.random() < 0.08) {
          // Background particle
          const particle: AsciiParticle = {
            x, y,
            baseX: x,
            baseY: y,
            char: GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)],
            opacity: 0.03 + Math.random() * 0.12,
            speed: 0.2 + Math.random() * 1,
            isText: false,
            vx: 0,
            vy: 0,
          };
          this.particles.push(particle);
          this.bgParticles.push(particle);
        }
      }
    }
  }

  private bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  private animate = () => {
    this.animFrame = requestAnimationFrame(this.animate);
    this.time += 0.016;

    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.92)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const mouseRadius = 150;
    const mouseForce = 80;

    for (const p of this.particles) {
      // Mouse interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * mouseForce * 0.05;
        p.vy -= Math.sin(angle) * force * mouseForce * 0.05;

        // Scramble char on hover
        if (Math.random() < 0.15) {
          p.char = GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
        }
      }

      // Spring back to base position
      const springForce = p.isText ? 0.08 : 0.03;
      p.vx += (p.baseX - p.x) * springForce;
      p.vy += (p.baseY - p.y) * springForce;

      // Damping
      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx;
      p.y += p.vy;

      // Background character cycling
      if (!p.isText && Math.random() < 0.005) {
        p.char = GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
      }

      // Flickering opacity for bg
      let alpha = p.opacity;
      if (!p.isText) {
        alpha = p.opacity * (0.5 + 0.5 * Math.sin(this.time * p.speed + p.baseX * 0.01));
      }

      // Color
      if (p.isText) {
        const distFromMouse = Math.sqrt(
          (this.mouse.x - p.x) ** 2 + (this.mouse.y - p.y) ** 2
        );
        if (distFromMouse < mouseRadius * 1.5) {
          this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        } else {
          this.ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
        }
      } else {
        this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.4})`;
      }

      this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
      this.ctx.fillText(p.char, p.x, p.y);
    }
  };

  destroy() {
    cancelAnimationFrame(this.animFrame);
    window.removeEventListener('resize', this.resize);
  }
}
