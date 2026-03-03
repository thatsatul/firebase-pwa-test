const sharp = require('sharp');
const fs = require('fs');

const svgIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4CAF50"/>
  <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="central" fill="white" font-family="Arial, sans-serif" font-weight="bold">T</text>
</svg>
`;

async function createIcons() {
  await sharp(Buffer.from(svgIcon(192)))
    .png()
    .toFile('public/icon-192.png');
  
  await sharp(Buffer.from(svgIcon(512)))
    .png()
    .toFile('public/icon-512.png');
  
  console.log('PNG icons created successfully');
}

createIcons().catch(console.error);
