import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

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

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth
  ihdrData.writeUInt8(2, 9);   // RGB
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = crc32(Buffer.concat([ihdrType, ihdrData]));
  const ihdrLen = Buffer.alloc(4);
  ihdrLen.writeUInt32BE(13, 0);
  const ihdrCrcBuf = Buffer.alloc(4);
  ihdrCrcBuf.writeInt32BE(ihdrCrc, 0);

  const rawData = [];
  const radius = size * 0.22;

  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      const inCorner = (
        (x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius) ||
        (x > size - radius && y < radius && Math.hypot(x - (size - radius), y - radius) > radius) ||
        (x < radius && y > size - radius && Math.hypot(x - radius, y - (size - radius)) > radius) ||
        (x > size - radius && y > size - radius && Math.hypot(x - (size - radius), y - (size - radius)) > radius)
      );

      if (inCorner) {
        rawData.push(250, 245, 240); // cream/transparent corners
      } else {
        const cx = size / 2, cy = size / 2;
        const dist = Math.hypot(x - cx, y - cy) / (size / 2);
        const blend = Math.min(1, dist * 0.6);
        // Lavender gradient
        rawData.push(
          Math.round(232 * (1 - blend) + 200 * blend),
          Math.round(213 * (1 - blend) + 168 * blend),
          Math.round(245 * (1 - blend) + 232 * blend)
        );
      }
    }
  }

  const compressed = deflateSync(Buffer.from(rawData));
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, compressed]));
  const idatLen = Buffer.alloc(4);
  idatLen.writeUInt32BE(compressed.length, 0);
  const idatCrcBuf = Buffer.alloc(4);
  idatCrcBuf.writeInt32BE(idatCrc, 0);

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
console.log('Icons generated: icon-192.png, icon-512.png, apple-touch-icon.png');
