module.exports = function (eleventyConfig) {
  // Passthrough static assets
  eleventyConfig.addPassthroughCopy('styles.css');
  eleventyConfig.addPassthroughCopy('script.js');
  eleventyConfig.addPassthroughCopy('index-script.js');
  eleventyConfig.addPassthroughCopy('include-partials.js');
  eleventyConfig.addPassthroughCopy('favicon.svg');
  eleventyConfig.addPassthroughCopy('manifest.webmanifest');
  eleventyConfig.addPassthroughCopy('research/references');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('assets');

  return {
    dir: {
      input: '.',
      includes: 'partials',
      layouts: 'layouts',
      data: '_data',
      output: 'build',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'njk', 'md'],
  };
};
