#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// This script checks for basic accessibility issues without requiring a browser
const issuesFound = [];

function checkContrastRatio(rgb) {
  // Parse rgb or hex color
  let r, g, b;
  if (rgb.startsWith('#')) {
    const hex = rgb.replace('#', '');
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    const match = rgb.match(/\d+/g);
    if (match) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance;
}

function getContrastRatio(foreground, background) {
  const fgLum = checkContrastRatio(foreground);
  const bgLum = checkContrastRatio(background);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function scanFile(filePath) {
  console.log(`\nScanning: ${filePath}`);
  console.log('='.repeat(60));
  
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Check for heading hierarchy
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach((h, idx) => {
    const level = parseInt(h.tagName[1]);
    if (level > lastLevel + 1) {
      issuesFound.push({
        file: filePath,
        type: 'Heading Hierarchy',
        severity: 'WARNING',
        message: `Heading hierarchy skip from H${lastLevel} to H${level}`,
        element: h.textContent.substring(0, 50)
      });
    }
    lastLevel = level;
  });
  
  // Check images for alt text
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      issuesFound.push({
        file: filePath,
        type: 'Missing Alt Text',
        severity: 'ERROR',
        message: 'Image missing alt attribute',
        element: img.getAttribute('src') || 'Unknown'
      });
    }
  });
  
  // Check for color contrast issues in inline styles
  const elementsWithStyle = doc.querySelectorAll('[style*="color"]');
  elementsWithStyle.forEach(el => {
    const style = el.getAttribute('style');
    const colorMatch = style.match(/color:\s*([^;]+)/);
    const bgMatch = style.match(/background[^:]*:\s*([^;]+)/);
    
    if (colorMatch && bgMatch) {
      const fg = colorMatch[1].trim();
      const bg = bgMatch[1].trim();
      const contrast = getContrastRatio(fg, bg);
      
      if (contrast < 4.5) { // WCAG AA minimum for normal text
        issuesFound.push({
          file: filePath,
          type: 'Contrast Ratio',
          severity: 'ERROR',
          message: `Low contrast ratio: ${contrast.toFixed(2)}:1 (need 4.5:1 for AA)`,
          element: `fg: ${fg}, bg: ${bg}`,
          text: el.textContent.substring(0, 50)
        });
      }
    }
  });
  
  // Check for form labels
  const inputs = doc.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const name = input.getAttribute('name');
    const ariaLabel = input.getAttribute('aria-label');
    
    if (!ariaLabel && id) {
      const label = doc.querySelector(`label[for="${id}"]`);
      if (!label) {
        issuesFound.push({
          file: filePath,
          type: 'Missing Form Label',
          severity: 'WARNING',
          message: 'Form input missing associated label',
          element: name || id
        });
      }
    }
  });
}

// Scan all HTML files in _site
const siteDir = path.join(__dirname, '_site');
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      scanFile(fullPath);
    }
  });
}

walkDir(siteDir);

// Report results
console.log('\n\n' + '='.repeat(60));
console.log('ACCESSIBILITY SCAN RESULTS');
console.log('='.repeat(60));

if (issuesFound.length === 0) {
  console.log('\n✅ No accessibility issues found!');
} else {
  const errors = issuesFound.filter(i => i.severity === 'ERROR');
  const warnings = issuesFound.filter(i => i.severity === 'WARNING');
  
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(issue => {
      console.log(`\n  File: ${path.relative(siteDir, issue.file)}`);
      console.log(`  Type: ${issue.type}`);
      console.log(`  Issue: ${issue.message}`);
      console.log(`  Element: ${issue.element}`);
      if (issue.text) console.log(`  Text: "${issue.text}"`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(issue => {
      console.log(`\n  File: ${path.relative(siteDir, issue.file)}`);
      console.log(`  Type: ${issue.type}`);
      console.log(`  Issue: ${issue.message}`);
      console.log(`  Element: ${issue.element}`);
    });
  }
}

process.exit(issuesFound.some(i => i.severity === 'ERROR') ? 1 : 0);
