module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'error',
    'vue/attribute-hyphenation': 'off',
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'CONDITIONALS',
          'LIST_RENDERING',
          'UNIQUE',
          'RENDER_MODIFIERS',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'CONTENT',
          'EVENTS',
          'GLOBAL',
          'OTHER_ATTR'
        ]
      }
    ],
    'vue/no-v-html': 'off',
    'vue/arrow-spacing': 'error',
    'vue/eqeqeq': 'error',
    'vue/v-on-function-call': 'error',
    'no-extra-parens': 'error',
    'no-template-curly-in-string': 'error',
    'require-atomic-updates': 'error',
    curly: ['error', 'all'],
    eqeqeq: 'error',
    'no-eval': 'error',
    'require-await': 'error',
    strict: ['error', 'global'],
    'no-restricted-imports': ['error', { patterns: ['**/dist/*'] }],
    'import/no-self-import': 'error',
    'import/no-unresolved': ['error', { ignore: ['^@.*'] }]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)'],
      env: { jest: true }
    },
    {
      files: ['*.vue'],
      rules: { indent: 'off' }
    }
  ]
};
