
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;

const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const inputFile = readFileSync('./src/styles/style.css', 'utf8');
const outputDir = './public/dist/css';
const outputFile = 'style.min.css';

const ctx = {
  from: './src/styles/style.css',
  map: false,
  env: 'production',
};

postcssrc(ctx).then(({ plugins, options }) => {
  postcss(plugins)
    .process(inputFile, options)
    .then(result => {
      mkdirp(outputDir);
      writeFileSync(path.join(outputDir, outputFile), result.css, 'utf8');
    });
});