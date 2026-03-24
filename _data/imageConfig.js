module.exports = {
  // Source directory for original images
  srcDir: "src/img",

  // Output directory for optimized images
  outputDir: "src/img/optimized",

  // Image widths to generate for responsive images
  widths: [400, 800, 1200, 1600],

  // Quality setting for JPEG/WebP images
  quality: 80,

  // Supported image formats to process
  formats: ["jpeg", "png", "webp"],

  // Cache directory to store hashes of processed images
  cacheDir: ".cache/image-optimizer",

  // Whether to enable image enhancement for low-quality images
  enhance: true,
};
