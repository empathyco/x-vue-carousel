const esLintRules = {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-template-curly-in-string': 'error',
  'require-atomic-updates': 'error',
  curly: ['error', 'all'],
  eqeqeq: 'error',
  'no-eval': 'error',
  'require-await': 'error',
  strict: ['error', 'global'],
  'no-restricted-imports': ['error', { patterns: ['**/dist/*'] }],
  indent: 'off',
  'no-empty-function': 'off',
  'no-unused-vars': 'off',
  'no-extra-parens': 'off',
  'no-unused-expressions': 'off'
};

const tsLintRules = {
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    { overrides: { methods: 'no-public', properties: 'off' } }
  ],
  '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-use-before-define': ['off', { functions: false }],
  '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  '@typescript-eslint/no-empty-function': ['error', { allow: ['protected-constructors'] }],
  '@typescript-eslint/no-parameter-properties': ['error', { allows: ['private', 'protected'] }],
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-object-literal-type-assertion': 'off',
  '@typescript-eslint/no-extra-parens': ['error', 'all', { nestedBinaryExpressions: false }],
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unused-expressions': ['error'],
  // Type information rules
  '@typescript-eslint/no-unused-vars-experimental': 'error',
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error'
};

const vuePluginRules = {
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
  'vue/eqeqeq': 'error',
  'vue/v-on-function-call': 'error'
};

const importPluginRules = {
  'import/no-self-import': 'error',
  'import/no-unresolved': ['error', { ignore: ['^@.*'] }]
};

const jestPluginRules = {
  'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
  'jest/lowercase-name': ['error', { ignore: ['test'] }],
  'jest/no-duplicate-hooks': 'error',
  'jest/no-expect-resolves': 'error',
  'jest/no-test-return-statement': 'error',
  'jest/prefer-hooks-on-top': 'error',
  'jest/require-top-level-describe': 'error',
  'jest/valid-title': 'error'
};

module.exports = {
  root: true,
  env: { node: true },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json', // required for rules that need type information
    extraFileExtensions: ['.vue']
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest/style',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'prettier/prettier': 'error',
    ...esLintRules,
    ...tsLintRules,
    ...vuePluginRules,
    ...importPluginRules,
    ...jestPluginRules
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
