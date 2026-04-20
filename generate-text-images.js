import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const texts = ['Creative', 'Beautiful', 'Professional', 'Genius'];
const outputDir = path.join(process.cwd(), 'public/result-text');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

texts.forEach(text => {
  // Create canvas - larger size for high quality
  const canvas = createCanvas(1200, 400);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.font = 'bold 300px Arial, sans-serif';
  ctx.fillStyle = '#DC2626'; // red-600
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(outputDir, `${text.toLowerCase()}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Generated: ${filePath}`);
});

console.log('All text images generated successfully!');
