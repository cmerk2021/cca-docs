const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });

  // GOV.UK tag classes
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

  // Default paragraph renderer
  const defaultParagraphOpen = md.renderer.rules.paragraph_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  const defaultParagraphClose = md.renderer.rules.paragraph_close || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  // Override paragraph rendering ONLY inside list items
  md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
    const prev = tokens[idx - 1];
    const next = tokens[idx + 1];
    const insideList = tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";

    // If the paragraph is inside a list item and it's tight (not followed by a hardbreak or blank line)
    if (insideList && prev.type === "list_item_open" && next && next.type === "inline") {
      return ""; // suppress <p>
    }

    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  md.renderer.rules.paragraph_close = function (tokens, idx, options, env, self) {
    const next = tokens[idx + 1];
    const insideList = tokens[idx - 2] && tokens[idx - 2].type === "list_item_open";

    if (insideList && next && next.type === "list_item_close") {
      return ""; // suppress </p>
    }

    return defaultParagraphClose(tokens, idx, options, env, self);
  };

  // GOV.UK paragraph default elsewhere
  md.renderer.rules.text = function (tokens, idx) {
    return tokens[idx].content;
  };

  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: "pages",
      includes: "../layouts",
      output: "_site"
    }
  };
};