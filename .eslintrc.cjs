module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    '@kesills/airbnb-typescript', // Updated from 'airbnb-typescript'
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: '19.0',
    },
  },
  overrides: [
    {
      files: ['*.css'],
      rules: {
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
    {
      files: ['**/*.json'],
      plugins: ['json'],
      rules: {
        'json/*': 'error',
      },
    },
  ],
};