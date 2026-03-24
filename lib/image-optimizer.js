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
  const ext = path.extname(srcPath).toLowerCase();
  if (!isSupportedFormat(ext)) {
    return null;
  }

  const hash = await hashFile(srcPath);
  if (await hasProcessed(hash)) {
    // Already processed
    return null;
  }

  const fileName = path.basename(srcPath, ext);
  await fs.ensureDir(outputDir);

  const metadata = await sharp(srcPath).metadata();

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
    const outputFileName = `${fileName}-${width}${ext}`;
    const outputFilePath = path.join(outputDir, outputFileName);

    await pipeline
      .resize(width)
      .toFormat(ext.replace(".", ""), { quality: imageConfig.quality })
      .toFile(outputFilePath);

    generatedImages.push({
      width,
      url: `/img/optimized/${outputFileName}`,
      path: outputFilePath,
    });
  }

  // Also generate WebP fallback for each size
  for (const width of imageConfig.widths) {
    if (metadata.width && width > metadata.width) {
      continue;
    }
    const outputFileName = `${fileName}-${width}.webp`;
    const outputFilePath = path.join(outputDir, outputFileName);

    await pipeline
      .resize(width)
      .webp({ quality: imageConfig.quality })
      .toFile(outputFilePath);

    generatedImages.push({
      width,
      url: `/img/optimized/${outputFileName}`,
      path: outputFilePath,
      webp: true,
    });
  }

  await markProcessed(hash, { generatedImages });

  return generatedImages;
};

module.exports = {
  processImage,
};
