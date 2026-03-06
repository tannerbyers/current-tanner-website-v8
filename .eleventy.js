const { DateTime } = require("luxon");
const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Alias `layout: post` to `layout: layouts/post.njk`
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    );
  }

  eleventyConfig.addFilter("filterTagList", filterTagList);

  // Reading time estimate
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / 225);
    return `${minutes} min read`;
  });

  // Current year shortcode for copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Table of contents filter — extracts h2/h3 from rendered HTML
  eleventyConfig.addFilter("toc", (content) => {
    if (!content) return "";
    const headings = [];
    const regex = /<h([23])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      const text = match[3].replace(/<a[^>]*class="direct-link"[^>]*>.*?<\/a>/gi, "").replace(/<[^>]*>/g, "").trim();
      if (text) headings.push({ level, id, text });
    }
    if (headings.length < 2) return "";
    let html = '<nav class="toc" aria-label="Table of contents"><h2 class="toc-title">Contents</h2><ol>';
    for (const h of headings) {
      html += `<li class="toc-l${h.level}"><a href="#${h.id}">${h.text}</a></li>`;
    }
    html += "</ol></nav>";
    return html;
  });

  // Related posts filter — finds posts sharing the most tags
  eleventyConfig.addFilter("relatedPosts", (collection, currentPage, tags, limit = 3) => {
    if (!collection || !tags) return [];
    const currentTags = filterTagList(tags);
    if (currentTags.length === 0) return [];
    return collection
      .filter(post => post.url !== currentPage.url)
      .map(post => {
        const postTags = filterTagList(post.data.tags || []);
        const shared = currentTags.filter(t => postTags.includes(t)).length;
        return { post, shared };
      })
      .filter(r => r.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.post.date - a.post.date)
      .slice(0, limit)
      .map(r => r.post);
  });

  // Cache-busting filter — appends content hash to asset URLs
  eleventyConfig.addFilter("cacheBust", (url) => {
    try {
      const filePath = `src${url}`;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
        return `${url}?v=${hash}`;
      }
    } catch (e) { /* ignore */ }
    return url;
  });

  // Git last modified date for content files
  eleventyConfig.addFilter("gitLastModified", (inputPath) => {
    try {
      const result = execSync(`git log -1 --format="%ai" -- "${inputPath}"`, {
        encoding: "utf-8",
        cwd: process.cwd(),
      }).trim();
      if (result) return new Date(result);
    } catch (e) { /* ignore */ }
    return null;
  });

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  // Excerpt support: use --- as separator in post content
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#",
      level: [1, 2, 3, 4],
    }),
    slugify: eleventyConfig.getFilter("slug"),
  });

  // Lazy loading for markdown images
  const defaultImageRender = markdownLibrary.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  markdownLibrary.renderer.rules.image = function (tokens, idx, options, env, self) {
    tokens[idx].attrSet("loading", "lazy");
    tokens[idx].attrSet("decoding", "async");
    return defaultImageRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", markdownLibrary);

  // HTML minification for production builds
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.outputPath || "").endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      });
    }
    return content;
  });

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  eleventyConfig.addShortcode("jsFiddle", function (url) {
    if (url) {
      return `<iframe width="100%" height="400" 
    src="${url}"
    allowFullScreen="allowfullscreen"
    frameBorder="0"
    ></iframe>`;
    }
  });

  const shouldHide = ({ date, draft }) => {
    if (process.env.BUILD_DRAFTS) {
      return false
    }
    const isDraft = draft
    const isPageFromFuture = date && date.getTime() > Date.now()
    return isDraft || isPageFromFuture
  }
  
  // When `permalink` is false, the file is not written to disk
  eleventyConfig.addGlobalData("eleventyComputed.permalink", function () {
    return data => {
      // Always skip during non-watch/serve builds
      if (shouldHide(data)) {
        return false
      }
  
      return data.permalink
    }
  })
  
  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData(
    "eleventyComputed.eleventyExcludeFromCollections",
    function () {
      return data => {
        // Always exclude from non-watch/serve builds
        if (shouldHide(data)) {
          return true
        }
  
        return data.eleventyExcludeFromCollections
      }
    }
  )
  
  eleventyConfig.on("eleventy.before", ({ runMode }) => {
    // Set the environment variable
    if (runMode === "serve" || runMode === "watch") {
      process.env.BUILD_DRAFTS = true
    }
  })  

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: "src",
      includes: "../_includes",
      data: "../_data",
      output: "./_site",
    },
  };
};
