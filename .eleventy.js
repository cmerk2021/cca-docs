const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });

  // Add GOV.UK classes to headings
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

  // Add GOV.UK list and blockquote classes
  md.renderer.rules.bullet_list_open = () => '<ul class="govuk-list govuk-list--bullet">';
  md.renderer.rules.ordered_list_open = () => '<ol class="govuk-list govuk-list--number">';
  md.renderer.rules.blockquote_open = () => '<blockquote class="govuk-inset-text">';

  // Paragraph logic: only suppress <p> inside list items, otherwise use govuk-body
  md.renderer.rules.paragraph_open = function (tokens, idx) {
    const insideList =
      tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";

    if (insideList) {
      return ""; // suppress <p> inside list items
    }

    return '<p class="govuk-body">';
  };

  md.renderer.rules.paragraph_close = function (tokens, idx) {
    const insideList =
      tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";

    if (insideList) {
      return ""; // suppress </p> inside list items
    }

    return '</p>';
  };

  // DO NOT override text rule – this was nuking default Markdown formatting!
  // Leave md.renderer.rules.text = ... out entirely.

  eleventyConfig.setLibrary("md", md);

  // OPTIONAL: fix navigation if needed
  eleventyConfig.addCollection("docsGroupedByCategory", function (collectionApi) {
  const docs = collectionApi.getFilteredByGlob("./pages/**/*.md");

  const grouped = {};

  for (let item of docs) {
    const category = item.data.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  }

  // Sort items within each category
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
