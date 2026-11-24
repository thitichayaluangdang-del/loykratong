// test.js - Simple automated test for server and files
const http = require('http');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'style.css',
  'js/audio.js',
  'js/krathongs.js',
  'js/fireworks.js',
  'js/lanterns.js',
  'js/river.js',
  'js/app.js'
];

console.log('--- เริ่มการตรวจสอบไฟล์ในโปรเจกต์ ---');
let missing = 0;
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ พบไฟล์: ${file}`);
  } else {
    console.log(`❌ ไม่พบไฟล์: ${file}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`พบข้อผิดพลาด: ขาดไฟล์ ${missing} ไฟล์`);
  process.exit(1);
} else {
  console.log('🎉 ตรวจสอบไฟล์ทั้งหมดผ่านเรียบร้อย!');
  process.exit(0);
}
