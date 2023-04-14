const path = require('path');

const buildLintCommand = (filenames) =>
  `next lint ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

const buildPrettierCommand = (filenames) =>
  `prettier --check ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')} `;

module.exports = {
  '**/*.{js,jsx,ts,tsx}': [buildLintCommand],
  '**/*.{js,jsx,ts,tsx}': [buildPrettierCommand],
};
