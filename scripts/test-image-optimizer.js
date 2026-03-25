#!/usr/bin/env node

const imageOptimizer = require('../lib/image-optimizer');
const path = require('path');
const fs = require('fs-extra');

async function testImageOptimizer() {
  console.log('Testing image optimizer...');
  
  // Test image path - adjust as needed
  const testImagePath = path.join(process.cwd(), 'src/img/sample-landscape.jpg');
  
  // If test image doesn't exist, create a placeholder
  if (!fs.existsSync(testImagePath)) {
    console.log(`Test image not found at ${testImagePath}`);
    console.log('Creating a placeholder image for testing...');
    
    // Ensure directory exists
    await fs.ensureDir(path.dirname(testImagePath));
    
    // Create a simple test image using sharp
    const sharp = require('sharp');
    await sharp({
      create: {
        width: 1200,
        height: 800,
        channels: 3,
        background: { r: 0, g: 100, b: 200 }
      }
    })
    .jpeg()
    .toFile(testImagePath);
    
    console.log('Created test image.');
  }

  // Create a portrait test image if it doesn't exist
  const testPortraitPath = path.join(process.cwd(), 'src/img/sample-portrait.jpg');
  if (!fs.existsSync(testPortraitPath)) {
    console.log('Creating a portrait test image...');
    const sharp = require('sharp');
    await sharp({
      create: {
        width: 800,
        height: 1200,
        channels: 3,
        background: { r: 200, g: 100, b: 50 }
      }
    })
    .jpeg()
    .toFile(testPortraitPath);
    console.log('Created portrait test image.');
  }
  
  console.log(`Optimizing image: ${testImagePath}`);
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'test-output');
  await fs.ensureDir(outputDir);
  
  // Run the optimizer
  const result = await imageOptimizer.optimize(testImagePath, outputDir);
  
  if (!result) {
    console.error('Optimization failed!');
    return;
  }
  
  console.log('Optimization successful!');
  console.log('Generated variants:');
  
  // Log the sources
  result.sources.forEach(source => {
    console.log(`- ${source.type}: ${source.srcset}`);
  });
  
  // Log the fallback
  console.log(`Fallback: ${result.fallback.url} (${result.fallback.width}x${result.fallback.height})`);
  
  console.log(`\nAll optimized images are in: ${outputDir}`);
}

testImageOptimizer().catch(err => {
  console.error('Error testing image optimizer:', err);
  process.exit(1);
});
