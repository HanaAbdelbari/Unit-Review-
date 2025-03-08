const { FlatCompat } = require('@eslint/eslintrc');
const googleConfig = require('eslint-config-google');
const { defineConfig } = require('eslint-define-config');

// Create a compat instance
const compat = new FlatCompat({
    baseDirectory: __dirname, // Ensure this is set to your project's root directory
});

module.exports = defineConfig([
    ...compat.config(googleConfig),
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                browser: true,
                node: true,
            },
        },
        rules: {
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'indent': ['error', 2],
            'no-console': 'warn',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
        },
    },
]);