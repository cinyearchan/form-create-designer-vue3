const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
    commonjs: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'object-curly-spacing': 'off',
    'no-console': isProduction ? 'warn' : 'off',
    'no-debugger': isProduction ? 'error' : 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index']
      }
    ],
    'prettier/prettier': 'error'
  }
}
