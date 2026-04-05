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
  private isMobile = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.isMobile = window.innerWidth < 768;
    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    // Use documentElement.clientWidth to avoid scrollbar width issues
    this.width = document.documentElement.clientWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    // Let CSS handle display size — don't set pixel style.width
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.ctx.scale(dpr, dpr);
    this.isMobile = this.width < 768;

    // Smaller chars on mobile for denser grid, but readable
    this.fontSize = this.isMobile
      ? Math.max(8, this.width / 50)
      : Math.max(10, Math.min(16, this.width / 100));
  }

  private initParticles() {
    this.particles = [];
    this.textParticles = [];
    this.bgParticles = [];

    // Create a temporary canvas to render text and sample it
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d')!;

    tmpCanvas.width = this.width;
    tmpCanvas.height = this.height;
    tmpCtx.fillStyle = '#000';
    tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    tmpCtx.fillStyle = '#fff';

    if (this.isMobile) {
      // On mobile: split into two lines "TRUE" and "SCAN", rendered bigger
      // Position text in upper-center area so it doesn't overlap with bottom content
      const mobileFontSize = Math.floor(this.width * 0.22);
      tmpCtx.font = `bold ${mobileFontSize}px 'Space Grotesk', Arial Black, sans-serif`;
      tmpCtx.textAlign = 'center';
      tmpCtx.textBaseline = 'middle';
      const centerY = this.height * 0.38;
      tmpCtx.fillText('TRUE', this.width / 2, centerY - mobileFontSize * 0.55);
      tmpCtx.fillText('SCAN', this.width / 2, centerY + mobileFontSize * 0.55);
    } else {
      // Desktop: single line centered
      const scale = Math.min(this.width / 900, this.height / 400);
      const renderSize = Math.floor(140 * scale);
      tmpCtx.font = `bold ${renderSize}px 'Space Grotesk', Arial Black, sans-serif`;
      tmpCtx.textAlign = 'center';
      tmpCtx.textBaseline = 'middle';
      tmpCtx.fillText('TRUESCAN', this.width / 2, this.height * 0.45);
    }

    const imageData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    const stepX = Math.floor(this.fontSize * 0.65);
    const stepY = Math.floor(this.fontSize * 1.1);

    // How dense the background particles should be
    const bgDensity = this.isMobile ? 0.04 : 0.08;

    // Sample text pixels
    for (let y = 0; y < this.height; y += stepY) {
      for (let x = 0; x < this.width; x += stepX) {
        const i = (y * this.width + x) * 4;
        const brightness = imageData.data[i];

        if (brightness > 128) {
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
        } else if (Math.random() < bgDensity) {
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
    // Mouse for desktop
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Touch for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
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

    const mouseRadius = this.isMobile ? 100 : 150;
    const mouseForce = this.isMobile ? 50 : 80;

    // Sweeping scan line
    const scanSpeed = 0.4;
    const scanY = ((Math.sin(this.time * scanSpeed) + 1) / 2) * this.height;
    const scanWidth = this.isMobile ? 40 : 60;

    for (const p of this.particles) {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * mouseForce * 0.05;
        p.vy -= Math.sin(angle) * force * mouseForce * 0.05;

        if (Math.random() < 0.15) {
          p.char = GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
        }
      }

      const springForce = p.isText ? 0.08 : 0.03;
      p.vx += (p.baseX - p.x) * springForce;
      p.vy += (p.baseY - p.y) * springForce;

      p.vx *= 0.88;
      p.vy *= 0.88;

      p.x += p.vx;
      p.y += p.vy;

      if (!p.isText && Math.random() < 0.005) {
        p.char = GRID_CHARS[Math.floor(Math.random() * GRID_CHARS.length)];
      }

      let alpha = p.opacity;
      if (!p.isText) {
        alpha = p.opacity * (0.5 + 0.5 * Math.sin(this.time * p.speed + p.baseX * 0.01));
      }

      const scanDist = Math.abs(p.y - scanY);
      const inScanBand = scanDist < scanWidth;

      if (p.isText) {
        const distFromMouse = Math.sqrt(
          (this.mouse.x - p.x) ** 2 + (this.mouse.y - p.y) ** 2
        );
        if (inScanBand) {
          const scanAlpha = Math.min(1, alpha + (1 - scanDist / scanWidth) * 0.6);
          this.ctx.fillStyle = `rgba(0, 255, 65, ${scanAlpha})`;
        } else if (distFromMouse < mouseRadius * 1.5) {
          this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        } else {
          this.ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
        }
      } else {
        if (inScanBand) {
          const scanAlpha = alpha * 0.4 + (1 - scanDist / scanWidth) * 0.3;
          this.ctx.fillStyle = `rgba(0, 255, 65, ${scanAlpha})`;
        } else {
          this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.4})`;
        }
      }

      this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;
      this.ctx.fillText(p.char, p.x, p.y);
    }

    // Scan line
    const gradient = this.ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
    gradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, scanY - 2, this.width, 4);

    // Scan glow
    const glowGradient = this.ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    glowGradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
    glowGradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.06)');
    glowGradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
    this.ctx.fillStyle = glowGradient;
    this.ctx.fillRect(0, scanY - 30, this.width, 60);
  };

  destroy() {
    cancelAnimationFrame(this.animFrame);
    window.removeEventListener('resize', this.resize);
  }
}
