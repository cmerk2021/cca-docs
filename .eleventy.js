const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");

// TEMPORARY storage for private pages
let privatePagePaths = [];

module.exports = function (eleventyConfig) {
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });

  // GOV.UK styling rules
  md.renderer.rules.heading_open = function (tokens, idx) {
    const tag = tokens[idx].tag;
    const govukClass = {
      h1: "govuk-heading-xl",
      h2: "govuk-heading-l",
      h3: "govuk-heading-m",
      h4: "govuk-heading-s"
    }[tag] || "govuk-heading-s";
    return `<${tag} class="${govukClass}">`;
  };

  md.renderer.rules.bullet_list_open = () => '<ul class="govuk-list govuk-list--bullet">';
  md.renderer.rules.ordered_list_open = () => '<ol class="govuk-list govuk-list--number">';
  md.renderer.rules.blockquote_open = () => '<blockquote class="govuk-inset-text">';

  md.renderer.rules.paragraph_open = function (tokens, idx) {
    const insideList = tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";
    return insideList ? "" : '<p class="govuk-body">';
  };
  md.renderer.rules.paragraph_close = function (tokens, idx) {
    const insideList = tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";
    return insideList ? "" : '</p>';
  };

  eleventyConfig.setLibrary("md", md);

  // ✅ Capture all private pages and generate private list
  eleventyConfig.addCollection("allDocs", function (collectionApi) {
    const all = collectionApi.getFilteredByGlob("./pages/**/*.md");

    // Clear previous run
    privatePagePaths = [];

    for (const page of all) {
      const tags = page.data.tags || [];
      if (tags.includes("private")) {
        let url = page.url;
        if (url.endsWith("/")) {
          url += "index.html";
        }
        privatePagePaths.push(url);
      }
    }

    return all;
  });

  // ✅ Write the private page list to disk after build
  eleventyConfig.on("afterBuild", () => {
    const outputPath = path.join(__dirname, "_site", "private-pages.json");
    fs.writeFileSync(outputPath, JSON.stringify(privatePagePaths, null, 2));
    console.log(`✅ Wrote ${privatePagePaths.length} private pages to private-pages.json`);
  });

  // Grouping docs by category (unchanged)
  eleventyConfig.addCollection("docsGroupedByCategory", function (collectionApi) {
    const docs = collectionApi.getFilteredByGlob("./pages/**/*.md");
    const grouped = {};

    for (let item of docs) {
      const category = item.data.category || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    }

    for (const category in grouped) {
      grouped[category].sort((a, b) => {
        const aOrder = a.data.order || 0;
        const bOrder = b.data.order || 0;
        return aOrder - bOrder;
      });
    }

    return grouped;
  });

  return {
    dir: {
      input: "pages",
      includes: "../layouts",
      output: "_site"
    }
  };
};
