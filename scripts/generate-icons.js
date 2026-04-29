import { readFileSync, writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

// CRC32 for PNG chunks
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) | 0;
}

function createPNG(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth
  ihdrData.writeUInt8(6, 9);   // RGBA
  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = crc32(Buffer.concat([ihdrType, ihdrData]));
  const ihdrLen = Buffer.alloc(4); ihdrLen.writeUInt32BE(13, 0);
  const ihdrCrcBuf = Buffer.alloc(4); ihdrCrcBuf.writeInt32BE(ihdrCrc, 0);

  // Generate pixel data
  const rawData = [];
  const cx = size / 2, cy = size * 0.43;
  const radius = size * 0.22;
  const cornerR = size * 0.22;

  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      // Rounded rect check
      const inCorner = (
        (x < cornerR && y < cornerR && Math.hypot(x - cornerR, y - cornerR) > cornerR) ||
        (x > size - cornerR && y < cornerR && Math.hypot(x - (size - cornerR), y - cornerR) > cornerR) ||
        (x < cornerR && y > size - cornerR && Math.hypot(x - cornerR, y - (size - cornerR)) > cornerR) ||
        (x > size - cornerR && y > size - cornerR && Math.hypot(x - (size - cornerR), y - (size - cornerR)) > cornerR)
      );

      if (inCorner) {
        rawData.push(0, 0, 0, 0); // transparent
        continue;
      }

      // Background gradient (lavender to pink)
      const gradT = (x + y) / (size * 2);
      const bgR = Math.round(232 + (245 - 232) * gradT);
      const bgG = Math.round(213 + (221 - 213) * gradT);
      const bgB = Math.round(245 + (232 - 245) * gradT);

      // Distance from flower center
      const dist = Math.hypot(x - cx, y - cy);

      // Soft glow behind flower
      const glowR = radius * 2.5;
      const glow = Math.max(0, 1 - dist / glowR);

      // Petal check - 5 petals arranged in a circle
      let onPetal = false;
      let petalColor = [0, 0, 0];
      const petalLen = radius * 1.6;
      const petalWidth = radius * 0.55;

      for (let p = 0; p < 5; p++) {
        const angle = (p * 72 - 90) * Math.PI / 180;
        const px = cx + Math.cos(angle) * petalLen * 0.5;
        const py = cy + Math.sin(angle) * petalLen * 0.5;

        // Elliptical distance along petal axis
        const dx = x - cx;
        const dy = y - cy;
        const along = dx * Math.cos(angle) + dy * Math.sin(angle);
        const across = -dx * Math.sin(angle) + dy * Math.cos(angle);

        if (along > 0 && along < petalLen && Math.abs(across) < petalWidth * (1 - (along / petalLen) * 0.3)) {
          onPetal = true;
          const t = along / petalLen;
          // Pink gradient along petal
          petalColor = [
            Math.round(245 - t * 20 + p * 3),
            Math.round(192 - t * 30 - p * 5),
            Math.round(216 - t * 15 + p * 2),
          ];
          break;
        }
      }

      // Center of flower
      const centerR = radius * 0.35;
      const onCenter = dist < centerR;

      // Stem
      const stemTop = cy + radius * 0.6;
      const stemBot = size * 0.85;
      const onStem = x > cx - 3 && x < cx + 3 && y > stemTop && y < stemBot;

      if (onCenter) {
        // Golden center
        const ct = dist / centerR;
        rawData.push(
          Math.round(255 - ct * 20),
          Math.round(232 - ct * 30),
          Math.round(160 - ct * 20),
          255
        );
      } else if (onPetal) {
        rawData.push(petalColor[0], petalColor[1], petalColor[2], 255);
      } else if (onStem) {
        rawData.push(120, 170, 120, 255);
      } else {
        // Background with glow
        rawData.push(
          Math.round(bgR + glow * 15),
          Math.round(bgG + glow * 15),
          Math.round(bgB + glow * 8),
          255
        );
      }
    }
  }

  const compressed = deflateSync(Buffer.from(rawData));

  // IDAT
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, compressed]));
  const idatLen = Buffer.alloc(4); idatLen.writeUInt32BE(compressed.length, 0);
  const idatCrcBuf = Buffer.alloc(4); idatCrcBuf.writeInt32BE(idatCrc, 0);

  // IEND
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([
    signature,
    ihdrLen, ihdrType, ihdrData, ihdrCrcBuf,
    idatLen, idatType, compressed, idatCrcBuf,
    iend
  ]);
}

writeFileSync('public/icons/icon-192.png', createPNG(192));
writeFileSync('public/icons/icon-512.png', createPNG(512));
writeFileSync('public/apple-touch-icon.png', createPNG(180));
console.log('Icons generated: 192px, 512px, 180px (apple-touch)');
