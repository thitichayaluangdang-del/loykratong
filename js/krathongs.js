// js/krathongs.js - High-Definition Krathong Styles, SVG Generators & Crisp Canvas Renderers
const KRATHONG_TYPES = [
  {
    id: 'traditional',
    name: 'กระทงใบตองวิจิตร',
    subtitle: 'สืบสานประเพณีดั้งเดิม',
    desc: 'ใบตองธรรมชาติพับจีบประณีต ประดับดอกดาวเรืองและกล้วยไม้สีสด ขอขมาพระแม่คงคา',
    meaning: 'ขอขมาพระแม่คงคา เพื่อความเป็นสิริมงคลและความร่มเย็นในชีวิต',
    themeColor: '#2e7d32',
    accentColor: '#ffd54f'
  },
  {
    id: 'lotus',
    name: 'กระทงบงกชสวรรค์',
    subtitle: 'ดอกบัวสีชมพูบานสะพรั่ง',
    desc: 'กลีบดอกบัวหลวงสีชมพูซ้อนวิจิตร เกสรสีทองเรืองรอง เปี่ยมด้วยความสง่างาม',
    meaning: 'เสริมสร้างจิตใจอันบริสุทธิ์ สงบ และความรักที่งดงามยั่งยืน',
    themeColor: '#e91e63',
    accentColor: '#f8bbd0'
  },
  {
    id: 'bread',
    name: 'กระทงเต่าขนมปังรักษ์โลก',
    subtitle: 'เป็นมิตรต่อสายน้ำ ให้อาหารปลา',
    desc: 'ขนมปังอบรูปเต่าน้อยน่ารัก ย่อยสลายได้ 100% ปลอดภัยต่อระบบนิเวศน์ทางน้ำ',
    meaning: 'ทำทานแก่สรรพสัตว์ รักษ์ธรรมชาติ อนุรักษ์สายน้ำให้ยั่งยืน',
    themeColor: '#d87d3a',
    accentColor: '#fbe9e7'
  },
  {
    id: 'coconut',
    name: 'กระทงกะลาสายธาร',
    subtitle: 'มนต์เสน่ห์กระทงสายล้านนา',
    desc: 'กะลามะพร้าวธรรมชาติขัดมัน เทียนหล่อแสงอบอุ่น ลอยทอดตัวยาวตามสายน้ำ',
    meaning: 'แสงสว่างนำทางชีวิต ขจัดอุปสรรคและความมืดมนทั้งปวง',
    themeColor: '#5d4037',
    accentColor: '#ffb74d'
  },
  {
    id: 'gold',
    name: 'กระทงมงคลเศรษฐี',
    subtitle: 'ประกายทองคำนำโชคลาภ',
    desc: 'ประดับลวดลายกลีบทองคำและดอกไม้สีทองอร่าม เปล่งประกายรับแสงจันทร์เพ็ญ',
    meaning: 'เสริมดวงชะตา โชคลาภเงินทอง ความเจริญก้าวหน้าในหน้าที่การงาน',
    themeColor: '#c59b27',
    accentColor: '#fff9c4'
  },
  {
    id: 'floral',
    name: 'กระทงพฤกษาสวรรค์',
    subtitle: 'มวลบุปผาหลากสีสัน',
    desc: 'รวบรวมดอกดาวเรือง มะลิ กุหลาบ และกล้วยไม้ สดชื่นเบิกบาน หอมฟุ้งทั่วสายธาร',
    meaning: 'เติมเต็มชีวิตด้วยความสุข ความสดชื่น และความสัมพันธ์อันอบอุ่น',
    themeColor: '#ab47bc',
    accentColor: '#e1bee7'
  }
];

const CANDLE_COLORS = [
  { id: 'gold', name: 'แสงทองอบอุ่น', flame: '#ff9800', inner: '#fffde7', aura: 'rgba(255, 170, 0, 0.55)' },
  { id: 'pink', name: 'แสงชมพูเสน่หา', flame: '#f06292', inner: '#fce4ec', aura: 'rgba(240, 98, 146, 0.55)' },
  { id: 'blue', name: 'แสงฟ้าบริสุทธิ์', flame: '#29b6f6', inner: '#e1f5fe', aura: 'rgba(41, 182, 246, 0.55)' },
  { id: 'green', name: 'แสงมรกตโชคลาภ', flame: '#66bb6a', inner: '#e8f5e9', aura: 'rgba(102, 187, 106, 0.55)' }
];

const POPULAR_WISHES = [
  'ขอขมาพระแม่คงคา ที่ได้ใช้น้ำและทิ้งสิ่งปฏิกูล ขอให้ชีวิตร่มเย็นเป็นสุข',
  'ขอให้ความทุกข์ โศก โรค ภัย เคราะห์ร้ายทั้งปวง ลอยไปกับสายน้ำในคืนนี้',
  'ขอให้ครอบครัวและคนที่รักมีความสุข สุขภาพแข็งแรง ไร้โรคภัยเบียดเบียน',
  'ขอให้การงาน การเรียนก้าวหน้าราบรื่น มีความสำเร็จและโชคลาภตลอดปี',
  'ขอให้พบเจอแต่ความรักที่ดี สมหวัง มีความเข้าใจและซื่อสัตย์ต่อกัน',
  'ขออธิษฐานให้มีสติ ปัญญา จิตใจสงบ ผ่องใส ดั่งพระจันทร์วันเพ็ญ'
];

// High-definition Canvas Krathong Renderer
class KrathongRenderer {
  static drawKrathong(ctx, typeId, candleColorId, size, time = 0) {
    ctx.save();

    // 1. Water Ripple underneath
    const ripplePulse = Math.sin(time * 2.5) * 4;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.32, size * 0.78 + ripplePulse, size * 0.28 + ripplePulse * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    // 2. Base & Petals with sharp lines and rich lighting
    switch (typeId) {
      case 'lotus':
        this.drawLotusBase(ctx, size);
        break;
      case 'bread':
        this.drawBreadBase(ctx, size);
        break;
      case 'coconut':
        this.drawCoconutBase(ctx, size);
        break;
      case 'gold':
        this.drawGoldBase(ctx, size);
        break;
      case 'floral':
        this.drawFloralBase(ctx, size);
        break;
      case 'traditional':
      default:
        this.drawTraditionalBase(ctx, size);
        break;
    }

    // 3. Incense Sticks (3 sticks with red glowing tips)
    this.drawIncense(ctx, size, time);

    // 4. Candle & Flickering Flame
    this.drawCandle(ctx, size, candleColorId, time);

    ctx.restore();
  }

  static drawTraditionalBase(ctx, size) {
    const w = size * 0.78;
    const h = size * 0.4;
    const strokeW = Math.max(1.2, size * 0.016);

    // Banana trunk disk base
    ctx.fillStyle = '#1b5e20';
    ctx.strokeStyle = '#0d3810';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.45, w * 0.85, h * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Folded outer banana leaves
    const leaves = 12;
    for (let i = 0; i < leaves; i++) {
      const angle = (i / leaves) * Math.PI * 2;
      const x = Math.cos(angle) * (w * 0.75);
      const y = Math.sin(angle) * (h * 0.45) + (h * 0.25);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      // Leaf triangle / petal
      ctx.fillStyle = (i % 2 === 0) ? '#2e7d32' : '#388e3c';
      ctx.strokeStyle = '#144d18';
      ctx.lineWidth = strokeW;

      ctx.beginPath();
      ctx.moveTo(-size * 0.13, 0);
      ctx.quadraticCurveTo(0, -size * 0.28, size * 0.13, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leaf center fold line
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = strokeW * 0.9;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * 0.24);
      ctx.stroke();

      ctx.restore();
    }

    // Inner layer of smaller bright leaves
    for (let i = 0; i < leaves; i++) {
      const angle = ((i + 0.5) / leaves) * Math.PI * 2;
      const x = Math.cos(angle) * (w * 0.55);
      const y = Math.sin(angle) * (h * 0.35) + (h * 0.2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      ctx.fillStyle = '#43a047';
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = strokeW * 0.8;

      ctx.beginPath();
      ctx.moveTo(-size * 0.1, 0);
      ctx.quadraticCurveTo(0, -size * 0.22, size * 0.1, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Center flowers: Yellow marigolds and purple orchids
    this.drawFlowerBed(ctx, size, ['#fbc02d', '#f57f17', '#8e24aa', '#d81b60']);
  }

  static drawLotusBase(ctx, size) {
    const w = size * 0.82;
    const h = size * 0.42;
    const strokeW = Math.max(1.2, size * 0.016);

    // Green lotus pod base
    ctx.fillStyle = '#33691e';
    ctx.strokeStyle = '#1b3a0c';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.4, w * 0.75, h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Outer pink lotus petals
    const petals = 10;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const x = Math.cos(angle) * (w * 0.72);
      const y = Math.sin(angle) * (h * 0.45) + (h * 0.2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      const grad = ctx.createLinearGradient(0, 0, 0, -size * 0.3);
      grad.addColorStop(0, '#fce4ec');
      grad.addColorStop(0.5, '#f06292');
      grad.addColorStop(1, '#c2185b');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#ad1457';
      ctx.lineWidth = strokeW;

      ctx.beginPath();
      ctx.moveTo(-size * 0.15, 0);
      ctx.quadraticCurveTo(-size * 0.17, -size * 0.22, 0, -size * 0.3);
      ctx.quadraticCurveTo(size * 0.17, -size * 0.22, size * 0.15, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Inner blooming petals
    for (let i = 0; i < petals; i++) {
      const angle = ((i + 0.5) / petals) * Math.PI * 2;
      const x = Math.cos(angle) * (w * 0.48);
      const y = Math.sin(angle) * (h * 0.3) + (h * 0.15);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      const grad = ctx.createLinearGradient(0, 0, 0, -size * 0.24);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, '#f48fb1');
      grad.addColorStop(1, '#e91e63');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#d81b60';
      ctx.lineWidth = strokeW * 0.8;

      ctx.beginPath();
      ctx.moveTo(-size * 0.11, 0);
      ctx.quadraticCurveTo(0, -size * 0.26, size * 0.11, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Golden pollen center
    ctx.fillStyle = '#ffb300';
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.15, size * 0.26, size * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  static drawBreadBase(ctx, size) {
    const w = size * 0.74;
    const h = size * 0.42;
    const strokeW = Math.max(1.2, size * 0.016);

    // Turtle bread limbs (legs and head)
    ctx.fillStyle = '#b26a27';
    ctx.strokeStyle = '#6d3910';
    ctx.lineWidth = strokeW;

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.48, size * 0.16, size * 0.19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4 flippers
    const flippers = [
      [-w * 0.72, -h * 0.1],
      [w * 0.72, -h * 0.1],
      [-w * 0.68, h * 0.52],
      [w * 0.68, h * 0.52]
    ];
    flippers.forEach(([fx, fy]) => {
      ctx.beginPath();
      ctx.ellipse(fx, fy, size * 0.13, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Turtle Shell body (baked golden crust)
    const shellGrad = ctx.createRadialGradient(0, 0, size * 0.05, 0, 0, w);
    shellGrad.addColorStop(0, '#f9cb90');
    shellGrad.addColorStop(0.7, '#d37f37');
    shellGrad.addColorStop(1, '#8d4414');

    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = '#542605';
    ctx.lineWidth = strokeW * 1.2;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.1, w * 0.82, h * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Turtle shell geometric pattern (bread cut lines)
    ctx.strokeStyle = '#4e2307';
    ctx.lineWidth = strokeW * 1.2;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.1, w * 0.46, h * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (w * 0.46), Math.sin(a) * (h * 0.36) + h * 0.1);
      ctx.lineTo(Math.cos(a) * (w * 0.8), Math.sin(a) * (h * 0.64) + h * 0.1);
      ctx.stroke();
    }

    // Little edible flower on shell
    this.drawFlower(ctx, 0, h * 0.1, size * 0.17, '#ffca28');
  }

  static drawCoconutBase(ctx, size) {
    const w = size * 0.76;
    const h = size * 0.42;
    const strokeW = Math.max(1.2, size * 0.016);

    // Outer dark coconut husk
    const huskGrad = ctx.createRadialGradient(0, h * 0.4, size * 0.1, 0, h * 0.2, w);
    huskGrad.addColorStop(0, '#4e342e');
    huskGrad.addColorStop(0.8, '#3e2723');
    huskGrad.addColorStop(1, '#271714');

    ctx.fillStyle = huskGrad;
    ctx.strokeStyle = '#1d0f0c';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.3, w * 0.86, h * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner coconut shell rim (white coconut flesh border)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = strokeW * 1.8;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.22, w * 0.76, h * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cast candle wax pool inside the shell
    const waxGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    waxGrad.addColorStop(0, '#fffde7');
    waxGrad.addColorStop(1, '#ffecb3');
    ctx.fillStyle = waxGrad;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.22, w * 0.72, h * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating scented jasmine petals on the wax
    const jasmines = 6;
    for (let i = 0; i < jasmines; i++) {
      const angle = (i / jasmines) * Math.PI * 2;
      const jx = Math.cos(angle) * (w * 0.48);
      const jy = Math.sin(angle) * (h * 0.28) + h * 0.2;
      this.drawFlower(ctx, jx, jy, size * 0.11, '#ffffff');
    }
  }

  static drawGoldBase(ctx, size) {
    const w = size * 0.82;
    const h = size * 0.42;
    const strokeW = Math.max(1.2, size * 0.016);

    // Golden metallic base
    const goldGrad = ctx.createLinearGradient(-w, 0, w, 0);
    goldGrad.addColorStop(0, '#b8860b');
    goldGrad.addColorStop(0.3, '#ffd700');
    goldGrad.addColorStop(0.5, '#fff8dc');
    goldGrad.addColorStop(0.8, '#ffd700');
    goldGrad.addColorStop(1, '#8b6508');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#725203';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.4, w * 0.82, h * 0.52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Golden lotus petals
    const petals = 12;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const x = Math.cos(angle) * (w * 0.74);
      const y = Math.sin(angle) * (h * 0.45) + (h * 0.2);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);

      const pGrad = ctx.createLinearGradient(0, 0, 0, -size * 0.3);
      pGrad.addColorStop(0, '#daa520');
      pGrad.addColorStop(0.6, '#ffd700');
      pGrad.addColorStop(1, '#fffde7');

      ctx.fillStyle = pGrad;
      ctx.strokeStyle = '#996515';
      ctx.lineWidth = strokeW;

      ctx.beginPath();
      ctx.moveTo(-size * 0.12, 0);
      ctx.lineTo(-size * 0.06, -size * 0.28);
      ctx.lineTo(0, -size * 0.32);
      ctx.lineTo(size * 0.06, -size * 0.28);
      ctx.lineTo(size * 0.12, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // Golden sparkling flower bed
    this.drawFlowerBed(ctx, size, ['#ffe082', '#ffca28', '#ffb300', '#fff8e1']);
  }

  static drawFloralBase(ctx, size) {
    const w = size * 0.8;
    const h = size * 0.42;
    const strokeW = Math.max(1.2, size * 0.016);

    // Leaf plate base
    ctx.fillStyle = '#2e7d32';
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.4, w * 0.82, h * 0.54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Outer ring of colorful orchids and roses
    const colors = ['#e91e63', '#ab47bc', '#ffca28', '#26a69a', '#ff7043', '#ec407a'];
    const flowers = 10;
    for (let i = 0; i < flowers; i++) {
      const angle = (i / flowers) * Math.PI * 2;
      const fx = Math.cos(angle) * (w * 0.64);
      const fy = Math.sin(angle) * (h * 0.38) + h * 0.22;
      this.drawFlower(ctx, fx, fy, size * 0.17, colors[i % colors.length]);
    }

    // Inner ring
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const fx = Math.cos(angle) * (w * 0.36);
      const fy = Math.sin(angle) * (h * 0.22) + h * 0.18;
      this.drawFlower(ctx, fx, fy, size * 0.14, '#fff9c4');
    }
  }

  static drawFlowerBed(ctx, size, colors) {
    const w = size * 0.48;
    const h = size * 0.26;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const fx = Math.cos(angle) * (w * 0.72);
      const fy = Math.sin(angle) * (h * 0.72) + (h * 0.6);
      this.drawFlower(ctx, fx, fy, size * 0.14, colors[i % colors.length]);
    }
  }

  static drawFlower(ctx, x, y, r, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1;

    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      const px = Math.cos(a) * (r * 0.55);
      const py = Math.sin(a) * (r * 0.55);
      ctx.beginPath();
      ctx.arc(px, py, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Center pollen
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  static drawIncense(ctx, size, time) {
    const incPos = [
      { x: -size * 0.08, angle: -0.1 },
      { x: -size * 0.02, angle: -0.02 },
      { x: size * 0.04, angle: 0.08 }
    ];

    incPos.forEach((p, idx) => {
      ctx.save();
      ctx.translate(p.x, size * 0.05);
      ctx.rotate(p.angle);

      // Stick
      ctx.strokeStyle = '#6d4c41';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * 0.46);
      ctx.stroke();

      // Incense body (pinkish-brown)
      ctx.strokeStyle = '#d7ccc8';
      ctx.lineWidth = 3.6;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.1);
      ctx.lineTo(0, -size * 0.43);
      ctx.stroke();

      // Glowing tip
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.arc(0, -size * 0.44, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Smoke wisp
      const smokeOffset = Math.sin(time * 3 + idx) * 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.45);
      ctx.bezierCurveTo(
        smokeOffset, -size * 0.53,
        -smokeOffset, -size * 0.62,
        smokeOffset * 1.5, -size * 0.74
      );
      ctx.stroke();

      ctx.restore();
    });
  }

  static drawCandle(ctx, size, candleColorId, time) {
    const candleConfig = CANDLE_COLORS.find(c => c.id === candleColorId) || CANDLE_COLORS[0];
    const candleWidth = size * 0.09;
    const candleHeight = size * 0.38;
    const candleY = size * 0.05;

    ctx.save();
    ctx.translate(size * 0.12, candleY);

    // Candle stick (yellow wax)
    const waxGrad = ctx.createLinearGradient(-candleWidth / 2, 0, candleWidth / 2, 0);
    waxGrad.addColorStop(0, '#fff59d');
    waxGrad.addColorStop(0.5, '#fffde7');
    waxGrad.addColorStop(1, '#ffee58');

    ctx.fillStyle = waxGrad;
    ctx.strokeStyle = '#d4c03b';
    ctx.lineWidth = 1;
    ctx.fillRect(-candleWidth / 2, -candleHeight, candleWidth, candleHeight);
    ctx.strokeRect(-candleWidth / 2, -candleHeight, candleWidth, candleHeight);

    // Candle Wick
    ctx.strokeStyle = '#271915';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -candleHeight);
    ctx.lineTo(0, -candleHeight - 6);
    ctx.stroke();

    // Flickering Flame parameters
    const flicker = Math.sin(time * 12) * 1.5 + Math.cos(time * 24) * 0.8;
    const flameHeight = size * 0.24 + flicker;
    const flameWidth = size * 0.1;
    const flameTop = -candleHeight - 6;

    // Glowing Aura behind flame
    const auraGrad = ctx.createRadialGradient(0, flameTop - flameHeight * 0.5, 2, 0, flameTop - flameHeight * 0.5, size * 0.58);
    auraGrad.addColorStop(0, candleConfig.aura);
    auraGrad.addColorStop(0.4, 'rgba(255, 200, 100, 0.22)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, flameTop - flameHeight * 0.5, size * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Outer Flame (Teardrop shape)
    ctx.save();
    ctx.translate(flicker * 0.5, 0);

    ctx.fillStyle = candleConfig.flame;
    ctx.beginPath();
    ctx.moveTo(0, flameTop - flameHeight);
    ctx.quadraticCurveTo(flameWidth, flameTop - flameHeight * 0.4, 0, flameTop);
    ctx.quadraticCurveTo(-flameWidth, flameTop - flameHeight * 0.4, 0, flameTop - flameHeight);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = candleConfig.inner;
    ctx.beginPath();
    ctx.moveTo(0, flameTop - flameHeight * 0.72);
    ctx.quadraticCurveTo(flameWidth * 0.45, flameTop - flameHeight * 0.3, 0, flameTop);
    ctx.quadraticCurveTo(-flameWidth * 0.45, flameTop - flameHeight * 0.3, 0, flameTop - flameHeight * 0.72);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // Generate crisp Retina/High-DPI Preview Canvas
  static createPreviewCanvas(typeId, candleColorId = 'gold', width = 160, height = 160) {
    const canvas = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.translate(width / 2, height / 2 + 15);
    this.drawKrathong(ctx, typeId, candleColorId, width * 0.65, 0);
    return canvas.toDataURL('image/png');
  }
}

window.KRATHONG_TYPES = KRATHONG_TYPES;
window.CANDLE_COLORS = CANDLE_COLORS;
window.POPULAR_WISHES = POPULAR_WISHES;
window.KrathongRenderer = KrathongRenderer;
