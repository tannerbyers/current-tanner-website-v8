---
title: Using Optimized Images in Posts
description: A demonstration of the new image optimization pipeline
date: 2023-03-24
tags:
  - images
  - optimization
  - tutorial
---

# Using Optimized Images in Posts

This post demonstrates how to use the new image optimization pipeline in your blog posts.

## Markdown Images

Simply use standard markdown image syntax, and the images will be automatically optimized:

![A beautiful landscape](/img/sample-landscape.jpg)

## Shortcode for More Control

For more control over image sizing and presentation, you can use the `optimizedImage` shortcode:

{% optimizedImage "/img/sample-portrait.jpg", "A portrait image with custom sizing", "(min-width: 1200px) 50vw, 100vw", "featured-image" %}

## Benefits of Image Optimization

1. **Faster page loads** - Smaller file sizes mean quicker downloads
2. **Better SEO** - Page speed is a ranking factor
3. **Reduced bandwidth** - Save on hosting costs and user data
4. **Modern formats** - WebP support with JPEG fallback
5. **Responsive sizes** - The right image size for every device

## How It Works

The image optimization pipeline:

1. Takes your original high-resolution images
2. Creates multiple sizes for different viewports
3. Converts to modern formats like WebP with fallbacks
4. Generates responsive HTML with proper srcset attributes
5. Caches processed images to avoid redundant processing

<!-- excerpt -->

Try adding some images to your own posts now!
