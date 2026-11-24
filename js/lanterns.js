// js/lanterns.js - Yee Peng Sky Lanterns Simulation
class SkyLantern {
  constructor(x, y, wishText = '', floaterName = '') {
    this.x = x;
    this.y = y;
    this.wishText = wishText;
    this.floaterName = floaterName;
    this.baseWidth = 34 + Math.random() * 10;
    this.baseHeight = this.baseWidth * 1.35;
    this.scale = 1.0;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(0.55 + Math.random() * 0.45);
    this.swayTime = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.025 + Math.random() * 0.02;
    this.swayAmp = 0.6 + Math.random() * 0.4;
    this.alpha = 1.0;
    this.isDead = false;
  }

  update() {
    this.swayTime += this.swaySpeed;
    this.x += this.vx + Math.sin(this.swayTime) * this.swayAmp;
    this.y += this.vy;

    // As lantern rises, it shrinks and fades gently into the stars
    if (this.y < window.innerHeight * 0.5) {
      this.scale = Math.max(0.18, this.scale * 0.9985);
      this.vy *= 1.0005; // slight thermal draft acceleration
    }

    if (this.y < -120 || this.scale <= 0.2) {
      this.alpha -= 0.005;
      if (this.alpha <= 0) {
        this.isDead = true;
      }
    }
  }

  draw(ctx, time = 0) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = Math.max(0, this.alpha);

    const w = this.baseWidth;
    const h = this.baseHeight;

    // Outer warm lantern aura
    const auraGrad = ctx.createRadialGradient(0, h * 0.4, 4, 0, h * 0.4, w * 1.4);
    auraGrad.addColorStop(0, 'rgba(255, 175, 40, 0.65)');
    auraGrad.addColorStop(0.5, 'rgba(255, 130, 20, 0.25)');
    auraGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, h * 0.4, w * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Lantern cylinder / bell body (bamboo frame & Saa paper)
    const bodyGrad = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
    bodyGrad.addColorStop(0, '#f9a825');
    bodyGrad.addColorStop(0.3, '#fff59d');
    bodyGrad.addColorStop(0.7, '#fff59d');
    bodyGrad.addColorStop(1, '#f57f17');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    // Top curved dome
    ctx.moveTo(-w * 0.4, 0);
    ctx.quadraticCurveTo(0, -h * 0.15, w * 0.4, 0);
    // Right curved wall
    ctx.quadraticCurveTo(w * 0.55, h * 0.55, w * 0.38, h);
    // Bottom open rim
    ctx.quadraticCurveTo(0, h * 1.08, -w * 0.38, h);
    // Left curved wall
    ctx.quadraticCurveTo(-w * 0.55, h * 0.55, -w * 0.4, 0);
    ctx.closePath();
    ctx.fill();

    // Bamboo rings / ribs
    ctx.strokeStyle = 'rgba(216, 67, 21, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.35, w * 0.46, h * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, h * 0.7, w * 0.43, h * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Bottom wire rim
    ctx.strokeStyle = '#bf360c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.98, w * 0.38, h * 0.06, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Interior flame / burner disc
    const flicker = Math.sin(time * 15 + this.swayTime) * 1.5;
    const flameGrad = ctx.createRadialGradient(0, h * 0.9, 1, 0, h * 0.9, w * 0.25);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.4, '#ffee58');
    flameGrad.addColorStop(0.8, '#ff5722');
    flameGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.arc(0, h * 0.88 + flicker, w * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Wish Text on Lantern (if nearby)
    if (this.scale > 0.65 && (this.wishText || this.floaterName)) {
      ctx.save();
      ctx.fillStyle = 'rgba(120, 40, 10, 0.75)';
      ctx.font = 'bold 8px Kanit, Sarabun, sans-serif';
      ctx.textAlign = 'center';
      const displayText = this.wishText ? (this.wishText.length > 12 ? this.wishText.substring(0, 12) + '...' : this.wishText) : this.floaterName;
      ctx.fillText(displayText, 0, h * 0.55);
      ctx.restore();
    }

    ctx.restore();
  }
}

class LanternSystem {
  constructor() {
    this.lanterns = [];
  }

  release(x, y, wishText = '', floaterName = '') {
    const lantern = new SkyLantern(x, y, wishText, floaterName);
    this.lanterns.push(lantern);
    if (window.soundSystem) {
      window.soundSystem.playLanternRelease();
    }
  }

  releasePresetFlock(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = window.innerWidth * 0.1 + Math.random() * (window.innerWidth * 0.8);
        const y = window.innerHeight * 0.75 + Math.random() * 40;
        this.release(x, y);
      }, i * 350);
    }
  }

  update() {
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      this.lanterns[i].update();
      if (this.lanterns[i].isDead) {
        this.lanterns.splice(i, 1);
      }
    }
  }

  draw(ctx, time = 0) {
    this.lanterns.forEach(l => l.draw(ctx, time));
  }
}

window.lanternSystem = new LanternSystem();
