// js/fireworks.js - Fireworks Simulation with Canvas Particle Physics
class FireworkParticle {
  constructor(x, y, color, angle, speed, isSparkle = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isSparkle = isSparkle;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.friction = 0.96;
    this.gravity = 0.08;
    this.alpha = 1;
    this.decay = 0.012 + Math.random() * 0.015;
    this.size = isSparkle ? 1.5 : (2 + Math.random() * 2);
    this.history = [];
    this.maxHistory = isSparkle ? 2 : 4;
  }

  update() {
    this.history.push({ x: this.x, y: this.y, alpha: this.alpha });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    // Trail
    for (let i = 0; i < this.history.length; i++) {
      const p = this.history[i];
      const trailAlpha = (i / this.history.length) * this.alpha * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${trailAlpha})`);
      ctx.fill();
    }

    // Main particle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${this.alpha})`);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class FireworkRocket {
  constructor(startX, startY, targetX, targetY, color, onExplode) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.onExplode = onExplode;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    const speed = 9 + Math.random() * 3;
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.history = [];
    this.isDead = false;
  }

  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 5) this.history.shift();

    this.x += this.vx;
    this.y += this.vy;

    // Check if reached apex or target
    if (this.y <= this.targetY || this.vy >= 0) {
      this.isDead = true;
      if (this.onExplode) this.onExplode(this.targetX, this.targetY, this.color);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 230, 150, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < this.history.length; i++) {
      const p = this.history[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FireworksSystem {
  constructor() {
    this.particles = [];
    this.rockets = [];
    this.autoShow = false;
    this.autoTimer = null;
    this.palettes = [
      ['rgb(255, 107, 107)', 'rgb(254, 202, 87)', 'rgb(255, 159, 243)'],
      ['rgb(72, 219, 251)', 'rgb(29, 209, 161)', 'rgb(255, 255, 255)'],
      ['rgb(255, 215, 0)', 'rgb(255, 165, 0)', 'rgb(255, 69, 0)'],
      ['rgb(238, 90, 153)', 'rgb(181, 52, 113)', 'rgb(248, 165, 24)'],
      ['rgb(0, 210, 211)', 'rgb(84, 160, 255)', 'rgb(95, 39, 205)']
    ];
  }

  launch(targetX, targetY) {
    const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)];
    const color = palette[Math.floor(Math.random() * palette.length)];
    const startX = targetX + (Math.random() * 80 - 40);
    const startY = window.innerHeight * 0.9;

    this.rockets.push(new FireworkRocket(startX, startY, targetX, targetY, color, (x, y) => {
      this.explode(x, y, palette);
    }));

    if (window.soundSystem) {
      window.soundSystem.playFirework();
    }
  }

  explode(x, y, palette) {
    const particleCount = 70 + Math.floor(Math.random() * 40);
    const primaryColor = palette[0];
    const secondaryColor = palette[1];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const speed = 2 + Math.random() * 6;
      const col = (Math.random() > 0.4) ? primaryColor : secondaryColor;
      this.particles.push(new FireworkParticle(x, y, col, angle, speed));
    }

    // Sparkle crackles
    for (let j = 0; j < 25; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      this.particles.push(new FireworkParticle(x, y, 'rgb(255, 255, 255)', angle, speed, true));
    }
  }

  toggleAutoShow() {
    this.autoShow = !this.autoShow;
    if (this.autoShow) {
      this.scheduleNextAuto();
    } else {
      if (this.autoTimer) clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    return this.autoShow;
  }

  scheduleNextAuto() {
    if (!this.autoShow) return;
    const x = window.innerWidth * 0.15 + Math.random() * (window.innerWidth * 0.7);
    const y = window.innerHeight * 0.1 + Math.random() * (window.innerHeight * 0.35);
    this.launch(x, y);

    const delay = 1200 + Math.random() * 2000;
    this.autoTimer = setTimeout(() => {
      this.scheduleNextAuto();
    }, delay);
  }

  update() {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      this.rockets[i].update();
      if (this.rockets[i].isDead) {
        this.rockets.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0.01) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.rockets.forEach(r => r.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));
  }
}

window.fireworksSystem = new FireworksSystem();
