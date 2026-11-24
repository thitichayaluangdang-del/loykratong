// js/river.js - River Surface, Waves, Water Lighting & Floating Krathongs with Wish Banners
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

    // Dynamic depth perspective
    this.updateScaleFromY();

    this.vx = (0.22 + Math.random() * 0.3); // gentle eastward river drift
    this.vy = (Math.random() - 0.48) * 0.07;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.bobSpeed = 1.6 + Math.random() * 0.6;
    this.tiltPhase = Math.random() * Math.PI * 2;

    this.isHovered = false;
    this.badgeBounds = null;
  }

  updateScaleFromY() {
    const isMobile = window.innerWidth <= 768;
    const riverTop = window.innerHeight * 0.52;
    const riverBottom = window.innerHeight * 0.95;
    const ratio = Math.max(0, Math.min(1, (this.y - riverTop) / (riverBottom - riverTop)));
    // Crisper, larger scale so fine details & flowers are clearly visible
    const minSize = isMobile ? 56 : 72;
    const maxSize = isMobile ? 98 : 136;
    this.size = minSize + ratio * (maxSize - minSize);
  }

  update(dt, time) {
    this.x += this.vx;
    this.y += this.vy;
    this.updateScaleFromY();

    // Wrap around screen gently if floated past right margin
    if (this.x > window.innerWidth + this.size * 2) {
      this.x = -this.size * 2;
      this.y = window.innerHeight * (0.62 + Math.random() * 0.28);
    }
  }

  containsPoint(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    const radius = this.size * 0.78;
    if ((dx * dx + dy * dy) <= (radius * radius)) return true;

    // Also check bounding box of the wish card
    if (this.badgeBounds) {
      const by = this.y + this.badgeBounds.offsetY;
      const bw = this.badgeBounds.w;
      const bh = this.badgeBounds.h;
      if (px >= this.x - bw / 2 && px <= this.x + bw / 2 && py >= by && py <= by + bh) {
        return true;
      }
    }
    return false;
  }

  draw(ctx, time) {
    ctx.save();

    // Water Bobbing & gentle wave tilt
    const bob = Math.sin(time * this.bobSpeed + this.bobPhase) * (this.size * 0.06);
    const tilt = Math.cos(time * 1.2 + this.tiltPhase) * 0.04;

    ctx.translate(this.x, this.y + bob);
    ctx.rotate(tilt);

    // Candle reflection on the water surface
    this.drawReflection(ctx, time);

    // Draw Krathong Body
    window.KrathongRenderer.drawKrathong(ctx, this.type, this.candleColor, this.size, time);

    // Draw Wish & Name Banner (แสดงข้อความที่ขอและชื่ออย่างชัดเจน)
    this.drawWishTag(ctx, time);

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

  drawWishTag(ctx, time) {
    const isMobile = window.innerWidth <= 768;
    const isHighlight = this.isUser || this.isHovered;

    ctx.save();
    const offsetY = this.size * 0.44;
    ctx.translate(0, offsetY);

    // Format Name
    const rawName = this.name.length > 18 ? this.name.substring(0, 18) + '…' : this.name;
    const nameText = this.isUser ? `✨ ${rawName}` : rawName;

    // Format Wish Message
    const maxWishLen = isMobile ? 22 : 32;
    const rawWish = this.wish.length > maxWishLen ? this.wish.substring(0, maxWishLen) + '…' : this.wish;
    const wishText = `"${rawWish}"`;

    // Font styles
    const nameFontSize = isMobile ? 10.5 : 12;
    const wishFontSize = isMobile ? 9.5 : 11;

    ctx.font = `bold ${nameFontSize}px 'Kanit', sans-serif`;
    const nameW = ctx.measureText(nameText).width;

    ctx.font = `${wishFontSize}px 'Sarabun', 'Kanit', sans-serif`;
    const wishW = ctx.measureText(wishText).width;

    const padX = isMobile ? 10 : 14;
    const boxW = Math.max(nameW, wishW) + padX * 2;
    const boxH = isMobile ? 36 : 42;

    this.badgeBounds = {
      w: boxW,
      h: boxH,
      offsetY: offsetY
    };

    // Card styling
    if (this.isUser) {
      // Golden shimmering aura for user's krathong
      ctx.fillStyle = 'rgba(255, 248, 225, 0.96)';
      ctx.strokeStyle = '#ffa000';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
      ctx.shadowBlur = 12;
    } else if (this.isHovered) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = 'rgba(8, 20, 38, 0.82)';
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
    }

    // Connect pointer
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(0, -4);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();

    // Main Card
    ctx.beginPath();
    ctx.roundRect(-boxW / 2, 0, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Line 1: Name
    ctx.font = `bold ${nameFontSize}px 'Kanit', sans-serif`;
    ctx.fillStyle = this.isUser ? '#3e2723' : (this.isHovered ? '#0d47a1' : '#ffd54f');
    ctx.textAlign = 'center';
    ctx.fillText(nameText, 0, isMobile ? 14 : 16);

    // Line 2: Wish Text (ข้อความคำอธิษฐาน)
    ctx.font = `${wishFontSize}px 'Sarabun', 'Kanit', sans-serif`;
    ctx.fillStyle = this.isUser ? '#4e342e' : (this.isHovered ? '#263238' : '#e0e6ed');
    ctx.fillText(wishText, 0, isMobile ? 27 : 31);

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
      const isMobile = window.innerWidth <= 768;
      const count = isMobile ? 4 : communityCelebrants.length;
      if (idx >= count) return;

      const x = (idx / count) * window.innerWidth + (Math.random() * 60 - 30);
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
      x: window.innerWidth * 0.5 + (Math.random() * 40 - 20),
      y: window.innerHeight * 0.82
    });
    this.krathongs.push(krathong);
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
    const w = window.innerWidth;
    const h = window.innerHeight;
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
    const moonX = w * (window.innerWidth <= 768 ? 0.72 : 0.78);
    const refWidth = w * (window.innerWidth <= 768 ? 0.24 : 0.18);
    const refHeight = h - riverTopY;

    ctx.save();
    const moonRefGrad = ctx.createLinearGradient(moonX, riverTopY, moonX, h);
    moonRefGrad.addColorStop(0, 'rgba(255, 248, 220, 0.45)');
    moonRefGrad.addColorStop(0.4, 'rgba(255, 235, 160, 0.22)');
    moonRefGrad.addColorStop(0.8, 'rgba(255, 215, 120, 0.08)');
    moonRefGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = moonRefGrad;

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
