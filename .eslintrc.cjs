module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['standard', 'prettier', 'plugin:node/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] },
    ],
    'node/no-unpublished-require': [
      'warn',
      { allowModules: ['tailwind-scrollbar'] },
    ],
    'node/no-unpublished-import': ['warn'],
    'node/no-missing-import': ['warn'],
    'no-lone-blocks': ['off'],
    'no-unused-vars': ['warn'],
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: ['@next/env', '@ethersproject/constants'],
      },
    ],
  },
  settings: {
    node: { tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts'] },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
