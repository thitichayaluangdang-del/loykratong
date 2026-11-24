// js/river.js - River Surface, Waves, Water Lighting & Floating Krathongs
class FloatingKrathong {
  constructor(options) {
    this.id = options.id || 'krathong_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    this.name = options.name || 'ผู้ไม่ประสงค์ออกนาม';
    this.wish = options.wish || 'ขอให้ชีวิตร่มเย็นเป็นสุข ขอขมาพระแม่คงคา';
    this.type = options.type || 'traditional';
    this.candleColor = options.candleColor || 'gold';
    this.isUser = options.isUser || false;
    this.createdAt = options.createdAt || new Date().toISOString();

    // River placement & movement physics
    this.x = options.x !== undefined ? options.x : (options.isUser ? window.innerWidth * 0.5 : Math.random() * window.innerWidth);
    this.y = options.y !== undefined ? options.y : (options.isUser ? window.innerHeight * 0.75 : window.innerHeight * (0.62 + Math.random() * 0.28));

    // Dynamic depth perspective (y affects scale: further away = smaller, higher in the river)
    this.updateScaleFromY();

    this.vx = (0.25 + Math.random() * 0.35); // drift eastward / rightward
    this.vy = (Math.random() - 0.48) * 0.08; // subtle vertical river current
    this.bobPhase = Math.random() * Math.PI * 2;
    this.bobSpeed = 1.6 + Math.random() * 0.6;
    this.tiltPhase = Math.random() * Math.PI * 2;

    // Hover state for interactive click
    this.isHovered = false;
  }

  updateScaleFromY() {
    const riverTop = window.innerHeight * 0.52;
    const riverBottom = window.innerHeight * 0.95;
    const ratio = Math.max(0, Math.min(1, (this.y - riverTop) / (riverBottom - riverTop)));
    // Scale ranges from 45px (far horizon) to 105px (close foreground)
    this.size = 45 + ratio * 60;
  }

  update(dt, time) {
    this.x += this.vx;
    this.y += this.vy;
    this.updateScaleFromY();

    // Wrap around screen gently if floated far right
    if (this.x > window.innerWidth + this.size * 2) {
      this.x = -this.size * 2;
      this.y = window.innerHeight * (0.62 + Math.random() * 0.28);
    }
  }

  containsPoint(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    const radius = this.size * 0.75;
    return (dx * dx + dy * dy) <= (radius * radius);
  }

  draw(ctx, time) {
    ctx.save();

    // Water Bobbing & gentle wave tilt
    const bob = Math.sin(time * this.bobSpeed + this.bobPhase) * (this.size * 0.06);
    const tilt = Math.cos(time * 1.2 + this.tiltPhase) * 0.04;

    ctx.translate(this.x, this.y + bob);
    ctx.rotate(tilt);

    // Candle reflection on the water surface (shimmering downwards)
    this.drawReflection(ctx, time);

    // Draw Krathong Body
    window.KrathongRenderer.drawKrathong(ctx, this.type, this.candleColor, this.size, time);

    // Draw Name Tag & Badge
    this.drawNameTag(ctx, time);

    ctx.restore();
  }

  drawReflection(ctx, time) {
    const candleConfig = window.CANDLE_COLORS.find(c => c.id === this.candleColor) || window.CANDLE_COLORS[0];
    const shimmer = Math.sin(time * 8 + this.bobPhase) * 3;
    const refH = this.size * 0.75;

    ctx.save();
    const grad = ctx.createLinearGradient(0, this.size * 0.2, 0, this.size * 0.2 + refH);
    grad.addColorStop(0, candleConfig.aura.replace('0.5', '0.45'));
    grad.addColorStop(0.5, candleConfig.aura.replace('0.5', '0.15'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(shimmer, this.size * 0.4 + refH * 0.4, this.size * 0.22, refH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawNameTag(ctx, time) {
    // Elegant floating name ribbon over or under krathong
    ctx.save();
    ctx.translate(0, this.size * 0.42);

    const isHighlight = this.isUser || this.isHovered;
    const text = this.name.length > 14 ? this.name.substring(0, 14) + '…' : this.name;

    ctx.font = isHighlight ? 'bold 12px Kanit, Sarabun, sans-serif' : '11px Kanit, Sarabun, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padX = 9;
    const boxW = textWidth + padX * 2;
    const boxH = 20;

    // Badge Background
    ctx.fillStyle = this.isUser ? 'rgba(255, 215, 0, 0.88)' : (this.isHovered ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 25, 45, 0.65)');
    ctx.strokeStyle = this.isUser ? '#ffb300' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(-boxW / 2, 0, boxW, boxH, 10);
    ctx.fill();
    ctx.stroke();

    // User Crown / Lotus Icon for personal krathong
    if (this.isUser) {
      ctx.fillStyle = '#b78103';
      ctx.font = '9px Kanit';
      ctx.fillText('✨', -boxW / 2 + 3, 14);
    }

    // Name Text
    ctx.fillStyle = this.isUser ? '#3e2723' : (this.isHovered ? '#1a237e' : '#ffffff');
    ctx.textAlign = 'center';
    ctx.fillText(text, this.isUser ? 4 : 0, 14);

    ctx.restore();
  }
}

class RiverSystem {
  constructor() {
    this.krathongs = [];
    this.waterWaves = [];
    this.initWaves();
    this.initCommunityKrathongs();
  }

  initWaves() {
    this.waveCount = 5;
    for (let i = 0; i < this.waveCount; i++) {
      this.waterWaves.push({
        yRatio: 0.52 + (i / this.waveCount) * 0.45,
        speed: 0.4 + i * 0.15,
        amplitude: 5 + i * 2,
        wavelength: 180 + i * 50,
        phase: Math.random() * Math.PI * 2,
        color: `rgba(20, 60, 110, ${0.12 + i * 0.05})`
      });
    }
  }

  initCommunityKrathongs() {
    const communityCelebrants = [
      { name: 'น้องมะลิ & ครอบครัว', wish: 'ขอขมาพระแม่คงคา ขอให้ปีนี้ทุกคนมีความสุข สุขภาพแข็งแรง', type: 'traditional', candleColor: 'gold' },
      { name: 'พี่กานต์ คนเมืองเหนือ', wish: 'ขอปล่อยเคราะห์กรรม ลอยความทุกข์ไปกับสายน้ำ เริ่มต้นชีวิตใหม่', type: 'coconut', candleColor: 'gold' },
      { name: 'สายบุญ รักษ์โลก 🌿', wish: 'ขอให้สายน้ำสะอาด บริสุทธิ์ ปลาน้อยใหญ่ได้กินขนมปังอิ่มเอม', type: 'bread', candleColor: 'green' },
      { name: 'พิมพ์ใจ 🌸', wish: 'ขอให้ความรักยืนยาว พบเจอแต่คนดี จริงใจ มีความสุขทุกวัน', type: 'lotus', candleColor: 'pink' },
      { name: 'เสี่ยบอย เฮงเฮง', wish: 'ขอให้การค้าขายร่ำรวย เงินทองไหลมาเทมา ปลดหนี้ปลดสิน รวยๆ!', type: 'gold', candleColor: 'gold' },
      { name: 'ด.ช. ภูมิ & แม่แก้ว', wish: 'ขอให้สอบติดโรงเรียนที่หวัง และขอให้คุณแม่มีความสุขมากๆ คับ', type: 'floral', candleColor: 'blue' }
    ];

    communityCelebrants.forEach((c, idx) => {
      const x = (idx / communityCelebrants.length) * window.innerWidth + (Math.random() * 80 - 40);
      const y = window.innerHeight * (0.64 + (idx % 3) * 0.1);
      this.krathongs.push(new FloatingKrathong({
        name: c.name,
        wish: c.wish,
        type: c.type,
        candleColor: c.candleColor,
        x: x,
        y: y,
        isUser: false
      }));
    });
  }

  addKrathong(options) {
    const krathong = new FloatingKrathong({
      ...options,
      isUser: true,
      x: window.innerWidth * 0.5 + (Math.random() * 60 - 30),
      y: window.innerHeight * 0.82
    });
    this.krathongs.push(krathong);
    // Sort krathongs by Y coordinate so deeper ones render behind
    this.sortKrathongsByDepth();
    return krathong;
  }

  sortKrathongsByDepth() {
    this.krathongs.sort((a, b) => a.y - b.y);
  }

  clearRiver() {
    this.krathongs = [];
    this.initCommunityKrathongs();
  }

  checkHover(mouseX, mouseY) {
    let hovered = null;
    // Check in reverse order (top rendered first)
    for (let i = this.krathongs.length - 1; i >= 0; i--) {
      const k = this.krathongs[i];
      if (!hovered && k.containsPoint(mouseX, mouseY)) {
        k.isHovered = true;
        hovered = k;
      } else {
        k.isHovered = false;
      }
    }
    return hovered;
  }

  update(dt, time) {
    this.krathongs.forEach(k => k.update(dt, time));
    this.sortKrathongsByDepth();
  }

  draw(ctx, time) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const riverTopY = h * 0.52;

    // 1. River Gradient Background
    const riverGrad = ctx.createLinearGradient(0, riverTopY, 0, h);
    riverGrad.addColorStop(0, '#0a1d37');
    riverGrad.addColorStop(0.35, '#07162b');
    riverGrad.addColorStop(0.7, '#040d1c');
    riverGrad.addColorStop(1, '#02060e');

    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, riverTopY, w, h - riverTopY);

    // 2. Full Moon Reflection on River
    this.drawMoonReflection(ctx, w, h, riverTopY, time);

    // 3. Dynamic Water Waves
    this.waterWaves.forEach(wave => {
      const currentY = h * wave.yRatio;
      ctx.fillStyle = wave.color;
      ctx.beginPath();
      ctx.moveTo(0, currentY);

      for (let x = 0; x <= w; x += 30) {
        const waveY = currentY + Math.sin((x / wave.wavelength) + time * wave.speed + wave.phase) * wave.amplitude;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    });

    // 4. Render All Floating Krathongs (sorted by perspective depth)
    this.krathongs.forEach(k => k.draw(ctx, time));
  }

  drawMoonReflection(ctx, w, h, riverTopY, time) {
    const moonX = w * 0.78;
    const refWidth = w * 0.18;
    const refHeight = h - riverTopY;

    ctx.save();
    const moonRefGrad = ctx.createLinearGradient(moonX, riverTopY, moonX, h);
    moonRefGrad.addColorStop(0, 'rgba(255, 248, 220, 0.45)');
    moonRefGrad.addColorStop(0.4, 'rgba(255, 235, 160, 0.22)');
    moonRefGrad.addColorStop(0.8, 'rgba(255, 215, 120, 0.08)');
    moonRefGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = moonRefGrad;

    // Shimmering horizontal wave streaks under moon
    for (let y = riverTopY + 10; y < h; y += 14) {
      const progress = (y - riverTopY) / refHeight;
      const streakW = (refWidth * 0.4 + progress * refWidth) * (0.8 + Math.sin(time * 3 + y * 0.05) * 0.3);
      const shiftX = Math.sin(time * 2 + y * 0.1) * 8;

      ctx.beginPath();
      ctx.ellipse(moonX + shiftX, y, streakW, 2 + progress * 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

window.riverSystem = new RiverSystem();
