const fs = require('fs');
const path = require('path');

function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4CAF50"/>
  <text x="${size/2}" y="${size/2 + size/6}" font-size="${size/2}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">T</text>
</svg>`;
}

fs.writeFileSync(path.join(__dirname, 'public', 'icon-192.png.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(__dirname, 'public', 'icon-512.png.svg'), createSVGIcon(512));
console.log('Icons created successfully');
