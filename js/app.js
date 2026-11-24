// js/app.js - Main Application Controller & Canvas Animation Loop
class App {
  constructor() {
    this.skyCanvas = document.getElementById('sky-canvas');
    this.skyCtx = this.skyCanvas.getContext('2d');

    this.fireworksCanvas = document.getElementById('fireworks-canvas');
    this.fireworksCtx = this.fireworksCanvas.getContext('2d');

    this.riverCanvas = document.getElementById('river-canvas');
    this.riverCtx = this.riverCanvas.getContext('2d');

    this.stars = [];
    this.shootingStars = [];
    this.selectedKrathongType = 'traditional';
    this.selectedCandleColor = 'gold';
    this.userKrathongCount = 0;

    this.time = 0;
    this.lastFrameTime = performance.now();

    this.init();
  }

  init() {
    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());

    this.initStars();
    this.initKrathongOptions();
    this.initCandleOptions();
    this.initQuickWishes();
    this.bindEvents();

    // Start Animation Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    [this.skyCanvas, this.fireworksCanvas, this.riverCanvas].forEach(canvas => {
      canvas.width = w;
      canvas.height = h;
    });

    this.initStars();
  }

  initStars() {
    this.stars = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 4500);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.52),
        r: 0.6 + Math.random() * 1.4,
        twinkleSpeed: 1.5 + Math.random() * 3,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.2 ? '#ffffff' : (Math.random() > 0.5 ? '#fff9c4' : '#b3e5fc')
      });
    }
  }

  initKrathongOptions() {
    const container = document.getElementById('krathong-options-grid');
    if (!container) return;

    container.innerHTML = '';
    window.KRATHONG_TYPES.forEach(k => {
      const option = document.createElement('div');
      option.className = `krathong-option ${k.id === this.selectedKrathongType ? 'selected' : ''}`;
      option.dataset.id = k.id;

      const previewUrl = window.KrathongRenderer.createPreviewCanvas(k.id, this.selectedCandleColor, 120, 120);

      option.innerHTML = `
        <img class="krathong-preview-img" src="${previewUrl}" alt="${k.name}">
        <div class="krathong-option-name">${k.name}</div>
        <div class="krathong-option-sub">${k.subtitle}</div>
      `;

      option.addEventListener('click', () => {
        document.querySelectorAll('.krathong-option').forEach(el => el.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedKrathongType = k.id;
        this.updateMeaningText(k);
      });

      container.appendChild(option);
    });

    const currentType = window.KRATHONG_TYPES.find(k => k.id === this.selectedKrathongType);
    this.updateMeaningText(currentType);
  }

  updateMeaningText(krathong) {
    const meaningEl = document.getElementById('krathong-meaning-box');
    if (meaningEl && krathong) {
      meaningEl.innerHTML = `<strong>✨ คติมงคล:</strong> ${krathong.meaning}`;
    }
  }

  initCandleOptions() {
    const container = document.getElementById('candle-options');
    if (!container) return;

    container.innerHTML = '';
    window.CANDLE_COLORS.forEach(c => {
      const choice = document.createElement('div');
      choice.className = `candle-choice ${c.id === this.selectedCandleColor ? 'selected' : ''}`;
      choice.dataset.id = c.id;
      choice.innerHTML = `
        <span class="flame-dot" style="background:${c.flame}; color:${c.flame}"></span>
        <span>${c.name}</span>
      `;

      choice.addEventListener('click', () => {
        document.querySelectorAll('.candle-choice').forEach(el => el.classList.remove('selected'));
        choice.classList.add('selected');
        this.selectedCandleColor = c.id;
        // Refresh preview thumbnails
        this.initKrathongOptions();
      });

      container.appendChild(choice);
    });
  }

  initQuickWishes() {
    const container = document.getElementById('quick-wishes-tags');
    const textarea = document.getElementById('krathong-wish-input');
    if (!container || !textarea) return;

    container.innerHTML = '';
    window.POPULAR_WISHES.forEach(wish => {
      const tag = document.createElement('span');
      tag.className = 'wish-tag';
      tag.textContent = wish;
      tag.addEventListener('click', () => {
        textarea.value = wish;
      });
      container.appendChild(tag);
    });
  }

  bindEvents() {
    // Top Controls
    const btnMusic = document.getElementById('btn-toggle-music');
    if (btnMusic) {
      btnMusic.addEventListener('click', () => {
        const isPlaying = window.soundSystem.toggleBGM();
        btnMusic.classList.toggle('active', isPlaying);
        btnMusic.querySelector('span').textContent = isPlaying ? 'ดนตรี: เปิด' : 'ดนตรี: ปิด';
      });
    }

    const btnSfx = document.getElementById('btn-toggle-sfx');
    if (btnSfx) {
      btnSfx.addEventListener('click', () => {
        const isSfx = window.soundSystem.toggleSFX();
        btnSfx.classList.toggle('active', isSfx);
        btnSfx.querySelector('span').textContent = isSfx ? 'เสียงเอฟเฟกต์: เปิด' : 'เสียงเอฟเฟกต์: ปิด';
      });
    }

    const btnAutoFireworks = document.getElementById('btn-auto-fireworks');
    if (btnAutoFireworks) {
      btnAutoFireworks.addEventListener('click', () => {
        const active = window.fireworksSystem.toggleAutoShow();
        btnAutoFireworks.classList.toggle('active', active);
        btnAutoFireworks.querySelector('span').textContent = active ? 'พลุต่อเนื่อง: เปิด' : 'จุดพลุอัตโนมัติ';
      });
    }

    const btnLantern = document.getElementById('btn-release-lantern');
    if (btnLantern) {
      btnLantern.addEventListener('click', () => {
        this.openModal('lantern-modal');
      });
    }

    const btnFloatKrathong = document.getElementById('btn-open-krathong-modal');
    if (btnFloatKrathong) {
      btnFloatKrathong.addEventListener('click', () => {
        this.openModal('krathong-modal');
      });
    }

    const btnCleanRiver = document.getElementById('btn-clean-river');
    if (btnCleanRiver) {
      btnCleanRiver.addEventListener('click', () => {
        window.riverSystem.clearRiver();
        alert('🌿 ทำความสะอาดแม่น้ำเรียบร้อยแล้ว สายน้ำกลับมาสดใสบริสุทธิ์!');
      });
    }

    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
      btnInfo.addEventListener('click', () => {
        this.openModal('info-modal');
      });
    }

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Form Submissions: Krathong
    const krathongForm = document.getElementById('krathong-form');
    if (krathongForm) {
      krathongForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('krathong-name-input').value.trim() || 'ผู้ไม่ประสงค์ออกนาม';
        const wishInput = document.getElementById('krathong-wish-input').value.trim() || 'ขอขมาพระแม่คงคา ขอให้ชีวิตมีแต่ความสุขความเจริญ';

        // Add to River
        const userKrathong = window.riverSystem.addKrathong({
          name: nameInput,
          wish: wishInput,
          type: this.selectedKrathongType,
          candleColor: this.selectedCandleColor
        });

        // Play sounds
        window.soundSystem.playWaterSplash();
        window.soundSystem.playBellChime();

        // Launch celebratory fireworks
        setTimeout(() => {
          window.fireworksSystem.launch(window.innerWidth * 0.5, window.innerHeight * 0.25);
        }, 300);

        // Close form modal
        this.closeModal('krathong-modal');

        // Show Wish Certificate / Confirmation Card
        this.showWishCard(userKrathong);
      });
    }

    // Form Submissions: Lantern
    const lanternForm = document.getElementById('lantern-form');
    if (lanternForm) {
      lanternForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wishText = document.getElementById('lantern-wish-input').value.trim();
        const nameText = document.getElementById('lantern-name-input').value.trim();

        const x = window.innerWidth * 0.4 + Math.random() * (window.innerWidth * 0.2);
        const y = window.innerHeight * 0.8;
        window.lanternSystem.release(x, y, wishText, nameText);

        // Also release a few background buddy lanterns
        setTimeout(() => {
          window.lanternSystem.release(x - 90, y + 20);
          window.lanternSystem.release(x + 90, y + 30);
        }, 400);

        this.closeModal('lantern-modal');
      });
    }

    // River Canvas Interaction (Click Krathong or Launch Fireworks on Sky)
    this.riverCanvas.addEventListener('click', (e) => {
      const rect = this.riverCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // First check if clicked on a floating krathong
      const clickedKrathong = window.riverSystem.checkHover(x, y);
      if (clickedKrathong) {
        this.showWishCard(clickedKrathong);
        return;
      }

      // If clicked on Sky portion (< 52% height), launch fireworks!
      if (y < window.innerHeight * 0.52) {
        window.fireworksSystem.launch(x, y);
      }
    });

    // Hover effect on krathongs
    this.riverCanvas.addEventListener('mousemove', (e) => {
      const rect = this.riverCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hovered = window.riverSystem.checkHover(x, y);
      this.riverCanvas.style.cursor = hovered ? 'pointer' : (y < window.innerHeight * 0.52 ? 'crosshair' : 'default');
    });

    // Initialize audio on first click anywhere on screen
    document.addEventListener('pointerdown', () => {
      window.soundSystem.init();
    }, { once: true });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showWishCard(krathong) {
    const modal = document.getElementById('wish-view-modal');
    if (!modal) return;

    const avatarBox = document.getElementById('wish-card-avatar');
    const nameBox = document.getElementById('wish-card-name');
    const dateBox = document.getElementById('wish-card-date');
    const quoteBox = document.getElementById('wish-card-quote');
    const typeBox = document.getElementById('wish-card-type');

    const kConfig = window.KRATHONG_TYPES.find(k => k.id === krathong.type) || window.KRATHONG_TYPES[0];

    avatarBox.innerHTML = '';
    const img = document.createElement('img');
    img.src = window.KrathongRenderer.createPreviewCanvas(krathong.type, krathong.candleColor, 140, 140);
    img.style.width = '100px';
    img.style.height = '100px';
    avatarBox.appendChild(img);

    nameBox.textContent = krathong.name;
    typeBox.textContent = `แบบ: ${kConfig.name} • ${kConfig.meaning}`;
    dateBox.textContent = `วันเพ็ญเดือน ๑๒ • ${new Date(krathong.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    quoteBox.textContent = `"${krathong.wish}"`;

    this.openModal('wish-view-modal');
  }

  spawnShootingStar() {
    if (Math.random() < 0.008 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * window.innerWidth * 0.7,
        y: Math.random() * (window.innerHeight * 0.25),
        len: 80 + Math.random() * 90,
        speed: 12 + Math.random() * 8,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1
      });
    }
  }

  drawSky(time) {
    const w = this.skyCanvas.width;
    const h = this.skyCanvas.height;
    const ctx = this.skyCtx;

    ctx.clearRect(0, 0, w, h);

    // Deep Night Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.52);
    skyGrad.addColorStop(0, '#020612');
    skyGrad.addColorStop(0.5, '#051329');
    skyGrad.addColorStop(0.85, '#0a2347');
    skyGrad.addColorStop(1, '#0e2d5c');

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.52);

    // Stars
    this.stars.forEach(s => {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.2, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Shooting Stars
    this.spawnShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${ss.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      ctx.stroke();
      ctx.restore();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.02;

      if (ss.alpha <= 0 || ss.x > w || ss.y > h * 0.52) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Full Moon (วันเพ็ญเดือน ๑๒)
    this.drawFullMoon(ctx, w * 0.78, h * 0.2, 54, time);

    // Distant Thai Temple Silhouettes & Mountains along River Horizon
    this.drawHorizonSilhouettes(ctx, w, h * 0.52);
  }

  drawFullMoon(ctx, cx, cy, radius, time) {
    ctx.save();

    // Outer warm atmospheric glow
    const glowPulse = Math.sin(time * 1.5) * 4;
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 2.8 + glowPulse);
    glow.addColorStop(0, 'rgba(255, 248, 220, 0.45)');
    glow.addColorStop(0.3, 'rgba(255, 235, 170, 0.18)');
    glow.addColorStop(0.7, 'rgba(255, 215, 100, 0.05)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 2.8 + glowPulse, 0, Math.PI * 2);
    ctx.fill();

    // Moon disc
    const moonGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, radius * 0.1, cx, cy, radius);
    moonGrad.addColorStop(0, '#fffff0');
    moonGrad.addColorStop(0.6, '#fff8dc');
    moonGrad.addColorStop(0.9, '#ffe4b5');
    moonGrad.addColorStop(1, '#ffd39b');

    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Maria / Craters (เงากระต่ายบนดวงจันทร์)
    ctx.fillStyle = 'rgba(180, 150, 110, 0.18)';
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.25, cy - radius * 0.1, radius * 0.28, radius * 0.22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.22, cy + radius * 0.25, radius * 0.32, radius * 0.2, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.05, cy + radius * 0.32, radius * 0.2, radius * 0.18, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHorizonSilhouettes(ctx, w, horizonY) {
    ctx.save();
    ctx.fillStyle = '#030a18';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);

    // Far mountains
    ctx.lineTo(0, horizonY - 18);
    ctx.quadraticCurveTo(w * 0.15, horizonY - 35, w * 0.3, horizonY - 14);
    ctx.quadraticCurveTo(w * 0.45, horizonY - 40, w * 0.6, horizonY - 20);

    // Thai Chedi / Temple Spire silhouette at w * 0.7
    const chediX = w * 0.68;
    ctx.lineTo(chediX - 25, horizonY - 12);
    ctx.lineTo(chediX - 15, horizonY - 30);
    ctx.lineTo(chediX - 8, horizonY - 45);
    ctx.lineTo(chediX, horizonY - 80); // Peak
    ctx.lineTo(chediX + 8, horizonY - 45);
    ctx.lineTo(chediX + 15, horizonY - 30);
    ctx.lineTo(chediX + 25, horizonY - 12);

    ctx.quadraticCurveTo(w * 0.85, horizonY - 30, w, horizonY - 15);
    ctx.lineTo(w, horizonY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  loop(currentTime) {
    const dt = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;
    this.time += dt;

    // 1. Draw Sky (Stars, Moon, Shooting stars)
    this.drawSky(this.time);

    // 2. Update & Draw Fireworks
    this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
    window.fireworksSystem.update();
    window.fireworksSystem.draw(this.fireworksCtx);

    // 3. Update & Draw Lanterns (on Fireworks canvas layer)
    window.lanternSystem.update();
    window.lanternSystem.draw(this.fireworksCtx, this.time);

    // 4. Update & Draw River & Floating Krathongs
    this.riverCtx.clearRect(0, 0, this.riverCanvas.width, this.riverCanvas.height);
    window.riverSystem.update(dt, this.time);
    window.riverSystem.draw(this.riverCtx, this.time);

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Boot on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
