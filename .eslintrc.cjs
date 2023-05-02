/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [1, 'never'],
    quotes: [1, 'single'],
    eqeqeq: [1, 'always'],
    camelcase: 0,
    'no-undef': 1,
    'prefer-const': 1,
    '@typescript-eslint/no-unused-vars': 1,
    'comma-dangle': [1, 'always-multiline'],
    'max-len': [1, { code: 9999, tabWidth: 2 }],
    'prefer-rest-params': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'vue/no-reserved-keys': 0,
    'vue/require-prop-type-constructor': 0,
    'template-curly-spacing': 0,
    'space-before-function-paren': 0,
    'linebreak-style': 0,
    'no-redeclare': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
