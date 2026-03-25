
const path = require("path");
const fs = require("fs-extra");
const crypto = require("crypto");
const sharp = require("sharp");
const imageConfig = require("../_data/imageConfig");

const isSupportedFormat = (ext) => {
  return imageConfig.formats.includes(ext.toLowerCase().replace(".", ""));
};

const hashFile = async (filePath) => {
  const hash = crypto.createHash("md5");
  const stream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
};

const ensureCacheDir = async () => {
  await fs.ensureDir(imageConfig.cacheDir);
  await fs.ensureDir(imageConfig.outputDir);
};

const getCacheFilePath = (hash) => {
  return path.join(imageConfig.cacheDir, `${hash}.json`);
};

const hasProcessed = async (hash) => {
  await ensureCacheDir();
  return fs.pathExists(getCacheFilePath(hash));
};

const markProcessed = async (hash, data) => {
  await ensureCacheDir();
  await fs.writeJson(getCacheFilePath(hash), data);
};

const processImage = async (srcPath, outputDir) => {
  try {
    const ext = path.extname(srcPath).toLowerCase();
    if (!isSupportedFormat(ext)) {
      console.warn(`Unsupported format ${ext} for ${srcPath}`);
      return null;
    }

    // Check if file exists
    if (!await fs.pathExists(srcPath)) {
      console.warn(`Image file not found: ${srcPath}`);
      return null;
    }

    const hash = await hashFile(srcPath);
    const cacheFilePath = getCacheFilePath(hash);
    
    // Check if we've already processed this image
    if (await hasProcessed(hash)) {
      // Return cached data
      const cachedData = await fs.readJson(cacheFilePath);
      return cachedData.generatedImages;
    }

    const fileName = path.basename(srcPath, ext);
    await fs.ensureDir(outputDir);

    // Get metadata with better error handling
    let metadata;
    try {
      metadata = await sharp(srcPath).metadata();
    } catch (err) {
      console.error(`Error reading metadata for ${srcPath}:`, err);
      // Try to continue with default values
      metadata = { width: 1200, height: 800 };
    }

    // Skip validation to allow processing of problematic images

    // Enhance image if enabled and if image is low quality (e.g. low resolution)
    let pipeline = sharp(srcPath);
    if (imageConfig.enhance && metadata.width && metadata.width < 800) {
      pipeline = pipeline.sharpen().normalize();
    }

    // Generate resized images for each width
    const generatedImages = [];
    for (const width of imageConfig.widths) {
      if (metadata.width && width > metadata.width) {
        // Skip sizes larger than original
        continue;
      }
      
      // Create a unique filename based on the hash and width
      const outputFileName = `${hash.substring(0, 8)}-${width}${ext}`;
      const outputFilePath = path.join(outputDir, outputFileName);
      const outputUrl = `/img/optimized/${outputFileName}`;

      // Skip if file already exists
      if (await fs.pathExists(outputFilePath)) {
        generatedImages.push({
          width,
          url: outputUrl,
          path: outputFilePath,
        });
        continue;
      }

      try {
        await pipeline
          .clone()
          .resize(width)
          .toFormat(ext.replace(".", ""), { quality: imageConfig.quality })
          .toFile(outputFilePath);

        generatedImages.push({
          width,
          url: outputUrl,
          path: outputFilePath,
        });
      } catch (err) {
        console.warn(`Failed to resize image to ${width}px: ${srcPath}`, err.message);
        // Try a simple copy if resize fails
        try {
          await fs.copyFile(srcPath, outputFilePath);
          generatedImages.push({
            width,
            url: outputUrl,
            path: outputFilePath,
          });
        } catch (copyErr) {
          console.error(`Failed to copy image as fallback: ${srcPath}`, copyErr.message);
        }
      }
    }

    // Also generate WebP version for each size
    for (const width of imageConfig.widths) {
      if (metadata.width && width > metadata.width) {
        continue;
      }
      
      // Create a unique filename based on the hash and width
      const outputFileName = `${hash.substring(0, 8)}-${width}.webp`;
      const outputFilePath = path.join(outputDir, outputFileName);
      const outputUrl = `/img/optimized/${outputFileName}`;

      // Skip if file already exists
      if (await fs.pathExists(outputFilePath)) {
        generatedImages.push({
          width,
          url: outputUrl,
          path: outputFilePath,
          webp: true,
        });
        continue;
      }

      try {
        await pipeline
          .clone()
          .resize(width)
          .webp({ quality: imageConfig.quality })
          .toFile(outputFilePath);

        generatedImages.push({
          width,
          url: outputUrl,
          path: outputFilePath,
          webp: true,
        });
      } catch (err) {
        console.warn(`Failed to create WebP version at ${width}px: ${srcPath}`, err.message);
        // Skip WebP if it fails - we'll still have the original format
      }
    }

    await markProcessed(hash, { generatedImages });

    return generatedImages;
  } catch (error) {
    console.error(`Error processing image ${srcPath}:`, error);
    return null;
  }
};

const optimize = async (imagePath, outputPath = null, options = {}) => {
  // Add options parameter with defaults
  const { forPost = false, postImageWidth = 800 } = options;

  try {
    // Check if file exists
    if (!await fs.pathExists(imagePath)) {
      console.warn(`Image not found: ${imagePath}`);
      return null;
    }
    
    const ext = path.extname(imagePath).toLowerCase();
    if (!isSupportedFormat(ext)) {
      console.warn(`Unsupported image format: ${ext}`);
      return null;
    }

    let variants;
    if (forPost) {
      // For post images, only generate the standard post width
      const outputDir = outputPath || path.join(process.cwd(), '_site/img/optimized');
      
      // Override the widths to use only the post image width
      const originalWidths = imageConfig.widths;
      imageConfig.widths = [postImageWidth];
      
      variants = await processImage(imagePath, outputDir);
      
      // Restore original widths
      imageConfig.widths = originalWidths;
    } else {
      // For regular images, use the normal responsive widths
      const outputDir = outputPath || path.join(process.cwd(), '_site/img/optimized');
      variants = await processImage(imagePath, outputDir);
    }
    
    if (!variants || variants.length === 0) {
      console.warn(`No variants generated for: ${imagePath}`);
      return null;
    }
  
    // Group by width for srcset generation
    const widthMap = {};
    const webpMap = {};
    
    variants.forEach(variant => {
      if (variant.webp) {
        webpMap[variant.width] = variant.url;
      } else {
        widthMap[variant.width] = variant.url;
      }
    });
    
    // Get original image dimensions
    const metadata = await sharp(imagePath).metadata();
    
    // Find the largest variant for fallback
    const fallbackWidth = Math.max(...Object.keys(widthMap).map(Number));
    const fallback = {
      url: widthMap[fallbackWidth],
      width: fallbackWidth,
      height: Math.round(fallbackWidth * (metadata.height / metadata.width))
    };
    
    // Generate srcsets
    const standardSrcset = Object.entries(widthMap)
      .map(([width, url]) => `${url} ${width}w`)
      .join(', ');
      
    const webpSrcset = Object.entries(webpMap)
      .map(([width, url]) => `${url} ${width}w`)
      .join(', ');
    
    return {
      sources: [
        webpSrcset ? { type: 'image/webp', srcset: webpSrcset } : null,
        standardSrcset ? { type: `image/${ext.replace('.', '')}`, srcset: standardSrcset } : null
      ].filter(Boolean),
      fallback,
      original: {
        width: metadata.width,
        height: metadata.height
      }
    };
  } catch (error) {
    console.error(`Error optimizing image ${imagePath}:`, error);
    return null;
  }
};

// New function to detect text-heavy images
const isTextHeavyImage = async (imagePath) => {
  try {
    // Use sharp to analyze the image
    const metadata = await sharp(imagePath).metadata();
    
    // For now, we'll use a simple heuristic:
    // 1. If the image is wider than 1000px originally, it likely has text that needs to be readable
    // 2. If the image has "meme" in the filename, assume it's text-heavy
    const filename = path.basename(imagePath).toLowerCase();
    return metadata.width > 1000 || filename.includes('meme');
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    return false;
  }
};

module.exports = {
  processImage,
  optimize,
  // Add a convenience function specifically for post images
  optimizePostImage: async (imagePath, outputPath = null) => {
    // Use a larger width for all post images (1200px)
    const postImageWidth = 1200;
    
    const result = await optimize(imagePath, outputPath, { 
      forPost: true, 
      postImageWidth 
    });
    
    // If optimization failed, create a fallback
    if (!result) {
      console.warn(`Creating fallback for failed post image: ${imagePath}`);
      try {
        // Check if file exists
        if (!await fs.pathExists(imagePath)) {
          return null;
        }
        
        // Create output directory
        const outputDir = outputPath || path.join(process.cwd(), '_site/img/optimized');
        await fs.ensureDir(outputDir);
        
        // Generate a simple hash for the filename
        const hash = crypto.createHash("md5").update(imagePath).digest("hex").substring(0, 8);
        const ext = path.extname(imagePath);
        const outputFileName = `${hash}-fallback${ext}`;
        const outputFilePath = path.join(outputDir, outputFileName);
        const outputUrl = `/img/optimized/${outputFileName}`;
        
        // Get image dimensions first
        let width = postImageWidth;
        let height = Math.round(postImageWidth * 0.75); // Default aspect ratio
        
        try {
          const metadata = await sharp(imagePath).metadata();
          if (metadata.width && metadata.height) {
            width = Math.min(metadata.width, postImageWidth);
            height = Math.round(width * (metadata.height / metadata.width));
          }
        } catch (err) {
          console.error(`Error getting dimensions for ${imagePath}:`, err);
        }
        
        try {
          // Try to process with sharp first
          await sharp(imagePath)
            .resize(postImageWidth)
            .toFile(outputFilePath);
        } catch (err) {
          console.warn(`Sharp processing failed, falling back to direct copy for: ${imagePath}`);
          // If sharp fails, just copy the file
          await fs.copy(imagePath, outputFilePath);
        }
        
        // Return a minimal result object
        return {
          sources: [
            { type: `image/${ext.replace('.', '')}`, srcset: `${outputUrl} ${width}w` }
          ],
          fallback: {
            url: outputUrl,
            width: width,
            height: height
          },
          original: {
            width: width,
            height: height
          }
        };
      } catch (err) {
        console.error(`Error creating fallback for ${imagePath}:`, err);
        return null;
      }
    }
    
    return result;
  }
};
