module.exports = {
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.spec.ts'],
      },
    ],
    'import/extensions': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'generator-star-spacing': ['error', { before: true, after: false }],
    'no-plusplus': 'off',
  },
};
