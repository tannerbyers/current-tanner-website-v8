const path = require("path");

module.exports = {
  // Supported image formats
  formats: ["jpg", "jpeg", "png", "webp", "avif"],
  
  // Cache directory for processed images
  cacheDir: path.join(__dirname, "../.cache/img"),
  
  // Output directory for optimized images
  outputDir: path.join(__dirname, "../_site/img/optimized"),
  
  // Standard widths for responsive images
  widths: [320, 640, 960, 1280, 1600],
  
  // JPEG and WebP quality (0-100)
  quality: 80,
  
  // Enhance low-quality images
  enhance: true,
  
  // Default sizes attribute for responsive images
  defaultSizes: "(min-width: 1280px) 1280px, 100vw"
};
