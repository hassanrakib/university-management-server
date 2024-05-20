const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/'],
    },

    {
        rules: {
            'no-unused-vars': 'error',
            'no-console': 'warn',
            'no-unused-expressions': 'error',
            'prefer-const': 'error',
            'no-undef': 'error',
        },
    },
    eslintConfigPrettier,
];
